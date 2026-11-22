import nodemailer from "nodemailer";

// Lazy-loaded transporter with dynamic configuration
let transporterInstance = null;

function getTransporter() {
  if (transporterInstance) return transporterInstance;

  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "465", 10);
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  const user = process.env.SMTP_USER || "sainilalit2751@gmail.com";
  const pass = process.env.SMTP_PASSWORD ? process.env.SMTP_PASSWORD.replace(/\s+/g, "") : "";

  if (!user || !pass) {
    console.warn("⚠️ [EmailService] SMTP credentials missing in environment. Email delivery paused.");
    return null;
  }

  transporterInstance = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    tls: {
      rejectUnauthorized: false,
    },
  });

  return transporterInstance;
}

const FROM_EMAIL = process.env.SMTP_FROM_EMAIL || "Lalit Saini <sainilalit2751@gmail.com>";
const OWNER_EMAIL = process.env.NOTIFICATION_EMAIL || "sainilalit2751@gmail.com";

/**
 * Send Contact Inquiry Notifications:
 * 1. Notification to Lalit Saini with full inquiry details
 * 2. Automated Confirmation Receipt to Client
 */
export async function sendContactInquiryNotification(contactData) {
  const transporter = getTransporter();
  if (!transporter) return { success: false, reason: "SMTP not configured" };

  const { name, email, phone, niche, subject, message } = contactData;
  const formattedDate = new Date().toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  // 1. Email to Lalit (Owner Alert)
  const ownerMailOptions = {
    from: FROM_EMAIL,
    to: OWNER_EMAIL,
    replyTo: email,
    subject: `[New Inquiry] ${subject || "Client Project"} — from ${name}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background: #ffffff;">
        <div style="background: #090d16; padding: 24px; color: #ffffff;">
          <h2 style="margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.5px;">W3 Lalit Portfolio — New Client Inquiry</h2>
          <p style="margin: 4px 0 0 0; font-size: 13px; color: #94a3b8;">Received on ${formattedDate}</p>
        </div>
        <div style="padding: 24px; color: #1e293b;">
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #64748b; width: 120px;">Client Name:</td>
              <td style="padding: 8px 0; font-weight: 700; color: #0f172a;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #64748b;">Email:</td>
              <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a></td>
            </tr>
            ${phone ? `
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #64748b;">Phone:</td>
              <td style="padding: 8px 0; color: #0f172a;">${phone}</td>
            </tr>` : ""}
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #64748b;">Project Scope:</td>
              <td style="padding: 8px 0; color: #0f172a;"><span style="background: #e0f2fe; color: #0369a1; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; text-transform: uppercase;">${niche}</span></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #64748b;">Subject:</td>
              <td style="padding: 8px 0; font-weight: 600; color: #0f172a;">${subject}</td>
            </tr>
          </table>

          <div style="background: #f8fafc; border-left: 4px solid #2563eb; padding: 16px; border-radius: 4px; margin-bottom: 24px;">
            <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #334155; white-space: pre-wrap;">${message}</p>
          </div>

          <div style="text-align: center;">
            <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject || 'Your project inquiry with W3 Lalit')}" style="display: inline-block; background: #0f172a; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; font-size: 14px;">Reply Directly to ${name}</a>
          </div>
        </div>
        <div style="background: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #64748b;">
          Logged into W3 Lalit Portfolio Inquiries System.
        </div>
      </div>
    `,
  };

  // 2. Automated Confirmation Receipt to Client
  const clientMailOptions = {
    from: FROM_EMAIL,
    to: email,
    subject: `Thank you for contacting Lalit Saini — Inquiry Confirmation`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background: #ffffff;">
        <div style="background: #090d16; padding: 24px; color: #ffffff;">
          <h2 style="margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.5px;">W3 Lalit Saini</h2>
          <p style="margin: 4px 0 0 0; font-size: 13px; color: #94a3b8;">Full-Stack Web Developer & Engineer</p>
        </div>
        <div style="padding: 24px; color: #1e293b; line-height: 1.6;">
          <p style="margin: 0 0 16px 0; font-size: 15px;">Hi <strong>${name}</strong>,</p>
          <p style="margin: 0 0 16px 0; font-size: 14px; color: #334155;">
            Thank you for reaching out through my developer portfolio! I have received your project details regarding <strong>"${subject || niche}"</strong>.
          </p>
          <p style="margin: 0 0 16px 0; font-size: 14px; color: #334155;">
            I am currently reviewing your requirements and will reply within <strong>24 hours</strong> with technical recommendations, availability, or follow-up questions.
          </p>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin: 20px 0;">
            <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase;">Inquiry Summary:</p>
            <p style="margin: 0; font-size: 13px; color: #475569; white-space: pre-wrap;">${message}</p>
          </div>

          <p style="margin: 0 0 8px 0; font-size: 14px; color: #334155;">
            If you have additional files or urgent specifications, feel free to reply directly to this email.
          </p>
          <p style="margin: 20px 0 0 0; font-size: 14px; color: #0f172a; font-weight: 600;">
            Best regards,<br>
            <span style="color: #2563eb;">Lalit Saini</span><br>
            <span style="font-size: 12px; font-weight: 400; color: #64748b;">Full-Stack Developer | w3lalitsaini.com</span>
          </p>
        </div>
        <div style="background: #f1f5f9; padding: 14px; text-align: center; font-size: 12px; color: #94a3b8;">
          © 2026 Lalit Saini. All rights reserved.
        </div>
      </div>
    `,
  };

  try {
    const [ownerRes, clientRes] = await Promise.allSettled([
      transporter.sendMail(ownerMailOptions),
      transporter.sendMail(clientMailOptions),
    ]);

    if (ownerRes.status === "rejected") {
      console.warn("⚠️ [EmailService] Failed to send owner alert:", ownerRes.reason.message);
    } else {
      console.log("✅ [EmailService] Inquiry notification delivered to", OWNER_EMAIL);
    }

    if (clientRes.status === "rejected") {
      console.warn("⚠️ [EmailService] Failed to send client confirmation:", clientRes.reason.message);
    } else {
      console.log("✅ [EmailService] Confirmation receipt delivered to client", email);
    }

    return { success: true };
  } catch (err) {
    console.error("❌ [EmailService] Error dispatching inquiry emails:", err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Send Newsletter Welcome & Alert:
 * 1. Confirmation to Subscriber
 * 2. Notification to Lalit Saini
 */
export async function sendNewsletterWelcomeEmail(subscriberEmail) {
  const transporter = getTransporter();
  if (!transporter) return { success: false, reason: "SMTP not configured" };

  const subscriberOptions = {
    from: FROM_EMAIL,
    to: subscriberEmail,
    subject: "Welcome to W3 Lalit Technical Updates!",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background: #ffffff;">
        <div style="background: #090d16; padding: 24px; color: #ffffff;">
          <h2 style="margin: 0; font-size: 20px; font-weight: 700;">W3 Lalit Saini — Technical Updates</h2>
        </div>
        <div style="padding: 24px; color: #1e293b; line-height: 1.6;">
          <p style="margin: 0 0 16px 0; font-size: 15px;">Welcome!</p>
          <p style="margin: 0 0 16px 0; font-size: 14px; color: #334155;">
            Thank you for subscribing to my technical newsletter. You will receive curated updates whenever I publish new full-stack SaaS builds, open-source architectural patterns, and production engineering deep-dives.
          </p>
          <p style="margin: 0 0 16px 0; font-size: 14px; color: #334155;">
            Explore my latest live projects and technical case studies anytime on my portfolio: <a href="https://w3lalit.vercel.app/projects.html" style="color: #2563eb; text-decoration: none; font-weight: 600;">View Projects</a>.
          </p>
          <p style="margin: 24px 0 0 0; font-size: 14px; color: #0f172a; font-weight: 600;">
            Cheers,<br>
            <span style="color: #2563eb;">Lalit Saini</span>
          </p>
        </div>
      </div>
    `,
  };

  const ownerOptions = {
    from: FROM_EMAIL,
    to: OWNER_EMAIL,
    subject: `[New Subscriber] ${subscriberEmail} joined the newsletter!`,
    html: `
      <div style="font-family: sans-serif; padding: 20px;">
        <h3>New Newsletter Subscriber</h3>
        <p><strong>Email:</strong> ${subscriberEmail}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
      </div>
    `,
  };

  try {
    await Promise.allSettled([
      transporter.sendMail(subscriberOptions),
      transporter.sendMail(ownerOptions),
    ]);
    return { success: true };
  } catch (err) {
    console.error("❌ [EmailService] Newsletter email error:", err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Send Admin Security Alert (On Login / Auth Event)
 */
export async function sendAdminSecurityAlert(userEmail, meta = {}) {
  const transporter = getTransporter();
  if (!transporter) return { success: false };

  const alertOptions = {
    from: FROM_EMAIL,
    to: OWNER_EMAIL,
    subject: `[Security Alert] Admin Portal Sign-in Detected`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 6px;">
        <h3 style="color: #0f172a; margin-top: 0;">Admin Portal Sign-In Notification</h3>
        <p>Your administrative account was just accessed on the W3 Lalit Portfolio control center.</p>
        <ul>
          <li><strong>User:</strong> ${userEmail}</li>
          <li><strong>Timestamp:</strong> ${new Date().toLocaleString()}</li>
          ${meta.ip ? `<li><strong>IP Address:</strong> ${meta.ip}</li>` : ""}
          ${meta.userAgent ? `<li><strong>Device:</strong> ${meta.userAgent}</li>` : ""}
        </ul>
        <p style="font-size: 12px; color: #64748b;">If this was you, you can safely disregard this alert.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(alertOptions);
    return { success: true };
  } catch (err) {
    console.warn("⚠️ [EmailService] Security alert email failed:", err.message);
    return { success: false, error: err.message };
  }
}
