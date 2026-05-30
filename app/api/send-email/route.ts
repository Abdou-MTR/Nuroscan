import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { to, subject, text, html, attachmentBase64, filename } = await request.json();

    // Check if credentials exist
    const user = process.env.SMTP_EMAIL;
    const pass = process.env.SMTP_PASSWORD;

    if (!user || !pass) {
      return NextResponse.json(
        { error: "SMTP credentials not configured in environment variables." },
        { status: 500 }
      );
    }

    // Configure the transporter
    // Defaulting to Gmail for simplicity, but can be customized
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user,
        pass,
      },
    });

    // Prepare attachments if any
    const attachments = [];
    if (attachmentBase64 && filename) {
      // Remove the data URI prefix (e.g. data:application/pdf;base64,...)
      const base64Data = attachmentBase64.split("base64,")[1] || attachmentBase64;
      
      attachments.push({
        filename: filename,
        content: base64Data,
        encoding: "base64",
      });
    }

    // Send the email
    const info = await transporter.sendMail({
      from: `"NeuroScan AI" <${user}>`,
      to,
      subject,
      text,
      html,
      attachments,
    });

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email. Ensure your SMTP credentials are correct." },
      { status: 500 }
    );
  }
}
