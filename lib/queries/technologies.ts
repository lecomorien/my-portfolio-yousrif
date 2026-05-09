import { createClient } from "@/lib/supabase/client";
import { Technology } from "@/lib/types/technology";

const supabase = createClient();

export class TechnologiesQuery {
  static async getAll(): Promise<Technology[]> {
    const { data, error } = await supabase
      .from("technologies")
      .select("*")
      .order("name");

    if (error) throw error;
    return data || [];
  }

  static async create(name: string): Promise<Technology> {
    const { data, error } = await supabase
      .from("technologies")
      .insert({ name })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}