// lib/queries/skills.ts
import { createClient } from "@/lib/supabase/client";
import { Skill, SkillInput} from "@/lib/types/skills";

const supabase = createClient();   // ← Client côté navigateur

export class SkillsQuery {

  static async getAll(): Promise<Skill[]> {
      const { data, error } = await supabase
        .from("skills")
        .select('*, skill_categories(title)')
        .order("position", { ascending: true, nullsFirst: false })
        /* .order("created_at", { ascending: false }) */;
      if (error) {
          console.error("Supabase error:", error);
          throw error;
      }
      console.log(data);
      // SOLUTION : Forcer un plain object propre
      return data || [];
    }
  
    static async getById(id: string) {
      const { data, error } = await supabase
        .from("skills")
        .select(`
          *
        `)
        .eq("id", id)
        .single();
      if (error) throw error;
      return data ;
    }
  
    // CRUD projet
    static async create(input: SkillInput): Promise<Skill> {
      const { data, error } = await supabase
        .from("skills")
        .insert(input)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static async update(id: string, input: any): Promise<Skill> {
      const { data, error } = await supabase
        .from("skills")
        .update(input)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  
    static async delete(id: string): Promise<void> {
      const { error } = await supabase.from("skills").delete().eq("id", id);
      if (error) throw error;
    }
}