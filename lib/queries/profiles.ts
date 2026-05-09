// lib/queries/profiles.ts
import { createClient } from "@/lib/supabase/client";
import { Profile, ProfileInput } from "@/lib/types/profiles";

const supabase = createClient();   // ← Client côté navigateur

export class ProfilesQuery {

  static async getAll(): Promise<Profile []> {
    const { data, error } = await supabase
      .from("profiles")
      .select(`
        *,
        profile_highlights(*),
        profile_stats(*)
      `)
      ;
    if (error) {
        console.error("Supabase error:", error);
        throw error;
    }
    // SOLUTION : Forcer un plain object propre
    return data || [];
  }

  // CRUD projet
  static async create(input: ProfileInput): Promise<Profile> {
    const { data, error } = await supabase
      .from("profiles")
      .insert(input)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async update(id: string, input: any): Promise<Profile> {
    const { data, error } = await supabase
      .from("profiles")
      .update(input)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabase.from("profiles").delete().eq("id", id);
    if (error) throw error;
  }

  static async getFirst() {
  const { data, error } = await supabase
    .from("profiles")
    .select(`*,
      profile_highlights(*),
      profile_stats(*)`)
    .limit(1)
    .single();

  if (error) throw error;
  return data;
}

  // -----------------------
  // UPLOAD AVATAR
  // -----------------------
  static async uploadAvatar(file: File): Promise<string> {
    const filePath = `avatar-${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (error) throw error;

    const { data } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  // -----------------------
  // UPLOAD CV
  // -----------------------
  static async uploadCV(file: File): Promise<string> {
    const filePath = `cv-${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("cv")
      .upload(filePath, file, { upsert: true });

    if (error) throw error;

    const { data } = supabase.storage
      .from("cv")
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  // -----------------------
  // CREATE OR UPDATE (SMART)
  // -----------------------
  static async upsertProfile(
    input: ProfileInput,
    avatarFile?: File,
    cvFile?: File,
    existingId?: string
  ): Promise<Profile> {

    let avatarUrl = input.avatar_url;
    let cvUrl = input.cv_url;

    // upload avatar si fourni
    if (avatarFile) {
      avatarUrl = await this.uploadAvatar(avatarFile);
    }

    // upload CV si fourni
    if (cvFile) {
      cvUrl = await this.uploadCV(cvFile);
    }

    const payload = {
      ...input,
      avatar_url: avatarUrl,
      cv_url: cvUrl,
    };

    if (existingId) {
      return await this.update(existingId, payload);
    } else {
      return await this.create(payload);
    }
  }
}