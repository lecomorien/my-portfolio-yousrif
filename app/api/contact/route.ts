export const runtime = "nodejs";


import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, email, subject, message } = body;

    // Validation simple
    if (!name || !email || !subject || !message) {
      return Response.json(
        { error: "Champs requis manquants" },
        { status: 400 }
      );
    }

    // 1. Sauvegarde DB
    const { error: dbError } = await supabase
      .from("messages")
      .insert({
        name,
        email,
        subject,
        message,
        is_read: false,
      });

    if (dbError) {
      console.error(dbError);

      return Response.json(
        { error: "Erreur base de données" },
        { status: 500 }
      );
    }

    // 2. Email
    await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: "abdouyousrif@gmail.com",
      subject: `Nouveau message: ${subject}`,
      html: `
        <h2>Nouveau message portfolio</h2>

        <p><strong>Nom:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Objet:</strong> ${subject}</p>

        <hr/>

        <p>${message}</p>
      `,
    });

    return Response.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}