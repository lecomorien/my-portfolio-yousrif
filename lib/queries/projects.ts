// lib/queries/projects.ts
import { createClient } from "@/lib/supabase/client";
import { Project, ProjectInput, ProjectImage, ProjectImageInput} from "@/lib/types/projects";

const supabase = createClient();   // ← Client côté navigateur

export class ProjectsQuery {

  static async getAll(): Promise<Project[]> {
    const { data, error } = await supabase
      .from("projects")
      .select(`
        *,
        categories(
          id,
          title
        ),
        project_images (*),
        project_technologies (
          id,
          technology_id,
          technologies!project_technologies_technology_id_fkey (
            id,
            name
          )
        )
      `)
      .eq("is_featured", true)
      .order("position", { ascending: true, nullsFirst: false });
    if (error) {
        console.error("Supabase error:", JSON.stringify(error, null, 2));
        throw error;
    }
    // SOLUTION : Forcer un plain object propre
    return data || [];
  }
  static async getAllAdmin(): Promise<Project[]> {
    const { data, error } = await supabase
      .from("projects")
      .select(`
        *,
        categories(
          id,
          title
        ),
        project_images (*),
        project_technologies (
          id,
          technology_id,
          technologies!project_technologies_technology_id_fkey (
            id,
            name
          )
        )
      `)
      .order("position", { ascending: true, nullsFirst: false });
    if (error) {
        console.error("Supabase error:", JSON.stringify(error, null, 2));
        throw error;
    }
    // SOLUTION : Forcer un plain object propre
    return data || [];
  }
  static async addTechnology(project_id: string, technology_id: string) {
    const { error } = await supabase
      .from("project_technologies")
      .insert({ project_id, technology_id });

    if (error) throw error;
  }

  static async clearTechnologies(project_id: string) {
    await supabase
      .from("project_technologies")
      .delete()
      .eq("project_id", project_id);
  }

  static async getById(id: string) {
    const { data, error } = await supabase
      .from("projects")
      .select(`
        *,
        categories(title),
        project_images (*),
        project_technologies (
          id,
          technology_id,
          technologies (
            id,
            name
          )
        )
      `)
      .eq("id", id)
      .single();
    if (error) throw error;
    return data ;
  }

  static async getByCategory(category: string) {
    const { data, error } = await supabase
      .from("projects")
      .select(`
        *,
        categories(title),
        project_images (*)
      `)
      .eq("category", category)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  }

  // CRUD projet
  static async create(input: ProjectInput): Promise<Project> {
    const { data, error } = await supabase
      .from("projects")
      .insert(input)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async update(id: string, input: any): Promise<Project> {
    const { data, error } = await supabase
      .from("projects")
      .update(input)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) throw error;
  }

  static async toggleFeatured(id: string, featured: boolean): Promise<Project> {
    return this.update(id, { is_featured: featured });
  }

  // -----------------------
  // Gestion des images
  // -----------------------
  static async addImage(input: ProjectImageInput): Promise<ProjectImage> {
    const { data, error } = await supabase
      .from("project_images")
      .insert(input)
      .select()
      .single();
    if (error) throw error;
    return data  as ProjectImage;
  }

  static async getImages(project_id: string): Promise<ProjectImage[]> {
    const { data, error } = await supabase
      .from("project_images")
      .select("*")
      .eq("project_id", project_id);
    if (error) throw error;
    return data || [];
  }

  static async deleteImage(id: string): Promise<void> {
    const { error } = await supabase.from("project_images").delete().eq("id", id);
    if (error) throw error;
  }
}