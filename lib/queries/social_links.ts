// lib/queries/social_links.ts
import { createClient } from "@/lib/supabase/client";
import { SocialLinks, SocialLinksInput} from "@/lib/types/social_links";

const supabase = createClient();   // ← Client côté navigateur

export class SocialLinksQuery {

  static async getAll(): Promise<SocialLinks[]> {
    const { data, error } = await supabase
      .from("social_links")
      .select(`*`)
      .order("position", { ascending: true, nullsFirst: false });
    if (error) {
        console.error("Supabase error:", JSON.stringify(error, null, 2));
        throw error;
    }
    // SOLUTION : Forcer un plain object propre
    return data || [];
  }


  static async getById(id: string) {
        const { data, error } = await supabase
          .from("social_links")
          .select(`
            *
          `)
          .eq("id", id)
          .single();
        if (error) throw error;
        return data ;
      }
    
      // CRUD projet
      static async create(input: SocialLinksInput): Promise<SocialLinks> {
        const { data, error } = await supabase
          .from("social_links")
          .insert(input)
          .select()
          .single();
        if (error) throw error;
        return data;
      }
    
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      static async update(id: string, input: any): Promise<SocialLinks> {
        const { data, error } = await supabase
          .from("social_links")
          .update(input)
          .eq("id", id)
          .select()
          .single();
        if (error) throw error;
        return data;
      }
    
      static async delete(id: string): Promise<void> {
        const { error } = await supabase.from("social_links").delete().eq("id", id);
        if (error) throw error;
      }
}