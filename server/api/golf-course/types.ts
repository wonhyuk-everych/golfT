export interface GolfCourse {
  course_idx: number;
  booking_status: 'Y' | 'N';
  course_status: 'Y' | 'N';
  course_id: string;
  name_kr: string;
  name_en: string;
  country_code: string;
  region_code: string;
  hole_count: number;
  round_start: 'Y' | 'N';
  address: string;
  phone: string;
  website: string;
  course_designer: string;
  course_holes: string;
  course_par: string;
  course_length: string;
  fairway_info: string;
  green_info: string;
  nearest_airport: string;
  airport_time: number;
  nearest_city: string;
  city_time: number;
  single_play: 'Y' | 'N';
  single_play_date: string;
  double_play: 'Y' | 'N';
  double_play_date: string;
  map_url: string;
  promotion_url: string;
  description: string;
}

export interface GolfCoursePrice {
  price_idx: number;
  course_idx: number;
  weekday_green_fee: number;
  weekday_green_fee_discount: number;
  weekend_green_fee: number;
  weekend_green_fee_discount: number;
  caddy_fee: number;
  caddy_fee_discount: number;
  cart_fee: number;
  cart_fee_discount: number;
  total_fee: number;
}

export interface GolfCourseImage {
  image_idx: number;
  course_idx: number;
  logo_url: string;
  main_image_url: string;
  course_image_url: string;
  clubhouse_image_url: string;
  restaurant_image_url: string;
  shelter_image_url: string;
  proshop_image_url: string;
  description_image_url: string;
}

export interface GolfCourseExtraImage {
  image_idx: number;
  course_idx: number;
  image_url: string;
  image_type: string;
}

export interface GolfCourseWithDetails extends GolfCourse {
  price?: GolfCoursePrice;
  images?: GolfCourseImage;
  extraImages?: GolfCourseExtraImage[];
}

export interface GolfCourseReview {
  id: number;
  productName: string;
  review: string;
  reviewRate: number;
  reviewer: string;
  image: string[];
  reviewDate: Date;
}

export interface RecommendGolfCourse {
  course_idx: number
  name_kr: string
  name_en: string
  region_code: string
  address: string
  round_start: string
  round_price: number
  created_at: Date
  region_name: string
  location: string
  image: string
}

export interface SearchProduct {
  id: number;
  name: string;
  location?: string;
  price: string;
  image?: string;
}
