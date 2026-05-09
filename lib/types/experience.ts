import { ExperienceTechnology } from "./technology";
export interface Experience {
  id: string;
  title: string;
  company: string;
  period?: string;
  description?: string;
  position?: number;
  sort_at?: number;
  created_at?: string;
  experience_technologies?: ExperienceTechnology[];
}

export interface ExperienceInput {
  title: string;
  company: string;
  period?: string;
  description?: string;
  position?: number;
  sort_at?: number;
}