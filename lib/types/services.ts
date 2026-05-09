// lib/types/services.ts
export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  is_active: boolean;
  created_at?: string;
}

export interface ServiceInput {
  title: string;
  description: string;
  icon: string;
  is_active: boolean;
}