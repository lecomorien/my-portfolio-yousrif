// lib/queries/messages.ts
import { createClient } from "@/lib/supabase/client";
import { Message, MessageInput} from "@/lib/types/messages";

const supabase = createClient();   // ← Client côté navigateur

export class MessagesQuery {

  static async getAll(): Promise<Message[]> {
      const { data, error } = await supabase
        .from("messages")
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
        .from("messages")
        .select(`
          *
        `)
        .eq("id", id)
        .single();
      if (error) throw error;
      return data ;
    }
  
    // CRUD projet
    static async create(input: MessageInput): Promise<Message> {
      const { data, error } = await supabase
        .from("messages")
        .insert(input)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static async update(id: string, input: any): Promise<Message> {
      const { data, error } = await supabase
        .from("messages")
        .update(input)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  
    static async delete(id: string): Promise<void> {
      const { error } = await supabase.from("messages").delete().eq("id", id);
      if (error) throw error;
    }
}