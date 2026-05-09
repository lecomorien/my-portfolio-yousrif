// lib/queries/profile_titles.ts
import { createClient } from "@/lib/supabase/client";
import { ProfileTitle, ProfileTitleInput} from "@/lib/types/profile_titles";

const supabase = createClient();   // ← Client côté navigateur

export class ProfileTitlesQuery {

    static async getAll(): Promise<ProfileTitle[]> {
        const { data, error } = await supabase
            .from("profile_titles")
            .select("*")
            .eq("is_active", true)
            .order("position", { ascending: true });

        if (error) throw error;

        return data || [];
    }
  
    static async getById(id: string) {
      const { data, error } = await supabase
        .from("profile_titles")
        .select(`
          *
        `)
        .eq("id", id)
        .single();
      if (error) throw error;
      return data ;
    }
  
    // CRUD projet
    static async create(input: ProfileTitleInput): Promise<ProfileTitle> {
      const { data, error } = await supabase
        .from("profile_titles")
        .insert(input)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static async update(id: string, input: any): Promise<ProfileTitle> {
      const { data, error } = await supabase
        .from("profile_titles")
        .update(input)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  
    static async delete(id: string): Promise<void> {
      const { error } = await supabase.from("profile_titles").delete().eq("id", id);
      if (error) throw error;
    }
}