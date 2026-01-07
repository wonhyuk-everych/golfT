<template>
  <div>
    <NavigationBar mode="back_title" :show-bell="false" :title="$t('shoppingCart.title')" back-color="black" />

    <div class="pt-16 px-4 pb-32"><!-- Increased bottom padding to make room for fixed buttons -->
      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center items-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
      </div>
      
      <!-- Error state -->
      <div v-else-if="error" class="bg-red-50 p-4 rounded-lg text-center">
        <p class="text-red-600">{{ error }}</p>
        <button 
          class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          @click="fetchShoppingCart" 
        >
          {{ $t('shoppingCart.tryAgain') }}
        </button>
      </div>
      
      <!-- Empty cart -->
      <div v-else-if="!hasItems" class="bg-white rounded-lg shadow-lg p-8 text-center">
        <img src="/assets/icons/basket.svg" alt="Empty Cart" class="w-16 h-16 mx-auto mb-4 opacity-50">
        <p class="text-gray-500 mb-6">{{ $t('shoppingCart.emptyCart') }}</p>
        <NuxtLink 
          to="/" 
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {{ $t('shoppingCart.continueShopping') }}
        </NuxtLink>
      </div>
      
      <!-- Cart items -->
      <div v-else>
        <!-- Golf courses -->
        <div v-if="cartData.golfCourses && cartData.golfCourses.length > 0" class="mb-4">
          <ShoppingCartGolf 
            v-for="golfCourse in cartData.golfCourses" 
            :key="golfCourse.shopping_cart_golf_idx"
            :golf-course="golfCourse"
            :is-selected="selectedItems.golfCourses.includes(golfCourse.shopping_cart_golf_idx)"
            @select="toggleSelectGolfCourse(golfCourse.shopping_cart_golf_idx)"
            @view-product="viewGolfCourse"
            @payment="processPayment"
          />
        </div>
        
        <!-- Hotels -->
        <div v-if="cartData.hotels && cartData.hotels.length > 0" class="mb-4">
          <ShoppingCartHotel 
            v-for="hotel in cartData.hotels" 
            :key="hotel.shopping_cart_hotel_idx"
            :hotel="hotel"
            :is-selected="selectedItems.hotels.includes(hotel.shopping_cart_hotel_idx)"
            @select="toggleSelectHotel(hotel.shopping_cart_hotel_idx)"
            @view-product="viewHotel"
            @payment="processPayment"
          />
        </div>

        <!-- Caddies -->
        <div v-if="cartData.caddies && cartData.caddies.length > 0" class="mb-4">
          <ShoppingCartCaddy 
            v-for="caddy in cartData.caddies" 
            :key="caddy.shopping_cart_caddy_idx"
            :caddy="caddy"
            :is-selected="selectedItems.caddies.includes(caddy.shopping_cart_caddy_idx)"
            @select="toggleSelectCaddy(caddy.shopping_cart_caddy_idx)"
            @view-product="viewCaddy"
            @payment="processPayment"
          />
        </div>

        <!-- Call vans -->
        <div v-if="cartData.callVans && cartData.callVans.length > 0" class="mb-4">
          <ShoppingCartCallvan 
            v-for="callvan in cartData.callVans" 
            :key="callvan.shopping_cart_callvan_idx"
            :callvan="callvan"
            :is-selected="selectedItems.callVans.includes(callvan.shopping_cart_callvan_idx)"
            @select="toggleSelectCallvan(callvan.shopping_cart_callvan_idx)"
            @view-product="viewCallvan"
            @payment="processPayment"
          />
        </div>
        
        <!-- Tournaments -->
        <div v-if="cartData.tournaments && cartData.tournaments.length > 0" class="mb-4">
          <ShoppingCartTournament 
            v-for="tournament in cartData.tournaments" 
            :key="tournament.shopping_cart_tournament_idx"
            :tournament="tournament"
            :is-selected="selectedItems.tournaments.includes(tournament.shopping_cart_tournament_idx)"
            @select="toggleSelectTournament(tournament.shopping_cart_tournament_idx)"
            @view-product="viewTournament"
            @payment="processPayment"
          />
        </div>
        
        <!-- Fixed bottom buttons for delete and payment -->
        <div v-if="hasItems" class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 max-w-[1024px] mx-auto">
          <div v-if="hasSelectedItems" class="flex justify-between items-center mb-2">
            <span class="text-sm font-medium">{{ $t('shoppingCart.totalItems') }} {{ selectedItemCount }} {{ $t('shoppingCart.items') }}</span>
            <span class="text-lg font-bold">{{ formatTotalPrice() }}</span>
          </div>
          <div class="flex gap-3">
            <button 
              class="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              :disabled="!hasSelectedItems"
              @click="showDeleteConfirmation = true" 
            >
              삭제하기
            </button>
            <button 
              class="flex-1 bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
              :disabled="!hasSelectedItems"
              @click="checkout" 
            >
              결제하기
            </button>
          </div>
        </div>
        
        <!-- Delete confirmation popup -->
        <div v-if="showDeleteConfirmation" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div class="bg-white rounded-lg p-6 w-full max-w-sm">
            <h3 class="text-lg font-medium mb-4 text-center">선택한 항목 삭제하시겠습니까?</h3>
            <div class="flex gap-3">
              <button 
                class="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                @click="showDeleteConfirmation = false"
              >
                취소
              </button>
              <button 
                class="flex-1 bg-red-500 text-white py-2 rounded-lg font-medium hover:bg-red-600 transition-colors"
                @click="deleteSelectedItems"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import NavigationBar from '~/components/common/NavigationBar.vue'
import ShoppingCartGolf from '~/components/shopping_cart/ShoppingCartGolf.vue'
import ShoppingCartHotel from '~/components/shopping_cart/ShoppingCartHotel.vue'
import ShoppingCartCaddy from '~/components/shopping_cart/ShoppingCartCaddy.vue'
import ShoppingCartCallvan from '~/components/shopping_cart/ShoppingCartCallvan.vue'
import ShoppingCartTournament from '~/components/shopping_cart/ShoppingCartTournament.vue'
import type { GolfCourseCartItem, HotelCartItem, CaddyCartItem, CallVanCartItem, TournamentCartItem } from '~/server/api/shopping-cart'
import { useExchangeRate } from '~/composables/useExchangeRate'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const { formatPriceOriginal } = useExchangeRate()

definePageMeta({
  name: 'shopping-cart',
  middleware: ['auth']
})

const router = useRouter()

// State
const loading = ref(true)
const error = ref<string | null>(null)
const showDeleteConfirmation = ref(false)
const cartData = ref<{
  golfCourses: GolfCourseCartItem[],
  hotels: HotelCartItem[],
  caddies: CaddyCartItem[],
  callVans: CallVanCartItem[],
  tournaments: TournamentCartItem[],
  bartExchangeRate: number
}>({
  golfCourses: [],
  hotels: [],
  caddies: [],
  callVans: [],
  tournaments: [],
  bartExchangeRate: 0
})

// Selected items for checkout
const selectedItems = ref({
  golfCourses: [] as number[],
  hotels: [] as number[],
  caddies: [] as number[],
  callVans: [] as number[],
  tournaments: [] as number[]
})

// Computed properties
const hasItems = computed(() => {
  return (
    cartData.value.golfCourses.length > 0 ||
    cartData.value.hotels.length > 0 ||
    cartData.value.caddies.length > 0 ||
    cartData.value.callVans.length > 0 ||
    cartData.value.tournaments.length > 0
  )
})

const hasSelectedItems = computed(() => {
  return (
    selectedItems.value.golfCourses.length > 0 ||
    selectedItems.value.hotels.length > 0 ||
    selectedItems.value.caddies.length > 0 ||
    selectedItems.value.callVans.length > 0 ||
    selectedItems.value.tournaments.length > 0
  )
})

const selectedItemCount = computed(() => {
  return (
    selectedItems.value.golfCourses.length +
    selectedItems.value.hotels.length +
    selectedItems.value.caddies.length +
    selectedItems.value.callVans.length +
    selectedItems.value.tournaments.length
  )
})

// Methods
const fetchShoppingCart = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await $fetch('/api/shopping-cart')
    
    if (response.success) {
      cartData.value = {
        golfCourses: response.data?.golfCourses || [],
        hotels: response.data?.hotels || [],
        caddies: response.data?.caddies || [],
        callVans: response.data?.callVans || [],
        tournaments: response.data?.tournaments || [],
        bartExchangeRate: response.data?.bartExchangeRate || 0
      }
    } else {
      error.value = response.error || '장바구니 정보를 가져오는데 실패했습니다.'
    }
  } catch (e) {
    console.error('Shopping cart fetch error:', e)
    error.value = '장바구니 정보를 가져오는데 실패했습니다.'
  } finally {
    loading.value = false
  }
}

const toggleSelectGolfCourse = (id: number) => {
  const index = selectedItems.value.golfCourses.indexOf(id)
  if (index === -1) {
    selectedItems.value.golfCourses.push(id)
  } else {
    selectedItems.value.golfCourses.splice(index, 1)
  }
}

const toggleSelectHotel = (id: number) => {
  const index = selectedItems.value.hotels.indexOf(id)
  if (index === -1) {
    selectedItems.value.hotels.push(id)
  } else {
    selectedItems.value.hotels.splice(index, 1)
  }
}

const toggleSelectCaddy = (id: number) => {
  const index = selectedItems.value.caddies.indexOf(id)
  if (index === -1) {
    selectedItems.value.caddies.push(id)
  } else {
    selectedItems.value.caddies.splice(index, 1)
  }
}

const toggleSelectCallvan = (id: number) => {
  const index = selectedItems.value.callVans.indexOf(id)
  if (index === -1) {
    selectedItems.value.callVans.push(id)
  } else {
    selectedItems.value.callVans.splice(index, 1)
  }
}

const toggleSelectTournament = (id: number) => {
  const index = selectedItems.value.tournaments.indexOf(id)
  if (index === -1) {
    selectedItems.value.tournaments.push(id)
  } else {
    selectedItems.value.tournaments.splice(index, 1)
  }
}

const viewGolfCourse = (id: number) => {
  router.push(`/course/${id}`)
}

const viewHotel = (id: number) => {
  router.push(`/hotel/${id}`)
}

const viewCaddy = (id: number) => {
  router.push(`/caddy/${id}`)
}

const viewCallvan = (id: number) => {
  router.push(`/callvan/${id}`)
}

const viewTournament = (id: number) => {
  router.push(`/tournament/${id}`)
}

const processPayment = (item: GolfCourseCartItem | HotelCartItem | CaddyCartItem | CallVanCartItem | TournamentCartItem) => {
  // Add to selected items if not already selected
  if (!selectedItems.value.golfCourses.includes(item.shopping_cart_golf_idx)) {
    selectedItems.value.golfCourses.push(item.shopping_cart_golf_idx)
  }

  if (!selectedItems.value.hotels.includes(item.shopping_cart_hotel_idx)) {
    selectedItems.value.hotels.push(item.shopping_cart_hotel_idx)
  }

  if (!selectedItems.value.caddies.includes(item.shopping_cart_caddy_idx)) {
    selectedItems.value.caddies.push(item.shopping_cart_caddy_idx)
  }

  if (!selectedItems.value.callVans.includes(item.shopping_cart_callvan_idx)) {
    selectedItems.value.callVans.push(item.shopping_cart_callvan_idx)
  }

  if (!selectedItems.value.tournaments.includes(item.shopping_cart_tournament_idx)) {
    selectedItems.value.tournaments.push(item.shopping_cart_tournament_idx)
  }
  
  // Proceed to checkout
  checkout()
}

const formatTotalPrice = () => {
  let total = 0
  
  // Calculate total for selected golf courses
  selectedItems.value.golfCourses.forEach(id => {
    const golfCourse = cartData.value.golfCourses.find(item => item.shopping_cart_golf_idx === id)
    if (golfCourse) {
      total += golfCourse.total_price
    }
  })
  
  selectedItems.value.hotels.forEach(id => {
    const hotel = cartData.value.hotels.find(item => item.shopping_cart_hotel_idx === id)
    if (hotel) {
      total += hotel.total_price
    }
  })
  
  selectedItems.value.caddies.forEach(id => {
    const caddy = cartData.value.caddies.find(item => item.shopping_cart_caddy_idx === id)
    if (caddy) {
      total += caddy.total_price
    }
  })
  
  selectedItems.value.callVans.forEach(id => {
    const callvan = cartData.value.callVans.find(item => item.shopping_cart_callvan_idx === id)
    if (callvan) {
      total += callvan.total_price
    }
  })
  
  selectedItems.value.tournaments.forEach(id => {
    const tournament = cartData.value.tournaments.find(item => item.shopping_cart_tournament_idx === id)
    if (tournament) {
      total += tournament.price
    }
  })
  
  return formatPriceOriginal(total, locale)
}

const deleteSelectedItems = async () => {
  if (!hasSelectedItems.value) {
    showDeleteConfirmation.value = false
    return
  }
  
  try {
    loading.value = true
    
    // Prepare arrays of IDs to delete
    const golfIds = selectedItems.value.golfCourses
    const hotelIds = selectedItems.value.hotels
    const caddyIds = selectedItems.value.caddies
    const callVanIds = selectedItems.value.callVans
    const tournamentIds = selectedItems.value.tournaments
    
    const response = await $fetch('/api/shopping-cart/delete', {
      method: 'POST',
      body: {
        golfCourses: golfIds,
        hotels: hotelIds,
        caddies: caddyIds,
        callVans: callVanIds,
        tournaments: tournamentIds
      }
    })
    
    if (response && response.success) {
      // Reset selected items
      selectedItems.value = {
        golfCourses: [],
        hotels: [],
        caddies: [],
        callVans: [],
        tournaments: []
      }
      
      // Refresh cart data
      await fetchShoppingCart()
    } else {
      error.value = response.error || '항목 삭제에 실패했습니다.'
    }
  } catch (err) {
    console.error('Failed to delete items:', err)
    error.value = '항목 삭제에 실패했습니다.'
  } finally {
    loading.value = false
    showDeleteConfirmation.value = false
  }
}

const checkout = () => {
  if (!hasSelectedItems.value) {
    return;
  }

  // sessionStorage 초기화
  sessionStorage.setItem('hotelReservation', '');
  sessionStorage.setItem('golfReservation', '');
  sessionStorage.setItem('callvanReservation', '');
  sessionStorage.setItem('caddyReservation', '');
  sessionStorage.setItem('tournamentReservation', '');

  // 호텔 처리
  const selectedHotelIds = selectedItems.value.hotels;

  if(selectedHotelIds.length > 0){
    const hotelReservation = cartData.value.hotels
      .filter(hotel => selectedHotelIds.includes(hotel.shopping_cart_hotel_idx))
      .map(hotel => ({
        hotelIdx: hotel.hotel_idx,
        hotelNameKr: hotel.name_kr,
        hotelNameEn: hotel.name_en,
        hotelImageUrl: hotel.Image_url,
        checkInDate: hotel.check_in_date,
        checkOutDate: hotel.check_out_date,
        roomIdx: hotel.room_idx,
        roomName: hotel.room_name,
        roomBedType: hotel.bed_type,
        roomSalePrice: hotel.total_price,
        roomCount: hotel.number_of_room,
        adult: hotel.adult,
        children: hotel.children,
        shoppingCartHotelIdx: hotel.shopping_cart_hotel_idx,
        finalPaymentAmount: hotel.total_price
      }));
    sessionStorage.setItem('hotelReservation', JSON.stringify(hotelReservation));
  }

  // 골프장 처리
  const selectedGolfIds = selectedItems.value.golfCourses;

  if(selectedGolfIds.length > 0){
    const golfReservation = cartData.value.golfCourses
      .filter(golf => selectedGolfIds.includes(golf.shopping_cart_golf_idx))
      .map(golf => ({
        courseIdx: golf.course_idx,
        nameKr: golf.name_kr,
        nameEn: golf.name_en,
        imageUrl: golf.Image_url,
        reservationDate: golf.reservation_date,
        golfCourseTime: golf.golf_course_time,
        numberOfReservation: golf.number_of_reservation,
        monthlyPriceIdx: golf.golf_monthly_price_idx,
        timePriceIdx: golf.golf_time_price_idx,
        priceType: golf.golf_price_type,
        golfCourseSaleFee: golf.golf_course_sale_fee,
        cartSaleFee: golf.cart_sale_fee,
        caddySaleFee: golf.caddy_sale_fee,
        callVanSaleFee: golf.callvan_sale_fee,
        shoppingCartGolfIdx: golf.shopping_cart_golf_idx,
        finalPaymentAmount: golf.total_price,
        carType: golf.car_type,
        pickupLocation: golf.pickup_location,
        dropoffLocation: golf.dropoff_location,
        roundTripYn: golf.round_trip_yn,
        numberOfCallVan: golf.number_of_call_van
      }));
    sessionStorage.setItem('golfReservation', JSON.stringify(golfReservation));
  }

  // 캐디 처리
  const selectedCaddyIds = selectedItems.value.caddies;

  if(selectedCaddyIds.length > 0){
    const caddyReservation = cartData.value.caddies
      .filter(caddy => selectedCaddyIds.includes(caddy.shopping_cart_caddy_idx))
      .map(caddy => ({
        caddyIdx: caddy.caddy_idx,
        courseIdx: caddy.course_idx,
        name: caddy.name,
        nameKr: caddy.name_kr,
        nameEn: caddy.name_en,
        imageUrl: caddy.Image_url,
        caddyCode: caddy.caddy_code,
        reservationDate: caddy.reservation_date,
        golfCourseTime: caddy.golf_course_time,
        shoppingCartCaddyIdx: caddy.shopping_cart_caddy_idx,
        finalPaymentAmount: caddy.total_price
    }));
    sessionStorage.setItem('caddyReservation', JSON.stringify(caddyReservation));
  }

  // 콜밴 처리
  const selectedCallvanIds = selectedItems.value.callVans;

  if(selectedCallvanIds.length > 0){
    const callvanReservation = cartData.value.callVans
      .filter(callvan => selectedCallvanIds.includes(callvan.shopping_cart_callvan_idx))
      .map(callvan => ({
        callvanIdx: callvan.shopping_cart_callvan_idx,
        courseIdx: callvan.course_idx,
        roundTripYn: callvan.round_trip_yn,
        startDate: callvan.start_date,
        endDate: callvan.end_date,
        startTime: callvan.start_time,
        endTime: callvan.end_time,
        pickupLocation: callvan.pickup_location,
        dropoffLocation: callvan.dropoff_location,
        numberOfReservation: callvan.number_of_reservation,
        numberOfCallVan: callvan.number_of_call_van,
        shoppingCartCallvanIdx: callvan.shopping_cart_callvan_idx,
        finalPaymentAmount: callvan.total_price
      }));
    sessionStorage.setItem('callvanReservation', JSON.stringify(callvanReservation));
  }
  
  // 토너먼트 처리
  const selectedTournamentIds = selectedItems.value.tournaments;
  
  if(selectedTournamentIds.length > 0){
    const tournamentReservation = cartData.value.tournaments
      .filter(tournament => selectedTournamentIds.includes(tournament.shopping_cart_tournament_idx))
      .map(tournament => ({
        tournamentIdx: tournament.tournament_idx,
        title: tournament.title,
        imageUrl: tournament.image_url,
        formData: tournament.form_data,
        images: tournament.images,
        imageTitle: tournament.image_title,
        shoppingCartTournamentIdx: tournament.shopping_cart_tournament_idx,
        finalPaymentAmount: tournament.price
      }));
    sessionStorage.setItem('tournamentReservation', JSON.stringify(tournamentReservation));
  }

  // 결제 페이지 이동
  router.push('/payment');
}


onMounted(() => {
  fetchShoppingCart()
})
</script>

<style scoped>
/* Add any custom styles here */
</style>