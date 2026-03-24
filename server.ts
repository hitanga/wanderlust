import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.post("/api/contact", async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      // Helper to clean environment variables (handles cases where users paste "KEY=VALUE" into the secret field)
      const cleanEnv = (val: string | undefined, fallback: string): string => {
        if (!val) return fallback;
        const trimmed = val.trim();
        if (trimmed.includes("=")) {
          return trimmed.split("=").pop()?.trim() || fallback;
        }
        return trimmed;
      };

      const smtpHost = cleanEnv(process.env.SMTP_HOST, "smtp.gmail.com");
      const smtpPort = parseInt(cleanEnv(process.env.SMTP_PORT, "587"));
      const smtpUser = cleanEnv(process.env.SMTP_USER, "");
      const smtpPass = cleanEnv(process.env.SMTP_PASS, "");
      const smtpSecure = cleanEnv(process.env.SMTP_SECURE, "false") === "true";
      const recipientEmail = cleanEnv(process.env.CONTACT_RECIPIENT_EMAIL, "gopalzone2025@gmail.com");

      if (!smtpUser || !smtpPass) {
        console.warn("SMTP credentials not provided. Email not sent.");
        return res.status(500).json({ 
          error: "Email service is not configured. Please set SMTP_USER and SMTP_PASS in environment variables.",
          success: false 
        });
      }

      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const mailOptions = {
        from: `"${name}" <${smtpUser}>`,
        to: recipientEmail,
        replyTo: email,
        subject: `New Contact Form Submission: ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
        html: `
          <h3>New Contact Form Submission</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, "<br>")}</p>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${recipientEmail}`);

      res.json({ success: true });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to send email. Please check your SMTP configuration." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
