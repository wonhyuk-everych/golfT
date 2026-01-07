/**
 * 날짜를 한국어 형식으로 포맷팅합니다.
 * @param date 포맷팅할 Date 객체
 * @returns 'YYYY년MM월DD일 요일' 형식의 문자열
 */
export function formatDate(date: Date, locale: string = 'ko'): string {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  if (locale === 'ko') {
    const dayNames = ['일', '월', '화', '수', '목', '금', '토']
    const dayOfWeek = dayNames[date.getDay()]
    
    return `${year}년${month}월${day}일 (${dayOfWeek})`
  } else {
    const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()]
    return `${year}-${month}-${day} (${dayOfWeek})`
  }
}

/**
 * 숫자를 통화 형식으로 포맷팅합니다. (천 단위 구분 기호 추가)
 * @param price 포맷팅할 숫자
 * @returns 천 단위 구분 기호가 있는 문자열
 */
export function formatPrice(price: number | undefined): string {
  if (!price) return '0'
  return price.toLocaleString('ko-KR')
}


export function calculateBartPrice(price: number, exchangeRate: number) {
  const bartPrice = Math.round(price * exchangeRate)
  return bartPrice.toLocaleString('ko-KR')
}

/**
 * 숫자에 3자리마다 쉼표를 추가합니다.
 * @param num 포맷팅할 숫자
 * @returns 천 단위 구분 기호가 있는 문자열
 */
export function formatNumber(num: number | undefined): string {
  if (!num) return '0'
  return num.toLocaleString('ko-KR')
}

/**
 * 한국어 날짜 형식을 파싱하여 Date 객체로 변환합니다.
 * @param dateStr 한국어 날짜 문자열 ("2025년 5월 31일 (토)" 형식)
 * @returns 파싱된 Date 객체와 유효성 여부를 포함한 객체
 */
export function parseKoreanDate(dateStr: string): { date: Date; isValid: boolean } {
  const yearMatch = dateStr.match(/(\d+)\ub144/);
  const monthMatch = dateStr.match(/(\d+)\uc6d4/);
  const dayMatch = dateStr.match(/(\d+)\uc77c/);
  
  let parsedDate = new Date();
  let isValid = false;
  
  if (yearMatch && monthMatch && dayMatch) {
    const year = parseInt(yearMatch[1]);
    const month = parseInt(monthMatch[1]) - 1; // 월은 0부터 시작
    const day = parseInt(dayMatch[1]);
    
    parsedDate = new Date(year, month, day);
    isValid = !isNaN(parsedDate.getTime());
  }
  
  return { date: parsedDate, isValid };
}

/**
 * 입력된 날짜가 유효하고 오늘 이후인지 확인합니다.
 * @param dateStr 한국어 날짜 문자열
 * @returns 유효성 검사 결과
 */
export function isValidFutureDate(dateStr: string): boolean {
  const { date: parsedDate, isValid } = parseKoreanDate(dateStr);
  
  if (!isValid) {
    return false;
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return parsedDate >= today;
}

export function isValidDate(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return date >= today;
}

/**
 * 텍스트에 줄바꿈 문자가 포함되어 있는지 확인합니다.
 * @param text 확인할 텍스트
 * @returns 줄바꿈 문자 포함 여부
 */
export function hasNewlines(text: string | null | undefined): boolean {
  if (!text) return false;
  // 다양한 줄바꿈 형식 확인
  return text.includes('\n') || text.includes('\r\n') || text.includes('\r');
}

/**
 * 텍스트를 줄바꿈 기준으로 분리하여 리스트로 반환합니다.
 * @param text 분리할 텍스트
 * @returns 줄바꿈으로 분리된 텍스트 배열
 */
export function splitTextToList(text: string | null | undefined): string[] {
  if (!text) return [];
  // 다양한 줄바꿈 형식 처리
  const normalizedText = text.replace(/\r\n|\r/g, '\n');
  return normalizedText.split('\n').filter(item => item.trim() !== '');
}

/**
 * 24시간 형식의 시간을 오전/오후 형식으로 변환합니다.
 * @param time 24시간 형식의 시간 문자열 (예: "14:00")
 * @returns 오전/오후 형식의 시간 문자열 (예: "오후 2:00")
 */
export function formatTimeToAmPm(time: string): string {
  if (!time) return '';
  
  // 시간 형식 검증 (HH:MM)
  const timeRegex = /^([01]?[0-9]|2[0-3])$/;
  if (!timeRegex.test(time)) return time;
  
  let hour = parseInt(time, 10);
  
  // 오전/오후 결정
  const period = hour < 12 ? '오전' : '오후';
  
  // 12시간제로 변환
  if (hour === 0) {
    hour = 12; // 자정은 오전 12시
  } else if (hour > 12) {
    hour -= 12;
  }
  
  return `${period} ${hour}`;
}


// Format date to display in localized format
export function formatDateLocale(dateString: string, locale: string = 'ko') {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  
  if (locale === 'ko') {
    // Korean format: YYYY.MM.DD (요일)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    
    // Get day of week in Korean
    const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()]
    
    return `${year}.${month}.${day} (${dayOfWeek})`
  } else {
    // English format: MMM DD, YYYY
    const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()]
    return `${year}-${month}-${day} (${dayOfWeek})`
  }
}

// Format price to display with currency based on user's language
// Note: This is deprecated. Use useExchangeRate composable instead for Vue components
export async function formatPriceLocale(price: number, locale: string = 'ko') {
  if (!price) return '0'
  
  // Get cached exchange rate
  const { getBartExchangeRate } = await import('./exchangeRateCache')
  const bartExchangeRate = await getBartExchangeRate()
  
  // Format based on user's locale
  const currencyFormat = locale === 'ko' ? 'ko-KR' : 'en-US'
  const formattedPrice = new Intl.NumberFormat(currencyFormat).format(price)
  
  // Calculate Thai Baht based on exchange rate
  const bahtPrice = Math.round(price * bartExchangeRate)
  const formattedBaht = new Intl.NumberFormat(currencyFormat).format(bahtPrice)
  
  // Return formatted string based on locale
  if (locale === 'ko') {
    return `${formattedPrice}원 (${formattedBaht}바트)`
  } else {
    return `₩${formattedPrice} (${formattedBaht} THB)`
  }
}

export function formatOnlyWonPrice(price: number, locale: string = 'ko') {
  if (!price) return '0'
  
  // Format based on user's locale
  const currencyFormat = locale === 'ko' ? 'ko-KR' : 'en-US'
  const formattedPrice = new Intl.NumberFormat(currencyFormat).format(price)
  
  // Return formatted string based on locale
  if (locale === 'ko') {
    return `${formattedPrice}원`
  } else {
    return `₩${formattedPrice}`
  }
}