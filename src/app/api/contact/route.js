import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/db";
import Contact from "@/models/Contact";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    await connectMongoDB();

    const { name, email, subject, message } = await req.json();

    await Contact.create({ name, email, subject, message });

    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "22415206ce6ed8",
        pass: "7e9054b822f889",
      },
    });

    await transporter.verify();
    console.log("✅ Mailtrap SMTP Ready");

    await transporter.sendMail({
      from: '"Fesona Website" <system@fesona.com>',
      to: "admin@fesona.com",
      cc: email,
      subject: `📩 New Inquiry: ${subject}`,
      html: `
        <div style="font-family: Arial; padding:20px">

          <h2 style="color:#9333ea">New Inquiry (Admin)</h2>
          <p><b>Name:</b> ${name}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Message:</b> ${message}</p>

          <hr/>

          <h3 style="color:#2563eb">Hello ${name},</h3>
          <p>Thank you for contacting <b>Fesona</b>.</p>
          <p>This is a <b>dummy confirmation email</b> for testing purpose.</p>

          <br/>
          <b>Fesona Support Team</b>

        </div>
      `,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("❌ Mailtrap Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 },
    );
  }
}

export async function GET() {
  try {
    await connectMongoDB();

    // બધી ઇન્ક્વાયરીઝ લેટેસ્ટ પહેલા (createdAt: -1) મુજબ મેળવો
    const inquiries = await Contact.find().sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: inquiries }, { status: 200 });
  } catch (error) {
    console.error("❌ GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch inquiries" },
      { status: 500 }
    );
  }
}