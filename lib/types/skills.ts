// lib/types/skills.ts
export interface Skill {
  id: string;
  name: string;
  level: number;
  category_id : string;
  icon?: string;
  order : number;
  created_at?: string;
  skill_categories?:{title: string}
}

export interface SkillInput {
  name: string;
  level: number;
  category_id : string;
  icon?: string;
  order : number;
}
