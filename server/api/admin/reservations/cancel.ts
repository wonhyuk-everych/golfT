import { createError, readBody } from 'h3'
import { getPool } from '~/server/utils/db'
import crypto from 'crypto'
import type { RowDataPacket } from 'mysql2'

interface CancelRequestBody {
  reservation_idx: string;
  item_type: 'all' | 'golf' | 'hotel' | 'caddy' | 'tournament';
  item_idx?: number;
  cancel_reason: string;
}

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session || session?.user?.role !== 'A') {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const memberIdx = session.user.member_idx

  // Get request body
  const body = await readBody<CancelRequestBody>(event)
  const { reservation_idx, item_type, item_idx, cancel_reason } = body

  if (!reservation_idx || !item_type || !cancel_reason) {
    throw createError({ statusCode: 400, message: '필수 정보가 누락되었습니다.' })
  }

  // item_type이 ALL이 아닌데 item_idx가 없는 경우
  if (item_type !== 'all' && !item_idx) {
    throw createError({ statusCode: 400, message: 'item_idx가 필요합니다.' })
  }

  console.log('Cancellation request received:', { reservation_idx, item_type, item_idx })

  const pool = getPool()
  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()

    // 1. toss_payment_key 조회
    const [paymentRows] = await connection.query<RowDataPacket[]>(
      'SELECT toss_payment_key, total_price FROM reservation_master WHERE reservation_idx = ?',
      [reservation_idx]
    )

    if (!paymentRows || !(paymentRows as RowDataPacket[]).length) {
      throw createError({ statusCode: 404, message: '예약 정보를 찾을 수 없습니다.' })
    }

    const { toss_payment_key, total_price } = paymentRows[0]
    
    if (!toss_payment_key) {
      throw createError({ statusCode: 400, message: '결제 정보를 찾을 수 없습니다.' })
    }

    // 취소 금액 계산 (전체 취소인 경우 전체 금액, 부분 취소인 경우 해당 아이템 금액)
    // 실제로는 각 아이템별 금액을 조회해야 함
    let cancelAmount = total_price
    
    if (item_type !== 'all') {
      // 부분 취소인 경우 해당 아이템의 금액을 조회
      const tableName = `reservation_${item_type}`
      const idxColumnName = `reservation_${item_type}_idx`
      
      const [itemRows] = await connection.query<RowDataPacket[]>(
        `SELECT total_price FROM ${tableName} WHERE ${idxColumnName} = ?`,
        [item_idx]
      )
      
      if (itemRows && itemRows.length > 0 && itemRows[0].total_price) {
        cancelAmount = itemRows[0].total_price
      }
    }


    // 2. toss 취소 요청 - 시크릿 키를 런타임 설정에서 로드
    const config = useRuntimeConfig(event)
    const encodedSecretKey = Buffer.from(`${config.tossPaymentsSecretKey}:`).toString('base64')

    let cancelParameter = null
    if(item_type === 'all'){
      cancelParameter = {
        cancelReason: cancel_reason
      }
    }else{
      cancelParameter = {
        cancelReason: cancel_reason,
        cancelAmount: cancelAmount
      }
    }
    
    // 멱등성 키 생성 (랜덤 문자열)
    const idempotencyKey = crypto.randomBytes(16).toString('hex')
    let tossResponse: Record<string, any>
    try {
      const url = `https://api.tosspayments.com/v1/payments/${toss_payment_key}/cancel`
      const options = {
        method: 'POST',
        headers: {
          Authorization: `Basic ${encodedSecretKey}`,
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey
        },
        body: JSON.stringify(cancelParameter)
      }
      tossResponse = await fetch(url, options)
      tossResponse = await tossResponse.json()
      console.log('Toss payment cancellation response:', tossResponse)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류'
      console.error('예약 취소 처리 중 오류 발생:', errorMessage)
      throw createError({
        statusCode: 500,
        statusMessage: '예약 취소 처리 중 오류가 발생했습니다.'
      })
    }

    // 3. reservation_master 테이블 update
    await connection.query(
      'UPDATE reservation_master SET reservation_status = ?, cancel_date = NOW(), cancel_reason = ? WHERE reservation_idx = ?',
      [item_type === 'all' ? 'CANCELLED' : 'PARTIALLY_CANCELLED', cancel_reason, reservation_idx]
    )

    // 예약 취소 처리를 위한 헬퍼 함수
    async function cancelReservationItem(type: string, reservationIdx: string, itemIdx?: number) {
      const tableName = `reservation_${type}`
      const idxColumnName = `reservation_${type}_idx`
      
      if (itemIdx) {
        // 특정 아이템 업데이트
        await connection.query(
          `UPDATE ${tableName} SET reservation_status = ?, cancel_reason = ? WHERE ${idxColumnName} = ?`,
          ['CANCELLED', cancel_reason, itemIdx]
        )
        
        // 특정 아이템 취소 히스토리 저장
        await insertCancellationHistory(reservationIdx, itemIdx, type, cancelAmount)
      } else {
        // 해당 타입의 모든 아이템 조회
        const [rows] = await connection.query<RowDataPacket[]>(
          `SELECT ${idxColumnName}, total_price FROM ${tableName} WHERE reservation_idx = ?`,
          [reservationIdx]
        )
        
        if (rows && rows.length > 0) {
          // 모든 아이템 업데이트
          await connection.query(
            `UPDATE ${tableName} SET reservation_status = ?, cancel_reason = ? WHERE reservation_idx = ?`,
            ['CANCELLED', cancel_reason, reservationIdx]
          )
          
          // 각 아이템마다 취소 히스토리 저장
          for (const row of rows) {
            const itemIdxValue = row[idxColumnName as keyof typeof row] as number
            const itemPrice = row.total_price || 0
            await insertCancellationHistory(reservationIdx, itemIdxValue, type, itemPrice)
          }
        }
      }
    }
    
    // 취소 히스토리 저장 헬퍼 함수
    async function insertCancellationHistory(
      reservationIdx: string, 
      itemIdx: number, 
      itemType: string, 
      amount: number
    ) {
      await connection.query(
        `INSERT INTO reservation_cancel (
          reservation_idx,
          reservation_type_idx,
          cancel_type,
          cancel_reason,
          cancel_amount,
          cancel_data,
          created_member_idx
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          reservationIdx,
          itemIdx,
          itemType,
          cancel_reason,
          amount,
          JSON.stringify(tossResponse),
          memberIdx
        ]
      )
    }

    // 4 & 5. 아이템 타입에 따른 테이블 업데이트
    if (item_type === 'all') {
      // 모든 예약 타입 취소 처리
      const reservationTypes = ['golf', 'hotel', 'caddy', 'tournament']
      
      for (const type of reservationTypes) {
        await cancelReservationItem(type, reservation_idx)
      }
    } else {
      // 특정 예약 타입만 취소 처리
      await cancelReservationItem(item_type, reservation_idx, item_idx as number)
    }

    await connection.commit()
    
    return {
      success: true,
      message: `예약 ${item_type === 'all' ? '전체' : item_type} 취소가 완료되었습니다.`,
      reservation_idx
    }
  } catch (error) {
    await connection.rollback()
    console.error('Reservation cancellation error:', error)
    
    throw createError({ 
      statusCode: error.statusCode || 500, 
      message: error.message || '예약 취소 중 오류가 발생했습니다.' 
    })
  } finally {
    connection.release()
  }
})
