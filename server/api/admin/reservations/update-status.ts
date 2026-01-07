import { createError, readBody } from 'h3'
import { getPool } from '~/server/utils/db'

interface UpdateStatusRequestBody {
  reservation_idx: string;
  item_type: 'all' | 'golf' | 'hotel' | 'caddy' | 'tournament';
  item_idx?: number;
  status: 'PENDING' | 'REFUND_REQUEST' | 'CANCELLED' | 'PARTIALLY_CANCELLED' | 'COMPLETE';
}

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session || session?.user?.role !== 'A') {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const memberIdx = session.user.member_idx

  // Get request body
  const body = await readBody<UpdateStatusRequestBody>(event)
  const { reservation_idx, item_type, item_idx, status } = body

  if (!reservation_idx || !item_type || !status) {
    throw createError({ statusCode: 400, message: '필수 정보가 누락되었습니다.' })
  }

  // item_type이 ALL이 아닌데 item_idx가 없는 경우
  if (item_type !== 'all' && !item_idx) {
    throw createError({ statusCode: 400, message: 'item_idx가 필요합니다.' })
  }

  console.log('Status update request received:', { reservation_idx, item_type, item_idx, status })

  const pool = getPool()
  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()

    // 1. reservation_master 테이블 update
    if (item_type === 'all') {
      await connection.query(
        'UPDATE reservation_master SET reservation_status = ? WHERE reservation_idx = ?',
        [status, reservation_idx]
      )
    } else if (status === 'CANCELLED' || status === 'PARTIALLY_CANCELLED') {
      // 부분 취소인 경우 마스터 상태를 PARTIALLY_CANCELLED로 변경
      await connection.query(
        'UPDATE reservation_master SET reservation_status = ? WHERE reservation_idx = ?',
        ['PARTIALLY_CANCELLED', reservation_idx]
      )
    }

    // 예약 상태 업데이트를 위한 헬퍼 함수
    async function updateReservationItemStatus(type: string, reservationIdx: string, newStatus: string, itemIdx?: number) {
      const tableName = `reservation_${type}`
      const idxColumnName = `reservation_${type}_idx`
      
      if (itemIdx) {
        // 특정 아이템 업데이트
        await connection.query(
          `UPDATE ${tableName} SET reservation_status = ? WHERE ${idxColumnName} = ?`,
          [newStatus, itemIdx]
        )
      } else {
        // 해당 타입의 모든 아이템 업데이트
        await connection.query(
          `UPDATE ${tableName} SET reservation_status = ? WHERE reservation_idx = ?`,
          [newStatus, reservationIdx]
        )
      }
    }

    // 아이템 타입에 따른 테이블 업데이트
    if (item_type === 'all') {
      // 모든 예약 타입 상태 업데이트
      const reservationTypes = ['golf', 'hotel', 'caddy', 'tournament']
      
      for (const type of reservationTypes) {
        await updateReservationItemStatus(type, reservation_idx, status)
      }
    } else {
      // 특정 예약 타입만 상태 업데이트
      await updateReservationItemStatus(item_type, reservation_idx, status, item_idx as number)
    }

    await connection.commit()
    
    return {
      success: true,
      message: `예약 ${item_type === 'all' ? '전체' : item_type} 상태가 ${status}로 변경되었습니다.`,
      reservation_idx
    }
  } catch (error: unknown) {
    await connection.rollback()
    console.error('Reservation status update error:', error)
    
    const errorMessage = error instanceof Error ? error.message : '예약 상태 변경 중 오류가 발생했습니다.'
    const errorStatus = error instanceof Error && 'statusCode' in error ? (error as any).statusCode : 500
    
    throw createError({ 
      statusCode: errorStatus, 
      message: errorMessage
    })
  } finally {
    connection.release()
  }
})
