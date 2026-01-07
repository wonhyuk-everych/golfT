export interface Member {
  member_idx: number;
  id: string;
  password: string;
  grade: string;
  birthday: string | null;
  gender: string | null;
  email: string | null;
  name_kr: string | null;
  name_en: string | null;
  phone: string | null;
  member_status: string;
  created_at: string;
  updated_at: string;
}

export interface MemberSearchParams {
  searchWord?: string;
  memberStatus?: string;
  grade?: string;
  startDate?: string;
  endDate?: string;
}

export interface MemberUpdate {
  grade: string;
  member_status: string;
}
