<template>
  <div class="flex flex-col w-full gap-4 pt-[40px]">

    <!-- Toast 메시지는 WishButton 컴포넌트 내부에서 처리됨 -->

    <!-- 골프장 정보 헤더 섹션 -->
    <div class="flex flex-col justify-center items-center w-full gap-4 px-4">
      <div class="flex flex-row justify-stretch items-stretch w-full gap-[-10px] py-2 px-4">
        <div class="flex flex-col gap-2 w-full">
          <!-- 골프장 이름 및 찜하기 버튼 -->
          <div class="flex flex-row justify-between items-start w-full">
            <div class="flex flex-col w-full gap-0.5">
              <h1 class="text-text-primary text-2xl w-full font-bold">{{ course.name_kr }}</h1>
              <p class="text-text-secondary text-base w-full">{{ course.name_en }}</p>
            </div>
            <!-- 찜하기 버튼 -->
            <WishButton 
              :product-idx="course.id" 
              type="G" 
              :wish-idx="course.wish_idx"
              @update:wish-status="updateWishStatus"
            />
          </div>
          
          <!-- 평점 및 리뷰 -->
          <div class="flex flex-row items-center gap-1">
            <div class="flex flex-row items-center">
              <span class="text-primary text-sm">★</span>
              <span class="text-text-tertiary text-sm">{{ course.review_rating }}</span>
            </div>
            <div class="flex flex-row items-center">
              <span class="text-text-tertiary text-sm">(</span>
              <div class="flex flex-row items-center gap-0.5">
                <span class="text-text-tertiary text-sm">{{ course.review_count }}</span>
                <span class="text-text-tertiary text-sm">Reviews</span>
              </div>
              <span class="text-text-tertiary text-sm">)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 골프장 설명 섹션 -->
      <div v-if="course.description" class="flex flex-col justify-center w-full gap-2">
        <!-- 설명 텍스트 -->
        <div class="flex flex-col justify-center w-full">
          <div class="flex flex-row justify-stretch items-stretch w-full gap-2.5 px-4">
            <p class="text-text-secondary text-sm w-full">
              {{ isExpanded ? course.description : truncatedDescription }}
              <span v-if="!isExpanded && course.description.length > maxLength">...</span>
            </p>
          </div>
        </div>
        
        <!-- 더보기 버튼 -->
        <div v-if="course.description.length > maxLength" class="flex flex-row items-center gap-1.5 px-4" @click="toggleDescription">
          <span class="text-primary text-sm cursor-pointer">{{ isExpanded ? '접기' : '더보기' }}</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-primary" :style="{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }">
            <path d="M12 6L8 10L4 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>

      <!-- 골프장 주요시설 -->
      <div class="flex flex-col gap-4 w-full">
        <!-- 섹션 제목 -->
        <div class="flex flex-row justify-stretch items-stretch w-full gap-2.5 px-4">
          <h2 class="text-text-primary text-base font-bold">⛳ 골프장 주요시설</h2>
        </div>

        <div class="flex flex-col gap-6 px-4">
          <TextList :text="course.facility_info" />
        </div>

        <!-- 시설 리스트 -->
        <!--<div v-if="course.facilities && course.facilities.length > 0" class="flex flex-wrap gap-6 px-4">
          <div v-for="(facility, index) in course.facilities" :key="index" class="flex flex-col items-center gap-1 bg-primary bg-opacity-10 rounded-[20px] p-2 w-16">
            <div class="flex items-center justify-center">
              <img :src="`/images/icon/golf_facilities_${facility.icon_name}.svg`" alt="golf facility" class="w-[30px] h-[30px]">
            </div>
            <span class="text-text-secondary text-xs text-center">{{ facility.text }}</span>
          </div>
        </div>
        <div v-else class="px-4">
          <span class="text-text-tertiary text-sm">등록된 시설 정보가 없습니다.</span>
        </div>-->
      </div>

      <!-- 구분선 -->
      <Divider :offset-px="34" />

      <!-- 상품 핵심 정보 -->
      <div class="flex flex-col gap-4 w-full">
        <!-- 섹션 제목 -->
        <div class="flex flex-row justify-stretch items-stretch w-full gap-2.5 px-4">
          <h2 class="text-text-primary text-base font-bold">⛳ 골프장 핵심 정보</h2>
        </div>

        <!-- 정보 그리드 -->
        <div class="flex flex-col gap-6 px-4">
          <!-- 지역 정보 -->
          <div class="flex flex-col gap-1">
            <span class="text-primary text-sm font-bold">지역</span>
            <span class="text-text-secondary text-sm">{{ course.country_code }} - {{ course.city_code }}</span>
          </div>

          <!-- 홀 수 -->
          <div v-if="!course.course_info" class="flex flex-col gap-1">
            <span class="text-primary text-sm font-bold">코스 정보</span>
            <span class="text-text-secondary text-sm">홀: {{ course.course_holes }} / 파: {{ course.course_par }} / 거리: {{ formatNumber(course.course_length) }}y</span>
          </div>

          <div v-if="course.course_info" class="flex flex-col gap-6">
            <TextList title="코스 정보" :text="course.course_info" />
          </div>

          <!-- 캐디 의무 사항 -->
          <div class="flex flex-col gap-1">
            <span class="text-primary text-sm font-bold">캐디 의무 사항</span>
            <div v-if="course.caddy_covenants">
              <div v-if="hasNewlines(course.caddy_covenants)" class="text-text-secondary text-sm">
                <ul class="list-disc pl-5">
                  <li v-for="(item, index) in splitTextToList(course.caddy_covenants)" :key="index">
                    {{ item }}
                  </li>
                </ul>
              </div>
              <span v-else class="text-text-secondary text-sm">{{ course.caddy_covenants }}</span>
            </div>
          </div>

          <!-- 캐디 규칙 -->
          <div class="flex flex-col gap-1">
            <span class="text-primary text-sm font-bold">캐디 규칙</span>
            <div v-if="course.caddy_rule">
              <div v-if="hasNewlines(course.caddy_rule)" class="text-text-secondary text-sm">
                <ul class="list-disc pl-5">
                  <li v-for="(item, index) in splitTextToList(course.caddy_rule)" :key="index">
                    {{ item }}
                  </li>
                </ul>
              </div>
              <span v-else class="text-text-secondary text-sm">{{ course.caddy_rule }}</span>
            </div>
          </div>

          <!-- 레인 체크 정책-->
          <div class="flex flex-col gap-1">
            <span class="text-primary text-sm font-bold">레인 체크 정책</span>
            <div v-if="course.rain_check">
              <div v-if="hasNewlines(course.rain_check)" class="text-text-secondary text-sm">
                <ul class="list-disc pl-5">
                  <li v-for="(item, index) in splitTextToList(course.rain_check)" :key="index">
                    {{ item }}
                  </li>
                </ul>
              </div>
              <span v-else class="text-text-secondary text-sm">{{ course.rain_check }}</span>
            </div>
          </div>

          <!-- 갤러리 수수료-->
          <div class="flex flex-col gap-1">
            <span class="text-primary text-sm font-bold">갤러리 수수료</span>
            <div v-if="course.gallery_fee">
              <div v-if="hasNewlines(course.gallery_fee)" class="text-text-secondary text-sm">
                <ul class="list-disc pl-5">
                  <li v-for="(item, index) in splitTextToList(course.gallery_fee)" :key="index">
                    {{ item }}
                  </li>
                </ul>
              </div>
              <span v-else class="text-text-secondary text-sm">{{ course.gallery_fee }}</span>
            </div>
          </div>

          <!-- 코스 디자이너 -->
          <div class="flex flex-col gap-1">
            <span class="text-primary text-sm font-bold">코스 디자이너</span>
            <span class="text-text-secondary text-sm">{{ course.course_designer }}</span>
          </div>
        </div>
      </div>

      <Divider :offset-px="34" />

      <div class="flex flex-col gap-4 w-full">
        <!-- 섹션 제목 -->
        <div class="flex flex-row justify-stretch items-stretch w-full gap-2.5 px-4">
          <h2 class="text-text-primary text-base font-bold">⛳ 골프장 상세 정보</h2>
        </div>

        <!-- 정보 그리드 -->
        <div class="flex flex-col gap-6 px-4">
          <!-- 전화번호 -->
          <div class="flex flex-col gap-1">
            <span class="text-primary text-sm font-bold">전화번호</span>
            <span class="text-text-secondary text-sm">{{ course.phone }}</span>
          </div>

          <!-- 팩스 -->
          <div class="flex flex-col gap-1">
            <span class="text-primary text-sm font-bold">팩스</span>
            <span class="text-text-secondary text-sm">{{ course.fax }}</span>
          </div>

          <!-- 주소 -->
          <div class="flex flex-col gap-1">
            <span class="text-primary text-sm font-bold">주소</span>
            <span class="text-text-secondary text-sm">{{ course.address }}</span>
          </div>

          <!-- 홈페이지 -->
          <div class="flex flex-col gap-1">
            <span class="text-primary text-sm font-bold">홈페이지</span>
            <a
              v-if="course.website"
              :href="normalizedHomePage"
              class="text-primary text-sm underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ $t('hotelInfo.goToHomepage') || '홈페이지로 이동' }}
            </a>
            <span v-else class="text-text-tertiary text-sm">-</span>
          </div>
        </div>
      </div>

      <Divider :offset-px="34" />

      <!-- 추가 이미지 섹션 -->
      <div v-if="course.extra_images && course.extra_images.length > 0 && false" class="flex flex-col gap-4 w-full">
        <!-- 섹션 제목 -->
        <div class="flex flex-row justify-stretch items-stretch w-full gap-2.5 px-4">
          <h2 class="text-text-primary text-base font-bold">⛳ 상품 결제 전, 확인해 주세요</h2>
        </div>
        
        <!-- 이미지 리스트 -->
        <div class="flex flex-col">
          <div v-for="(image, index) in course.extra_images" :key="index" class="w-full aspect-[4/3] overflow-hidden rounded-lg">
            <img :src="image.image_url" :alt="`골프장 추가 이미지 ${index + 1}`" class="w-full h-full object-cover">
          </div>
        </div>
      </div>

      <Policy />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { formatNumber, hasNewlines, splitTextToList } from '~/utils/formatters'
import { ref, computed } from 'vue'
import WishButton from '~/components/common/WishButton.vue';
import Policy from '~/components/common/Policy.vue';
import Divider from '~/components/common/Divider.vue';
import TextList from '~/components/hotel/TextList.vue'

interface Course {
  id: number
  name_kr: string
  name_en: string
  description: string
  region_code: string
  facility_info: string
  course_holes: number
  course_par: number
  course_length: number
  openYear: number
  course_designer: string
  address: string
  phone: string
  fax: string
  website: string
  extra_images?: string[]
  nearest_city?: string
  caddy_covenants?: string
  caddy_rule?: string
  rain_check?: string
  gallery_fee?: string
  review_count?: number
  review_rating?: number
  is_wished?: number
  wish_idx?: number
}

interface Props {
  course: Course
}

const props = defineProps<Props>()

// 설명 텍스트 관련 상태 및 로직
const isExpanded = ref(false)
const maxLength = 100 // 최대 표시 글자 수

// 찜 상태 업데이트 핸들러
const updateWishStatus = (status: { isWished: boolean, wishId: number | null }) => {
  // 필요한 경우 여기서 추가 로직 처리
}

const truncatedDescription = computed(() => {
  if (!props.course.description) return ''
  if (props.course.description.length <= maxLength) {
    return props.course.description
  }
  return props.course.description.substring(0, maxLength)
})

const toggleDescription = () => {
  isExpanded.value = !isExpanded.value
}

// 홈 페이지 URL 정규화 (프로토콜 없을 시 https 추가)
const normalizedHomePage = computed(() => {
  const url = props.course?.website?.trim() || ''
  if (!url) return ''
  if (/^https?:\/\//i.test(url)) return url
  return `https://${url}`
})

// Using imported utility functions from formatters.ts
</script>