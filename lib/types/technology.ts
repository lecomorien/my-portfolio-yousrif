export interface Technology {
  id: string;
  name: string;
}

export interface ProjectTechnology {
  id: string;
  project_id: string;
  technology_id: string;
  technologies?: Technology;
}

export interface ExperienceTechnology {
  id: string;
  experience_id: string;
  technology_id: string;
  technologies?: Technology;
}