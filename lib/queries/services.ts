// lib/queries/services.ts
import { createClient } from "@/lib/supabase/client";
import { Service, ServiceInput} from "@/lib/types/services";

const supabase = createClient();   // ← Client côté navigateur

export class ServicesQuery {

  static async getAll(): Promise<Service[]> {
      const { data, error } = await supabase
        .from("services")
        .select(`
          *
        `)
        .order("created_at", { ascending: false });
      if (error) {
          console.error("Supabase error:", error);
          throw error;
      }
      return data || [];
    }
  
    static async getById(id: string) {
      const { data, error } = await supabase
        .from("services")
        .select(`
          *
        `)
        .eq("id", id)
        .single();
      if (error) throw error;
      return data ;
    }
  
    // CRUD projet
    static async create(input: ServiceInput): Promise<Service> {
      const { data, error } = await supabase
        .from("services")
        .insert(input)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static async update(id: string, input: any): Promise<Service> {
      const { data, error } = await supabase
        .from("services")
        .update(input)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  
    static async delete(id: string): Promise<void> {
      const { error } = await supabase.from("services").delete().eq("id", id);
      if (error) throw error;
    }
}