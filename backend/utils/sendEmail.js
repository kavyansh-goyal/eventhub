import nodemailer from "nodemailer";

// Sends an email. If EMAIL_USER/EMAIL_PASS are not configured, it logs to
// console instead of throwing, so the rest of the app keeps working in dev.
const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`[sendEmail] Email not configured. Would have sent to ${to}: ${subject}`);
    return { skipped: true };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject,
    html,
  });

  return info;
};

export default sendEmail;
