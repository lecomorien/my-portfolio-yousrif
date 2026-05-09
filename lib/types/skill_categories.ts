// lib/types/skill_categories.ts
export interface SkillCategories {
  id: string;
  title: string;
  order: number;
  skills: {
    id: string;
    name: string;
    icon?: string;
    level: number;
    order: number;
  }[];
  created_at?: string;
}

export interface SkillCategorieInput {
  title: string;
  order: number;
}