// lib/types/profile_titles.ts
export interface ProfileTitle {
  id: string;
  title: string;
  position: number;
  is_active: boolean;
  created_at?: string;
}

export interface ProfileTitleInput {
  title: string;
  position: number;
  is_active: boolean;
}