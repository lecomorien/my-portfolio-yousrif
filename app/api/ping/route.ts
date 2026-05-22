import { createSupabaseServerClient } from "@/lib/supabase/server-simple";

export async function GET() {
  const supabase = createSupabaseServerClient();

  const { error } = await supabase
    .from("projects")
    .select("id")
    .limit(1);

  if (error) {
    console.error(error);
    return Response.json({ ok: false });
  }

  return Response.json({ ok: true });
}