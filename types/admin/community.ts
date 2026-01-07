export interface Community {
  community_idx: number;
  country_code_idx: number;
  member_idx: number;
  title: string;
  content: string;
  use_yn: string;
  created_at: string;
  country_name?: string;
  member_name?: string;
  view_count?: number;
}

export interface CommunityComment {
  community_comment_idx: number;
  community_idx: number;
  member_idx: number;
  content: string;
  use_yn: string;
  created_at: string;
  member_name?: string;
}

export interface CommunityImage {
  community_image_idx: number;
  community_idx: number;
  image_url: string;
  sort: number;
  use_yn: string;
  created_at: string;
}

export interface CommunitySearchParams {
  searchWord?: string;
  countryCodeIdx?: number | string;
  memberIdx?: number;
  useYn?: string;
}
