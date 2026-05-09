// lib/types/categories.ts
export interface Categorie {
  id: string;
  title: string;
  type: string;
  created_at?: string;
}

export interface CategorieInput {
  title: string;
  type: string;
}