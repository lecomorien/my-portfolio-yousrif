//profile_highlights

import { createClient } from "@/lib/supabase/client";
import { ProfileHighlights, ProfileHighlightsInput} from "@/lib/types/profile_highlights";

const supabase = createClient();   // ← Client côté navigateur

export class ProfileHighlightsQuery {

  static async getAll(): Promise<ProfileHighlights[]> {
    const { data, error } = await supabase
      .from("profile_highlights")
      .select(`
        *
      `)
      .order("position", { ascending: false });
    if (error) {
        console.error("Supabase error:", error);
        throw error;
    }
    // SOLUTION : Forcer un plain object propre
    return data || [];
  }

  static async getById(id: string) {
    const { data, error } = await supabase
      .from("profile_highlights")
      .select(`
        *
      `)
      .eq("id", id)
      .single();
    if (error) throw error;
    return data ;
  }

  // CRUD projet
  static async create(input: ProfileHighlightsInput): Promise<ProfileHighlights> {
    const { data, error } = await supabase
      .from("profile_highlights")
      .insert(input)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async update(id: string, input: any): Promise<ProfileHighlights> {
    const { data, error } = await supabase
      .from("profile_highlights")
      .update(input)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabase.from("profile_highlights").delete().eq("id", id);
    if (error) throw error;
  }


  static async upsertHighlight(data: {
    id?: string;
    profile_id: string;
    icon: string;
    text: string;
    position: number;
  }) {
    const { error } = await supabase
      .from("profile_highlights")
      .upsert(data, {
        onConflict: "id",
      });

    if (error) {
      throw error;
    }
  
};

}