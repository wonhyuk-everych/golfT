<template>
  <div class="flex flex-col gap-4 w-full">
    <!-- 섹션 제목 -->
    <div class="flex flex-row justify-stretch items-stretch w-full gap-2.5 px-4">
      <h2 class="text-text-primary text-base font-bold">⛳ 예약 변경 및 취소/환불 정책</h2>
    </div>

    <!-- 정책 내용 -->
    <div class="flex flex-col gap-4 px-4">
      <!-- 안내 문구 -->
      <div class="flex flex-col gap-1">
        <span class="text-primary text-sm font-bold">골프T 예약 변경 및 취소 정책</span>
        <span class="text-text-tertiary text-xs">※ 골프T 자체 수수료는 없습니다. </span>
        <span class="text-text-tertiary text-xs">단, 호텔/투어/차량 등 상품 공급처에서 부과하는 패널티는 발생할 수 있습니다.</span>
        <span class="text-text-tertiary text-xs">※ 여행 상품의 최대 예약 기간은 6개월 이내입니다.</span>
      </div>

      <!-- 1. 골프 예약 변경 및 취소 수수료 -->
      <div class="flex flex-col gap-1">
        <span class="text-primary text-sm font-bold">1. 골프 예약 변경 및 취소 수수료</span>
        <ul class="list-disc pl-5 text-text-secondary text-sm">
          <li>이용일 8일 이전: 전액 환불</li>
          <li>이용일 7~4일 전: 예약금 총 금액의 50%</li>
          <li>이용일 3일~당일: 전액 환불 불가</li>
        </ul>
      </div>

      <!-- 2. 호텔 예약 변경 및 취소 수수료 -->
      <div class="flex flex-col gap-1">
        <span class="text-primary text-sm font-bold">2. 호텔 예약 변경 및 취소 수수료</span>
        <div class="flex flex-col gap-1 text-text-secondary text-sm">
          <span class="font-semibold">■ 비수기 (4/1 ~ 10/31)</span>
          <ul class="list-disc pl-5">
            <li>체크인 8일 이전: 전액 환불</li>
            <li>체크인 7~2일 전: 1박 요금 패널티</li>
            <li>체크인 전일~당일 및 노쇼: 전액 환불 불가</li>
          </ul>
          <span class="font-semibold mt-2">■ 성수기 (11/1 ~ 다음해 3/31)</span>
          <ul class="list-disc pl-5">
            <li>체크인 15일 이전: 전액 환불</li>
            <li>체크인 14~3일 전: 1박 요금 패널티</li>
            <li>체크인 2일 전~당일 및 노쇼: 전액 환불 불가</li>
          </ul>
        </div>
      </div>

      <!-- 3. 차량 예약 변경 및 취소 수수료 -->
      <div class="flex flex-col gap-1">
        <span class="text-primary text-sm font-bold">3. 차량 예약 변경 및 취소 수수료</span>
        <ul class="list-disc pl-5 text-text-secondary text-sm">
          <li>2일 이전: 전액 환불</li>
          <li>전일: 예약금의 50%</li>
          <li>당일: 전액 환불 불가</li>
        </ul>
      </div>

      <!-- 4. 일일투어/쇼/스파/레스토랑/입장권 -->
      <div class="flex flex-col gap-1">
        <span class="text-primary text-sm font-bold">4. 일일투어/쇼/스파/레스토랑/입장권</span>
        <ul class="list-disc pl-5 text-text-secondary text-sm">
          <li>이용일 2일 이전: 전액 환불</li>
          <li>이용일 전일 또는 당일: 전액 환불 불가</li>
        </ul>
      </div>

      <!-- 5. 환불 정책 -->
      <div class="flex flex-col gap-1">
        <span class="text-primary text-sm font-bold">5. 환불 정책</span>
        <ul class="list-disc pl-5 text-text-secondary text-sm">
          <li>무통장 입금: 환불 계좌 제출 후 5~7일 소요</li>
          <li>카드 결제: 카드사 승인취소 기준</li>
        </ul>
      </div>

      <!-- 6. 예약 변경 및 취소 시 유의사항 -->
      <div class="flex flex-col gap-1">
        <span class="text-primary text-sm font-bold">6. 예약 변경 및 취소 시 유의사항</span>
        <ul class="list-disc pl-5 text-text-secondary text-sm">
          <li>※ 기준 시각은 한국 시간 18:00이며, 이후 요청은 다음 날 접수로 간주</li>
          <li>※ 주말과 공휴일은 제외하고 영업일 기준으로 처리</li>
          <li>※ 일부 상품은 공급처의 규정에 따라 별도 취소 적용</li>
          <li>※ 호텔 조기 체크인/체크아웃 등은 환불 불가능</li>
          <li>※ 예약자 정보 오류, 여권 문제, 비자 지연 등 개인 사유는 환불 사유가 되지 않음</li>
          <li>※ 현지 기상 상황 등으로 일정이 변경되더라도 전액 환불 불가능</li>
          <li>※ 취소 요청은 반드시 골프티, 홈페이지, 채널톡, 카카오톡을 통해 접수해야 처리 가능</li>
        </ul>
      </div>

      <!-- 환불 계좌 정보 -->
      <div class="flex flex-col gap-1 bg-primary bg-opacity-10 rounded-[12px] p-3">
        <span class="text-primary text-sm font-bold">환불 계좌 정보</span>
        <div class="text-text-secondary text-sm">
          한국 계좌:  우리은행 1005 104 393964 (주)골프티
        </div>
      </div>
    </div>
  </div>
</template>
