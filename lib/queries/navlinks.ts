// lib/queries/navlinks.ts
import { createClient } from "@/lib/supabase/client";
import { Navlinks, NavlinksInput} from "@/lib/types/navlinks";

const supabase = createClient();   // ← Client côté navigateur

export class NavlinksQuery {

  static async getAll(): Promise<Navlinks[]> {
    const { data, error } = await supabase
      .from("navlinks")
      .select(`*`)
      .order("position", { ascending: true });
    if (error) {
        console.error("Supabase error:", error);
        throw error;
    }
    // SOLUTION : Forcer un plain object propre
    return data || [];
  }

  // CRUD navlinks
    static async create(input: NavlinksInput): Promise<Navlinks> {
      const { data, error } = await supabase
        .from("navlinks")
        .insert(input)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static async update(id: number, input: any): Promise<Navlinks> {
      const { data, error } = await supabase
        .from("navlinks")
        .update(input)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  
    static async delete(id: number): Promise<void> {
      const { error } = await supabase.from("navlinks").delete().eq("id", id);
      if (error) throw error;
    }
}