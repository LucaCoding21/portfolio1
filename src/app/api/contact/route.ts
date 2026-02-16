import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { name, email, message } = await request.json();

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email, and message are required." },
      { status: 400 }
    );
  }

  const { data, error } = await resend.emails.send({
    from: "Cloverfield Studio <hello@cloverfield.studio>",
    to: ["nguyen.william0121@gmail.com", "irishclaireparayno@gmail.com"],
    subject: `New message from ${name}`,
    replyTo: email,
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Fire-and-forget acknowledgment email to the submitter
  resend.emails.send({
    from: "Cloverfield Studio <hello@cloverfield.studio>",
    to: email,
    subject: "Thanks for reaching out!",
    text: `Hi ${name},\n\nThanks for reaching out! I've received your message and will get back to you as soon as I can.\n\n— William`,
  }).catch(() => {});

  return NextResponse.json({ success: true, id: data?.id });
}
