/* export const runtime = "nodejs";

import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return Response.json(
        { error: "Champs manquants" },
        { status: 400 }
      );
    }

    // 1. save DB
    const { error } = await supabase.from("messages").insert({
      name,
      email,
      subject,
      message,
      is_read: false,
    });

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    // 2. send email
    await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: "abdouyousrif@gmail.com",
      subject: `Nouveau message: ${subject}`,
      html: `
        <p><b>Nom:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b> ${message}</p>
      `,
    });

    return Response.json({ success: true });
  } catch (e) {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
} */
export async function GET() {
  return Response.json({ ok: true });
}