export interface GolfCourseInfo {
  main_image_url: string;
  course_image_url: string;
  clubhouse_image_url: string;
  restaurant_image_url: string;
  shelter_image_url: string;
  proshop_image_url: string;
  description_image_url: string;
  name_kr: string;
  course_holes: string;
  country_code: string;
  region_code: string;
  nearest_airport: string;
  airport_time: number;
  total_fee: number;
  course_idx: number;
  website: string;
  weekday_green_sale_fee: number;
  weekend_green_sale_fee: number;
  caddy_sale_fee: number;
  cart_sale_fee: number;
  bart_price: number;
  extra_images: [];
}
