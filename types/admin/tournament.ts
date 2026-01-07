export interface Tournament {
  tournament_idx: number;
  title: string;
  title_en: string;
  price: number;
  price_explain: string;
  start_date: string | null;
  end_date: string | null;
  tournament_status: string;
  image_use_yn: string;
  image_title: string | null;
  image_important_yn: string;
  content: string;
  created_at: string;
  created_member_idx: number;
  updated_at: string | null;
  updated_member_idx: number | null;
  images?: TournamentImage[];
}

export interface TournamentImage {
  tournament_image_idx?: number;
  tournament_idx?: number;
  image_url: string;
  image_type: string; // T: 썸네일, M: 메인, E: 설명
  sort: number;
  main_yn: string;
  use_yn: string;
  created_at?: string;
  created_member_idx?: number;
  updated_at?: string;
  updated_member_idx?: number | null;
}

export interface TournamentSearchParams {
  searchWord?: string;
  tournamentStatus?: string;
  startDate?: string;
  endDate?: string;
}

export interface TournamentRegistration {
  reservation_tournament_idx: number;
  reservation_idx: string;
  tournament_idx: number;
  member_idx: number;
  form_data: TournamentFormData;
  images: string | null;
  total_price: number;
  reservation_status: string;
  cancel_reason: string | null;
  create_date: string;
  update_date: string | null;
}

export interface TournamentFormData {
  result: TournamentFormField[];
}

export interface TournamentFormField {
  type: 'text' | 'select';
  title: string;
  value: string;
}

export interface TournamentRegistrationSearchParams {
  searchWord?: string;
  startDate?: string;
  endDate?: string;
}
