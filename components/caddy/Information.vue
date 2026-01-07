<template>
  <div class="flex flex-col w-full gap-4 pt-[40px]">
    <!-- Toast 메시지는 WishButton 컴포넌트 내부에서 처리됨 -->
    <!-- 골프장 정보 헤더 섹션 -->
    <div class="flex flex-col justify-center items-center w-full gap-4 px-4">
      <div class="flex flex-row justify-stretch items-stretch w-full gap-[-10px] py-2 px-4">
        <div class="flex flex-col gap-2 w-full">
          <!-- 캐디 이름 -->
          <div class="flex flex-row justify-between items-center w-full gap-0.5">
            <div class="flex flex-col">
              <h1 class="text-text-primary text-2xl w-full font-bold">{{ caddy.name }} ({{ caddy.caddy_code }})</h1>
              <p v-if="caddy.nick_name" class="text-text-secondary text-base w-full">{{ caddy.nick_name }}</p>
            </div>
            <!-- 찜하기 버튼 -->
            <WishButton 
              :product-idx="caddy.caddy_idx" 
              type="C" 
              :wish-idx="caddy.wish_idx"
              @update:wish-status="updateWishStatus"
            />
          </div>

          <!-- 평점 및 리뷰 -->
          <div class="flex flex-row items-center gap-1">
            <div class="flex flex-row items-center">
              <span class="text-primary text-sm">★</span>
              <span class="text-text-tertiary text-sm">{{ caddy.average_rating }}</span>
            </div>
            <div class="flex flex-row items-center">
              <span class="text-text-tertiary text-sm">(</span>
              <div class="flex flex-row items-center gap-0.5">
                <span class="text-text-tertiary text-sm">{{ caddy.review_count }}</span>
                <span class="text-text-tertiary text-sm">Reviews</span>
              </div>
              <span class="text-text-tertiary text-sm">)</span>
            </div>
          </div>
          
          <!-- 골프장 정보 -->
          <div class="flex flex-row items-center gap-1">
            <span class="text-text-tertiary text-sm">{{ caddy.golfNameKr }} / {{ caddy.golfNameEn }}</span>
          </div>
        </div>
      </div>

      <Divider />

      <!-- 상품 핵심 정보 -->
      <div class="flex flex-col gap-4 w-full">
        <!-- 섹션 제목 -->
        <div class="flex flex-row justify-stretch items-stretch w-full gap-2.5 px-4">
          <h2 class="text-text-primary text-base font-bold">⛳ {{ $t('caddyInfo.information') }}</h2>
        </div>

        <!-- 정보 그리드 -->
        <div class="flex flex-col gap-6 px-4">
          <!-- 이름 -->
          <div class="flex flex-col gap-1">
            <span class="text-primary text-sm font-bold">{{ $t('caddyInfo.name') }}</span>
            <span class="text-text-secondary text-sm">{{ caddy.name }}</span>
          </div>

          <!-- 닉네임 -->
          <div class="flex flex-col gap-1">
            <span class="text-primary text-sm font-bold">{{ $t('caddyInfo.nickName') }}</span>
            <span class="text-text-secondary text-sm">{{ caddy.nick_name }}</span>
          </div>

          <!-- 캐디 번호 -->
          <div class="flex flex-col gap-1">
            <span class="text-primary text-sm font-bold">{{ $t('caddyInfo.caddyCode') }}</span>
            <span class="text-text-secondary text-sm">{{ caddy.caddy_code }}</span>
          </div>

          <!-- 나이 -->
          <div class="flex flex-col gap-1">
            <span class="text-primary text-sm font-bold">{{ $t('caddyInfo.age') }}</span>
            <span class="text-text-secondary text-sm">{{ caddy.age }}</span>
          </div>

          <!-- 키 -->
          <div class="flex flex-col gap-1">
            <span class="text-primary text-sm font-bold">{{ $t('caddyInfo.height') }}</span>
            <span class="text-text-secondary text-sm">{{ caddy.height }}</span>
          </div>

          <!-- 구사 가능 언어 -->
          <div class="flex flex-col gap-1">
            <span class="text-primary text-sm font-bold">{{ $t('caddyInfo.language') }}</span>
            <div v-if="caddy.language">
              <div v-if="hasNewlines(caddy.language)" class="text-text-secondary text-sm">
                <ul class="list-disc pl-5">
                  <li v-for="(item, index) in splitTextToList(caddy.language)" :key="index">
                    {{ item }}
                  </li>
                </ul>
              </div>
              <span v-else class="text-text-secondary text-sm">{{ caddy.language }}</span>
            </div>
          </div>

          <!-- 레인 체크 정책-->
          <div class="flex flex-col gap-1">
            <span class="text-primary text-sm font-bold">{{ $t('caddyInfo.specialty') }}</span>
            <div v-if="caddy.specialty">
              <div v-if="hasNewlines(caddy.specialty)" class="text-text-secondary text-sm">
                <ul class="list-disc pl-5">
                  <li v-for="(item, index) in splitTextToList(caddy.specialty)" :key="index">
                    {{ item }}
                  </li>
                </ul>
              </div>
              <span v-else class="text-text-secondary text-sm">{{ caddy.specialty }}</span>
            </div>
          </div>

          <!-- 휴일 -->
          <div class="flex flex-col gap-1">
            <span class="text-primary text-sm font-bold">{{ $t('caddyInfo.dayOff') }}</span>
            <span class="text-text-secondary text-sm">{{ caddy.day_off }}</span>
          </div>

          <!-- 경험 --> 
          <div class="flex flex-col gap-1">
            <span class="text-primary text-sm font-bold">{{ $t('caddyInfo.golfExperience') }}</span>
            <span class="text-text-secondary text-sm">{{ caddy.golf_experience == 'Y' ? $t('caddyInfo.yes') : $t('caddyInfo.no') }}</span>
          </div>
        </div>
      </div>

      <Divider />

      <div class="flex flex-col gap-4 w-full">
        <!-- 섹션 제목 -->
        <div class="flex flex-row justify-stretch items-stretch w-full gap-2.5 px-4">
          <h2 class="text-text-primary text-base font-bold">⛳ {{ $t('caddyInfo.cost') }}</h2>
        </div>

        <!-- 정보 그리드 -->
        <div class="flex flex-col gap-6 px-4">
          <!-- 캐디 비용 -->
          <div class="flex flex-col gap-1">
            <span class="text-primary text-sm font-bold">{{ $t('caddyInfo.price') }}</span>
            <span class="text-text-secondary text-sm">{{ formatPriceWithRate(caddy.price, locale) }}</span>
          </div>

          <!-- 캐디 예약 수수료 -->
          <div class="flex flex-col gap-1">
            <span class="text-primary text-sm font-bold">{{ $t('caddyInfo.reservationFee') }}</span>
            <span class="text-text-secondary text-sm">{{ formatPriceWithRate(caddy.reservation_fee, locale) }}</span>
          </div>
        </div>
      </div>

      <Divider />

      <div class="flex flex-col gap-4 w-full">
        <!-- 섹션 제목 -->
        <div class="flex flex-row justify-stretch items-stretch w-full gap-2.5 px-4">
          <h2 class="text-text-primary text-base font-bold">⛳ {{ $t('caddyInfo.warning') }}</h2>
        </div>

        <!-- 정보 그리드 -->
        <div class="flex flex-col gap-6 px-4">
          <!-- 구사 가능 언어 -->
          <div class="flex flex-col gap-1">
            <div v-if="caddy.caution">
              <div v-if="hasNewlines(caddy.caution)" class="text-text-secondary text-sm">
                <ul class="list-disc pl-5">
                  <li v-for="(item, index) in splitTextToList(caddy.caution)" :key="index">
                    {{ item }}
                  </li>
                </ul>
              </div>
              <span v-else class="text-text-secondary text-sm">{{ caddy.caution }}</span>
            </div>
          </div>
        </div>
      </div>

      <Divider />

      <Policy />

    </div>
  </div>
</template>

<script lang="ts" setup>
import { hasNewlines, splitTextToList } from '~/utils/formatters'
import WishButton from '~/components/common/WishButton.vue'
import Policy from '~/components/common/Policy.vue'
import Divider from '~/components/common/Divider.vue'
import { useExchangeRate } from '~/composables/useExchangeRate'

const { locale } = useI18n()
const { formatPriceWithRate } = useExchangeRate()

interface Caddy {
  caddy_idx: number,
  caddy_code: string,
  name: string,
  nick_name: string,
  golfNameKr: string,
  golfNameEn: string,
  age: number,
  height: number,
  language: string,
  specialty: string,
  day_off: string,
  golf_experience: string,
  price: number,
  reservation_fee: number,
  images?: { image_url: string }[],
  review_count: number,
  average_rating: number,
  caution?: string,
  is_wished?: boolean,
  wish_idx?: number
}

interface Props {
  caddy: Caddy
}

defineProps<Props>()

// 찜 상태 업데이트 핸들러
const updateWishStatus = (status: { isWished: boolean, wishId: number | null }) => {
  // 필요한 경우 여기서 추가 로직 처리
}
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;  /* Chrome, Safari, Opera */
}
</style>