// lib/types/projects.ts
import { ProjectTechnology } from "./technology";

export interface Project {
  id: string;
  title: string;
  description?: string;
  category_id: string;
  project_url?: string;
  github_url?: string;
  is_featured?: boolean;
  position?:number;
  created_at?: string;
  project_images?: ProjectImage[];
  categories?:{id: string; title: string},
  project_technologies?: ProjectTechnology[];
}

export interface ProjectInput {
  title: string;
  description?: string;
  category_id: string;
  project_url?: string;
  github_url?: string;
  is_featured?: boolean;
  position?:number;
}

export interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  created_at?: string;
}

export interface ProjectImageInput {
  project_id: string;
  image_url: string;
}
