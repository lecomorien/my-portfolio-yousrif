// lib/queries/experience.ts
import { createClient } from "@/lib/supabase/client";
import { Experience, ExperienceInput} from "@/lib/types/experience";

const supabase = createClient();   // ← Client côté navigateur

export class ExperiencesQuery {

  static async getAll(): Promise<Experience[]> {
    const { data, error } = await supabase
      .from("experiences")
      .select(`
        *,
        experience_technologies (
            id,
            technology_id,
            technologies (
                id,
                name
            )
        )
      `)
      .order("position", { ascending: true, nullsFirst: false })
      .order("sort_at", { ascending: true, nullsFirst: false });
    if (error) {
        console.error("Supabase error:", JSON.stringify(error, null, 2));
        throw error;
    }
    // SOLUTION : Forcer un plain object propre
    return data || [];
  }
  static async addTechnology(experience_id: string, technology_id: string) {
    const { error } = await supabase
      .from("experience_technologies")
      .insert({ experience_id, technology_id });

    if (error) throw error;
  }

  static async clearTechnologies(experience_id: string) {
    await supabase
      .from("experience_technologies")
      .delete()
      .eq("experience_id", experience_id);
  }

  static async getById(id: string) {
    const { data, error } = await supabase
      .from("experiences")
      .select(`
            *,
            experience_technologies (
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

  // CRUD projet
  static async create(input: ExperienceInput): Promise<Experience> {
    const { data, error } = await supabase
      .from("experiences")
      .insert(input)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async update(id: string, input: any): Promise<Experience> {
    const { data, error } = await supabase
      .from("experiences")
      .update(input)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabase.from("experiences").delete().eq("id", id);
    if (error) throw error;
  }

  static async toggleFeatured(id: string, featured: boolean): Promise<Experience> {
    return this.update(id, { is_featured: featured });
  }

}