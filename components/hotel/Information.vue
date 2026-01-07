<template>
  <div class="flex flex-col w-full gap-4 pt-[40px] pb-[40px]">
    <!-- Toast 메시지는 WishButton 컴포넌트 내부에서 처리됨 -->
    <!-- 호텔 정보 헤더 섹션 -->
    <div class="flex flex-col justify-center items-center w-full gap-4 px-4">
      <div class="flex flex-row justify-stretch items-stretch w-full gap-[-10px] py-2 px-4">
        <div class="flex flex-col gap-2 w-full">
          <!-- 호텔 이름 및 찜하기 버튼 -->
          <div class="flex flex-row justify-between items-start w-full">
            <div class="flex flex-col w-full gap-0.5">
              <h1 class="text-text-primary text-2xl w-full font-bold">{{ hotel.name_kr }}</h1>
              <p class="text-text-secondary text-base w-full">{{ hotel.name_en }}</p>
            </div>
            <!-- 찜하기 버튼 -->
            <WishButton 
              :product-idx="hotel.hotel_idx" 
              type="H" 
              :wish-idx="hotel.wish_idx"
              @update:wish-status="updateWishStatus"
            />
          </div>
          
          <!-- 평점 및 리뷰 -->
          <div class="flex flex-row items-center gap-1">
            <div class="flex flex-row items-center">
              <span class="text-primary text-sm">★</span>
              <span class="text-text-tertiary text-sm">{{ hotel.rating }}</span>
            </div>
            <div class="flex flex-row items-center">
              <span class="text-text-tertiary text-sm">(</span>
              <div class="flex flex-row items-center gap-0.5">
                <span class="text-text-tertiary text-sm">{{ hotel.review_count }}</span>
                <span class="text-text-tertiary text-sm">Reviews</span>
              </div>
              <span class="text-text-tertiary text-sm">)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 호텔 설명 섹션 -->
      <div class="flex flex-col justify-center w-full gap-2">
        <!-- 설명 텍스트 -->
        <div class="flex flex-col justify-center w-full">
          <div class="flex flex-row justify-stretch items-stretch w-full gap-2.5 px-4">
            <p class="text-text-secondary text-sm w-full">
              {{ isExpanded ? hotel.explain_hotel : truncatedDescription }}
              <span v-if="!isExpanded && hotel && hotel.explain_hotel && hotel.explain_hotel.length > maxLength">...</span>
            </p>
          </div>
        </div>
        
        <!-- 더보기 버튼 -->
        <div v-if="hotel && hotel.explain_hotel && hotel.explain_hotel.length > maxLength" class="flex flex-row items-center gap-1.5 px-4" @click="toggleDescription">
          <span class="text-primary text-sm cursor-pointer">{{ isExpanded ? $t("hotelInfo.hide") : $t("hotelInfo.show") }}</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-primary" :style="{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }">
            <path d="M12 6L8 10L4 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>

      <Divider />

      <!-- 주변 관광지 및 대중 교통 -->
      <div class="flex flex-col gap-4 w-full">
        <!-- 섹션 제목 -->
        <div class="flex flex-row justify-stretch items-stretch w-full gap-2.5 px-4">
          <h2 class="text-text-primary text-base font-bold">🏨 {{ $t('hotelInfo.tourAndTransportation') }}</h2>
        </div>

        <!-- 정보 그리드 -->
        <div class="flex flex-col gap-6 px-4">
          <!-- 주변 관광지 -->
          <TextList :title="$t('hotelInfo.tour')" :text="hotel.tour" />

          <!-- 대중 교통 -->
          <TextList :title="$t('hotelInfo.transportation')" :text="hotel.transportation" />

        </div>
      </div>

      <Divider />

      <!---->
      <div class="flex flex-col gap-4 w-full">
        <!-- 섹션 제목 -->
        <div class="flex flex-row justify-stretch items-stretch w-full gap-2.5 px-4">
          <h2 class="text-text-primary text-base font-bold">🏨 {{ $t('hotelInfo.hotelInfo') }}</h2>
        </div>

        <!-- 정보 그리드 -->
        <div class="flex flex-col gap-6 px-4">
          <!-- 지역 정보 -->
          <div class="flex flex-col gap-1">
            <span class="text-primary text-sm font-bold">{{ $t('hotelInfo.countryCity') }}</span>
            <span class="text-text-secondary text-sm">{{ hotel.country_code }} - {{ hotel.city_code }}</span>
          </div>

          <!-- 주소 -->
          <div class="flex flex-col gap-1">
            <span class="text-primary text-sm font-bold">{{ $t('hotelInfo.address') }}</span>
            <span class="text-text-secondary text-sm">{{ hotel.address }}</span>
          </div>

          <!-- 체크인 -->
          <div class="flex flex-col gap-1">
            <span class="text-primary text-sm font-bold">{{ $t('hotelInfo.checkIn') }}</span>
            <span class="text-text-secondary text-sm">{{ formatTimeToAmPm(hotel.check_in) }} 이후</span>
          </div>

          <!-- 체크 아웃 -->
          <div class="flex flex-col gap-1">
            <span class="text-primary text-sm font-bold">{{ $t('hotelInfo.checkOut') }}</span>
            <span class="text-text-secondary text-sm">{{ formatTimeToAmPm(hotel.check_out) }} 이전</span>
          </div>

          <!-- 홈페이지 -->
          <div class="flex flex-col gap-1">
            <span class="text-primary text-sm font-bold">{{ $t('hotelInfo.homePage') }}</span>
            <a
              v-if="hotel.home_page"
              :href="normalizedHomePage"
              class="text-primary text-sm underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ $t('hotelInfo.goToHomepage') || '홈페이지로 이동' }}
            </a>
            <span v-else class="text-text-tertiary text-sm">-</span>
          </div>

          <!-- 언어 -->
          <div class="flex flex-col gap-1">
            <span class="text-primary text-sm font-bold">{{ $t('hotelInfo.language') }}</span>
            <span class="text-text-secondary text-sm">{{ hotel.language }}</span>
          </div>
        </div>
      </div>

      <Divider />

      <!-- 객실 타입 -->
      <div class="flex flex-col gap-4 w-full">
        <!-- 섹션 제목 -->
        <div class="flex flex-row justify-stretch items-stretch w-full gap-2.5 px-4">
          <h2 class="text-text-primary text-base font-bold">🏨 {{ $t('hotelInfo.roomTypeAndFacility') }}</h2>
        </div>

        <!-- 정보 그리드 -->
        <div class="flex flex-col gap-6 px-4">
          <!-- 객실 타입 -->
          <TextList :title="$t('hotelInfo.roomType')" :text="hotel.room_type" />

          <!-- 객실별 별도 시설 -->
          <TextList :title="$t('hotelInfo.roomFacility')" :text="hotel.room_facility" />

        </div>
      </div>

      <Divider />

      <!-- 시설 / 서비스-->
      <div class="flex flex-col gap-4 w-full">
        <!-- 섹션 제목 -->
        <div class="flex flex-row justify-stretch items-stretch w-full gap-2.5 px-4">
          <h2 class="text-text-primary text-base font-bold">🏨 {{ $t('hotelInfo.facilitiesAndServices') }}</h2>
        </div>

        <!-- 정보 그리드 -->
        <div class="flex flex-col gap-6 px-4">
          <TextList :title="$t('hotelInfo.hotelFacilities')" :text="hotel.hotel_facility_info" />
          <TextList :title="$t('hotelInfo.roomFacilities')" :text="hotel.room_facility_info" />
          <!-- 호텔 시설 / 서비스
          <div class="flex flex-col gap-1">
            <span class="text-primary text-sm font-bold">{{ $t('hotelInfo.hotelFacilities') }}</span>
            <div :class="{'grid grid-cols-2 gap-x-4': hotel.hotel_facilities.length >= 10, 'flex flex-col': hotel.hotel_facilities.length < 10}">
              <li v-for="facility in hotel.hotel_facilities" :key="facility" class="text-text-secondary text-sm">{{ facility }}</li>
            </div>
          </div>-->

          <!-- 객실 시설 / 서비스
          <div class="flex flex-col gap-1">
            <span class="text-primary text-sm font-bold">{{ $t('hotelInfo.roomFacilities') }}</span>
            <div :class="{'grid grid-cols-2 gap-x-4': hotel.room_facilities.length >= 10, 'flex flex-col': hotel.room_facilities.length < 10}">
              <li v-for="facility in hotel.room_facilities" :key="facility" class="text-text-secondary text-sm">{{ facility }}</li>
            </div>
          </div>-->

          <!-- 골프 T에 사전 예약 필요-->
          <div class="flex flex-col gap-1">
            <span class="text-primary text-sm font-bold">{{ $t('hotelInfo.extraOptions') }}</span>
            <div :class="{'grid grid-cols-2 gap-x-4': hotel.extra_options.length >= 10, 'flex flex-col': hotel.extra_options.length < 10}">
              <li v-for="option in hotel.extra_options" :key="option" class="text-text-secondary text-sm">{{ option }}</li>
            </div>
          </div>

        </div>
      </div>

      <Divider />

      <!-- 주의 사항 -->
      <div class="flex flex-col gap-4 w-full">
        <!-- 섹션 제목 -->
        <div class="flex flex-row justify-stretch items-stretch w-full gap-2.5 px-4">
          <h2 class="text-text-primary text-base font-bold">🏨 {{ $t('hotelInfo.extraChargeAndCaution') }}</h2>
        </div>

        <!-- 정보 그리드 -->
        <div class="flex flex-col gap-6 px-4">
          <!-- 추가 요금 발생 사항 -->
          <TextList :title="$t('hotelInfo.extraCharge')" :text="hotel.extra_charge" />

          <!-- 주의 사항 -->
          <TextList :title="$t('hotelInfo.caution')" :text="hotel.caution" />

          <!-- 환불 규정 -->
          <TextList :title="$t('hotelInfo.refundInfo')" :text="hotel.refund_info" />

        </div>
      </div>

      <Divider v-if="hotel.check_info" />

      <!-- 확인 사항 -->
      <div v-if="hotel.check_info" class="flex flex-col gap-4 w-full">
        <!-- 섹션 제목 -->
        <div class="flex flex-row justify-stretch items-stretch w-full gap-2.5 px-4">
          <h2 class="text-text-primary text-base font-bold">🏨 {{ $t('hotelInfo.checkInfo') }}</h2>
        </div>

        <!-- 정보 그리드 -->
        <div class="flex flex-col gap-6 px-4">
          <img :src="hotel.check_info" alt="">
        </div>
      </div>

      <Divider />

      <Policy />

    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { formatTimeToAmPm } from '~/utils/formatters'
import TextList from '~/components/hotel/TextList.vue'
import WishButton from '~/components/common/WishButton.vue'
import Policy from '~/components/common/Policy.vue'
import Divider from '~/components/common/Divider.vue'

interface Hotel {
  id: number
  name_kr: string
  name_en: string
  explain_hotel: string
  explain_short: string
  country_code: string
  city_code: string
  address: string
  check_in: number
  check_out: number
  home_page: string
  rooms: Room[]
  service_info: string
  pay_info: string
  refund_info: string
  check_info: string
  tour: string
  transportation: string
  language: string
  room_type: string
  room_facility: string
  extra_charge: string
  caution: string
  hotel_facilities: string[]
  room_facilities: string[]
  extra_options: string[]
  rating?: number
  review_count?: number
  is_wished?: number
  wish_idx?: number
  hotel_facility_info: string
  room_facility_info: string
}

interface Room {
  id: number
  name: string
}

interface Props {
  hotel: Hotel
}

const props = defineProps<Props>()

// 설명 텍스트 관련 상태 및 로직
const isExpanded = ref(false)
const maxLength = 100 // 최대 표시 글자 수

const truncatedDescription = computed(() => {
  if (!props.hotel || !props.hotel.explain_hotel) {
    return '';
  }
  if (props.hotel.explain_hotel.length <= maxLength) {
    return props.hotel.explain_hotel;
  }
  return props.hotel.explain_hotel.substring(0, maxLength);
});

const toggleDescription = () => {
  isExpanded.value = !isExpanded.value
}

// 홈 페이지 URL 정규화 (프로토콜 없을 시 https 추가)
const normalizedHomePage = computed(() => {
  const url = props.hotel?.home_page?.trim() || ''
  if (!url) return ''
  if (/^https?:\/\//i.test(url)) return url
  return `https://${url}`
})

// 찜 상태 업데이트 핸들러
const updateWishStatus = (status: { isWished: boolean, wishId: number | null }) => {
  // 필요한 경우 여기서 추가 로직 처리
}
</script>