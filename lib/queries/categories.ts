// lib/queries/categories.ts
import { createClient } from "@/lib/supabase/client";
import { Categorie, CategorieInput} from "@/lib/types/categories";

const supabase = createClient();   // ← Client côté navigateur

export class CategoriesQuery {

  static async getAll(): Promise<Categorie[]> {
    const { data, error } = await supabase
      .from("categories")
      .select(`
        *
      `)
      .order("created_at", { ascending: false });
    if (error) {
        console.error("Supabase error:", error);
        throw error;
    }
    // SOLUTION : Forcer un plain object propre
    return data || [];
  }

  static async getById(id: string) {
    const { data, error } = await supabase
      .from("categories")
      .select(`
        *
      `)
      .eq("id", id)
      .single();
    if (error) throw error;
    return data ;
  }

  // CRUD projet
  static async create(input: CategorieInput): Promise<Categorie> {
    const { data, error } = await supabase
      .from("categories")
      .insert(input)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async update(id: string, input: any): Promise<Categorie> {
    const { data, error } = await supabase
      .from("categories")
      .update(input)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) throw error;
  }

}