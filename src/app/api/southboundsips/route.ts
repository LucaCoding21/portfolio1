import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json(
      { error: "Email is required." },
      { status: 400 }
    );
  }

  const { data, error } = await resend.emails.send({
    from: "Cloverfield Studio <hello@cloverfield.studio>",
    to: ["nguyen.william0121@gmail.com"],
    subject: `South Bound Sips — New Inquiry from ${email}`,
    replyTo: email,
    text: `New inquiry from the South Bound Sips coming soon page.\n\nEmail: ${email}\n\nThis person is interested in booking or learning more about South Bound Sips.`,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, id: data?.id });
}
