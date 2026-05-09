// lib/types/social_links.ts
export interface SocialLinks {
  id: string;
  href: string;
  label: string;
  position : number;
  icon: string;
  created_at?: string;
}

export interface SocialLinksInput {
  href: string;
  label: string;
  position : number;
  icon: string;
}