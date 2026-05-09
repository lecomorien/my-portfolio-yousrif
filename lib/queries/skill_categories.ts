// lib/queries/skill_categories.ts
import { createClient } from "@/lib/supabase/client";
import { SkillCategories, SkillCategorieInput} from "@/lib/types/skill_categories";

const supabase = createClient();   // ← Client côté navigateur

export class SkillCategoriesQuery {

  static async getAll(): Promise<SkillCategories[]> {
    const { data, error } = await supabase
      .from("skill_categories")
      .select(`
        *,
        skills (
          id,
          name,
          icon,
          level,
          order
        )
      `)
      .order("order", { ascending: true })
      .order("order", { foreignTable: "skills", ascending: true });
    if (error) {
        console.error("Supabase error:", error);
        throw error;
    }
    // SOLUTION : Forcer un plain object propre
    return data || [];
  }

  static async getById(id: string) {
    const { data, error } = await supabase
      .from("skill_categories")
      .select(`
        *
      `)
      .eq("id", id)
      .single();
    if (error) throw error;
    return data ;
  }

  // CRUD projet
  static async create(input: SkillCategorieInput): Promise<SkillCategories> {
    const { data, error } = await supabase
      .from("skill_categories")
      .insert(input)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async update(id: string, input: any): Promise<SkillCategories> {
    const { data, error } = await supabase
      .from("skill_categories")
      .update(input)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabase.from("skill_categories").delete().eq("id", id);
    if (error) throw error;
  }

}