import nodemailer from "nodemailer"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "METHOD_NOT_ALLOWED" });
  }

  const { name, email, phoneNumber, userMessage } = req.body || {};

  const missingFields = [];
  if (!name) missingFields.push("name");
  if (!email) missingFields.push("email");
  if (!phoneNumber) missingFields.push("phoneNumber");
  if (!userMessage) missingFields.push("userMessage");

  if (missingFields.length > 0) {
    return res.status(400).json({
      ok: false,
      error: "VALIDATION_ERROR",
      fields: missingFields
    });
  }

  const { SMTP_USER, SMTP_PASSWORD, RECIPIENT_ADDRESS } = process.env;
  if (!SMTP_USER || !SMTP_PASSWORD || !RECIPIENT_ADDRESS) {
    return res.status(500).json({
      ok: false,
      error: "SERVER_CONFIG_ERROR"
    });
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD
    }
  });

  const mailData = {
    from: SMTP_USER,
    to: RECIPIENT_ADDRESS,
    replyTo: email,
    subject: `Ashton & Carrington Contact form submission from ${name}`,
    html: `<h1>${name} has contacted you</h1>
      <p>You have a contact form submission</p><br>
      <p><strong>Email: </strong> ${email}</p><br>
      <p><strong>Phone Number: </strong> ${phoneNumber}</p><br>
      <p><strong>Message: </strong> ${userMessage}</p><br>`
  };

  try {
    const info = await transporter.sendMail(mailData);
    return res.status(200).json({
      ok: true,
      messageId: info?.messageId || null
    });
  } catch (error) {
    console.error("EMAIL_SEND_FAILED", {
      code: error?.code,
      responseCode: error?.responseCode,
      command: error?.command
    });

    return res.status(502).json({
      ok: false,
      error: "EMAIL_SEND_FAILED"
    });
  }
}
