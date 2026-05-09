//profile_stats

import { createClient } from "@/lib/supabase/client";
import { ProfileStats, ProfileStatsInput} from "@/lib/types/profile_stats";

const supabase = createClient();   // ← Client côté navigateur

export class ProfileStatsQuery {

  static async getAll(): Promise<ProfileStats[]> {
    const { data, error } = await supabase
      .from("profile_stats")
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
      .from("profile_stats")
      .select(`
        *
      `)
      .eq("id", id)
      .single();
    if (error) throw error;
    return data ;
  }

  // CRUD projet
  static async create(input: ProfileStatsInput): Promise<ProfileStats> {
    const { data, error } = await supabase
      .from("profile_stats")
      .insert(input)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async update(id: string, input: any): Promise<ProfileStats> {
    const { data, error } = await supabase
      .from("profile_stats")
      .update(input)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabase.from("profile_stats").delete().eq("id", id);
    if (error) throw error;
  }

  static async upsertStats(data: {
    id?: string;
    profile_id: string;
    label: string;
    value: string;
    position: number;
  }) {
    const { error } = await supabase
      .from("profile_stats")
      .upsert(data, {
        onConflict: "id",
      });

    if (error) {
      throw error;
    }
  
};

}