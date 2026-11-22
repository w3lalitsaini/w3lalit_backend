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
    return null;
  }

  transporterInstance = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    connectionTimeout: 6000,
    greetingTimeout: 6000,
    socketTimeout: 6000,
    tls: {
      rejectUnauthorized: false,
    },
  });

  return transporterInstance;
}

const FROM_EMAIL = process.env.SMTP_FROM_EMAIL || "Lalit Saini <sainilalit2751@gmail.com>";
const OWNER_EMAIL = process.env.NOTIFICATION_EMAIL || "sainilalit2751@gmail.com";

/**
 * Universal Resilient Email Dispatcher:
 * Supports:
 * 1. Google Apps Script Webhook (Port 443 - Bypasses Render Free Tier SMTP Block)
 * 2. Resend API (HTTPS Port 443)
 * 3. Brevo API (HTTPS Port 443)
 * 4. Web3Forms (HTTPS Port 443)
 * 5. Direct SMTP (Fallback with 6s timeout protection)
 */
async function dispatchEmail({ to, replyTo, subject, html, text, fromName, clientData }) {
  const webhookUrl = process.env.EMAIL_WEBHOOK_URL || process.env.GMAIL_WEBHOOK_URL;
  const resendApiKey = process.env.RESEND_API_KEY;
  const brevoApiKey = process.env.BREVO_API_KEY;
  const web3formsKey = process.env.WEB3FORMS_ACCESS_KEY;

  // 1. Google Apps Script Webhook / Custom HTTPS Relay (Port 443 - 100% Render compatible)
  if (webhookUrl) {
    try {
      const resp = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to,
          replyTo: replyTo || to,
          subject,
          html,
          text: text || "",
          fromName: fromName || "W3 Lalit Portfolio",
        }),
      });
      if (resp.ok) {
        console.log(`✅ [EmailService:Webhook] Delivered to ${to} via Google Apps Script Webhook`);
        return { success: true, provider: "webhook" };
      }
    } catch (err) {
      console.warn(`⚠️ [EmailService:Webhook] Dispatch error:`, err.message);
    }
  }

  // 2. Resend API (HTTPS Port 443)
  if (resendApiKey) {
    try {
      const fromAddress = process.env.RESEND_FROM || "W3 Lalit <onboarding@resend.dev>";
      const resp = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromAddress,
          to: [to],
          subject,
          html,
          reply_to: replyTo || undefined,
        }),
      });
      if (resp.ok) {
        console.log(`✅ [EmailService:Resend] Delivered to ${to} via Resend API`);
        return { success: true, provider: "resend" };
      }
    } catch (err) {
      console.warn(`⚠️ [EmailService:Resend] Dispatch error:`, err.message);
    }
  }

  // 3. Brevo API (HTTPS Port 443)
  if (brevoApiKey) {
    try {
      const resp = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": brevoApiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: { name: fromName || "Lalit Saini", email: "sainilalit2751@gmail.com" },
          to: [{ email: to }],
          subject,
          htmlContent: html,
          replyTo: replyTo ? { email: replyTo } : undefined,
        }),
      });
      if (resp.ok) {
        console.log(`✅ [EmailService:Brevo] Delivered to ${to} via Brevo API`);
        return { success: true, provider: "brevo" };
      }
    } catch (err) {
      console.warn(`⚠️ [EmailService:Brevo] Dispatch error:`, err.message);
    }
  }

  // 4. Web3Forms (HTTPS Port 443)
  if (web3formsKey) {
    try {
      const resp = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: web3formsKey,
          subject,
          from_name: fromName || "W3 Lalit Portfolio",
          name: clientData?.name || fromName || "Portfolio Client",
          email: replyTo || to,
          phone: clientData?.phone || "Not provided",
          project_scope: clientData?.niche || "General",
          message: clientData?.message || text || "New submission from W3 Lalit Portfolio",
        }),
      });
      if (resp.ok) {
        console.log(`✅ [EmailService:Web3Forms] Forwarded to ${to} via Web3Forms`);
        return { success: true, provider: "web3forms" };
      }
    } catch (err) {
      console.warn(`⚠️ [EmailService:Web3Forms] Dispatch error:`, err.message);
    }
  }

  // 5. Direct SMTP (Fallback for localhost, VPS, or paid Render tiers)
  const transporter = getTransporter();
  if (!transporter) {
    console.warn("⚠️ [EmailService] No email transport configured (SMTP credentials or HTTPS Webhook missing).");
    return { success: false, reason: "No email transport configured" };
  }

  try {
    const result = await transporter.sendMail({
      from: FROM_EMAIL,
      to,
      replyTo: replyTo || undefined,
      subject,
      html,
    });
    console.log(`✅ [EmailService:SMTP] Delivered to ${to} via SMTP`);
    return { success: true, provider: "smtp", info: result };
  } catch (err) {
    const isTimeout = err.code === "ETIMEDOUT" || err.message?.includes("timeout");
    if (isTimeout) {
      console.warn(`⚠️ [EmailService:SMTP] Connection timed out. Note: Render Free Tier blocks outbound SMTP ports (25, 465, 587). Please set EMAIL_WEBHOOK_URL or RESEND_API_KEY in Render environment variables for instant HTTPS delivery.`);
    } else {
      console.warn(`⚠️ [EmailService:SMTP] Delivery failed:`, err.message);
    }
    return { success: false, error: err.message };
  }
}

function formatWhatsAppLink(phone, clientName, subject) {
  if (!phone) return null;
  const digitsOnly = phone.replace(/[^\d]/g, "");
  if (!digitsOnly) return null;
  const fullDigits = digitsOnly.length === 10 ? `91${digitsOnly}` : digitsOnly;
  const defaultText = `Hi ${clientName}, this is Lalit Saini regarding your project inquiry: "${subject || "Web Development"}".`;
  return `https://wa.me/${fullDigits}?text=${encodeURIComponent(defaultText)}`;
}

function formatTelLink(phone) {
  if (!phone) return null;
  const cleaned = phone.replace(/[^\d+]/g, "");
  return cleaned ? `tel:${cleaned}` : null;
}

/**
 * Send Contact Inquiry Notifications:
 * 1. Notification to Lalit Saini with full inquiry details + phone action links
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

  const telUrl = formatTelLink(phone);
  const waUrl = formatWhatsAppLink(phone, name, subject);

  // 1. Email to Lalit (Owner Alert) - Modern, Editorial, Responsive
  const ownerMailOptions = {
    from: FROM_EMAIL,
    to: OWNER_EMAIL,
    replyTo: email,
    subject: `⚡ [Client Lead] ${name}: "${subject || niche || "Project Inquiry"}" ${phone ? `| 📞 ${phone}` : ""}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Project Inquiry</title>
      </head>
      <body style="margin: 0; padding: 24px 12px; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased;">
        <div style="max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08); border: 1px solid #e2e8f0;">
          
          <!-- Top Hero Branding -->
          <div style="background: linear-gradient(135deg, #090d16 0%, #1e293b 100%); padding: 28px 24px; color: #ffffff; border-bottom: 3px solid #2563eb;">
            <div style="display: inline-block; background: rgba(37, 99, 235, 0.2); border: 1px solid rgba(37, 99, 235, 0.4); padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #60a5fa; margin-bottom: 12px;">
              ⚡ NEW CLIENT PROJECT INQUIRY
            </div>
            <h1 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.02em; color: #ffffff;">
              W3 Lalit Portfolio Inquiry
            </h1>
            <p style="margin: 6px 0 0 0; font-size: 13px; color: #94a3b8;">
              Received on ${formattedDate} via <a href="https://w3lalit.vercel.app/contact.html" style="color: #93c5fd; text-decoration: none;">w3lalit.vercel.app</a>
            </p>
          </div>

          <!-- Main Content -->
          <div style="padding: 24px;">

            <!-- Client Info Card -->
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; margin-bottom: 20px;">
              <div style="font-size: 11px; font-weight: 700; color: #64748b; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 12px;">
                CLIENT & CONTACT INFORMATION
              </div>

              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 6px 0; font-size: 13px; font-weight: 600; color: #64748b; width: 110px;">Name:</td>
                  <td style="padding: 6px 0; font-size: 15px; font-weight: 700; color: #0f172a;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 13px; font-weight: 600; color: #64748b;">Email:</td>
                  <td style="padding: 6px 0; font-size: 14px;">
                    <a href="mailto:${email}" style="color: #2563eb; font-weight: 600; text-decoration: none;">${email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 13px; font-weight: 600; color: #64748b; vertical-align: top;">Phone:</td>
                  <td style="padding: 6px 0; font-size: 14px; color: #0f172a;">
                    ${phone ? `
                      <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                        <strong style="color: #0f172a; font-size: 15px;">${phone}</strong>
                      </div>
                      <div style="margin-top: 6px;">
                        ${telUrl ? `<a href="${telUrl}" style="display: inline-block; background: #e2e8f0; color: #0f172a; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: 600; text-decoration: none; margin-right: 6px;">📞 Call Now</a>` : ""}
                        ${waUrl ? `<a href="${waUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: 600; text-decoration: none;">💬 WhatsApp</a>` : ""}
                      </div>
                    ` : `<span style="color: #94a3b8; font-style: italic;">Not provided by client</span>`}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 13px; font-weight: 600; color: #64748b;">Project Scope:</td>
                  <td style="padding: 6px 0;">
                    <span style="display: inline-block; background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 700; text-transform: uppercase;">
                      ${niche || "General"}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 13px; font-weight: 600; color: #64748b;">Subject:</td>
                  <td style="padding: 6px 0; font-size: 14px; font-weight: 600; color: #0f172a;">${subject || "Portfolio Contact"}</td>
                </tr>
              </table>
            </div>

            <!-- Message Block -->
            <div style="margin-bottom: 24px;">
              <div style="font-size: 11px; font-weight: 700; color: #64748b; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 8px;">
                PROJECT REQUIREMENTS & DETAILS
              </div>
              <div style="background: #ffffff; border: 1px solid #cbd5e1; border-left: 4px solid #2563eb; padding: 16px; border-radius: 6px; font-size: 14px; line-height: 1.65; color: #334155; white-space: pre-wrap; word-break: break-word;">${message}</div>
            </div>

            <!-- Action CTAs -->
            <div style="background: #f1f5f9; border-radius: 8px; padding: 16px; text-align: center;">
              <div style="font-size: 12px; font-weight: 600; color: #64748b; margin-bottom: 10px;">
                RECOMMENDED ACTIONS:
              </div>
              <div style="display: inline-block;">
                <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject || 'Your project inquiry with W3 Lalit')}" style="display: inline-block; background: #0f172a; color: #ffffff; text-decoration: none; padding: 10px 18px; border-radius: 6px; font-weight: 600; font-size: 13px; margin: 4px;">
                  ✉️ Reply via Email
                </a>
                ${waUrl ? `
                <a href="${waUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: #22c55e; color: #ffffff; text-decoration: none; padding: 10px 18px; border-radius: 6px; font-weight: 600; font-size: 13px; margin: 4px;">
                  💬 Open in WhatsApp
                </a>
                ` : ""}
                <a href="https://w3lalit.vercel.app/admin.html" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: #2563eb; color: #ffffff; text-decoration: none; padding: 10px 18px; border-radius: 6px; font-weight: 600; font-size: 13px; margin: 4px;">
                  🚀 Open Admin Center
                </a>
              </div>
            </div>

          </div>

          <!-- Footer -->
          <div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px 24px; text-align: center; font-size: 12px; color: #64748b;">
            Logged securely into W3 Lalit Portfolio Inquiries System.<br>
            Portfolio: <a href="https://w3lalit.vercel.app" style="color: #2563eb; text-decoration: none;">w3lalit.vercel.app</a> • Backend: <a href="https://w3lalit-backend.onrender.com" style="color: #2563eb; text-decoration: none;">w3lalit-backend.onrender.com</a>
          </div>

        </div>
      </body>
      </html>
    `,
  };

  // 2. Automated Confirmation Receipt to Client
  const clientMailOptions = {
    from: FROM_EMAIL,
    to: email,
    subject: `Thank you for contacting Lalit Saini — Inquiry Confirmation`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Inquiry Confirmation</title>
      </head>
      <body style="margin: 0; padding: 24px 12px; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08); border: 1px solid #e2e8f0;">
          
          <div style="background: linear-gradient(135deg, #090d16 0%, #1e293b 100%); padding: 28px 24px; color: #ffffff; border-bottom: 3px solid #2563eb;">
            <h1 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.02em; color: #ffffff;">
              W3 Lalit Saini
            </h1>
            <p style="margin: 4px 0 0 0; font-size: 13px; color: #94a3b8;">
              Full-Stack Web Developer & Engineer
            </p>
          </div>

          <div style="padding: 24px; color: #1e293b; line-height: 1.6;">
            <p style="margin: 0 0 16px 0; font-size: 15px;">Hi <strong>${name}</strong>,</p>
            
            <p style="margin: 0 0 16px 0; font-size: 14px; color: #334155;">
              Thank you for reaching out through my developer portfolio! I have received your project details regarding <strong>"${subject || niche || "Web Development Project"}"</strong>.
            </p>
            
            <p style="margin: 0 0 16px 0; font-size: 14px; color: #334155;">
              I am currently reviewing your requirements and will reply within <strong>24 hours</strong> with technical insights, scope estimates, or follow-up questions.
            </p>

            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0;">
              <div style="font-size: 11px; font-weight: 700; color: #64748b; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 8px;">
                SUMMARY OF YOUR SUBMISSION:
              </div>
              <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                <tr>
                  <td style="padding: 4px 0; color: #64748b; width: 110px;"><strong>Project Scope:</strong></td>
                  <td style="padding: 4px 0; color: #0f172a;">${niche || "General"}</td>
                </tr>
                ${phone ? `
                <tr>
                  <td style="padding: 4px 0; color: #64748b;"><strong>Phone:</strong></td>
                  <td style="padding: 4px 0; color: #0f172a;">${phone}</td>
                </tr>` : ""}
                <tr>
                  <td style="padding: 4px 0; color: #64748b;"><strong>Subject:</strong></td>
                  <td style="padding: 4px 0; color: #0f172a;">${subject || "General Inquiry"}</td>
                </tr>
              </table>
              <div style="margin-top: 10px; padding-top: 10px; border-top: 1px dashed #cbd5e1; font-size: 13px; color: #475569; white-space: pre-wrap;">
                ${message}
              </div>
            </div>

            <p style="margin: 0 0 16px 0; font-size: 14px; color: #334155;">
              In the meantime, feel free to explore my latest client projects and case studies:
            </p>

            <div style="text-align: center; margin: 20px 0;">
              <a href="https://w3lalit.vercel.app/projects.html" style="display: inline-block; background: #0f172a; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-weight: 600; font-size: 13px; margin: 4px;">
                Explore Featured Projects
              </a>
              <a href="https://w3lalit.vercel.app/assets/Lalit_Resume.pdf" style="display: inline-block; background: #f1f5f9; color: #0f172a; border: 1px solid #cbd5e1; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-weight: 600; font-size: 13px; margin: 4px;">
                Download Resume (PDF)
              </a>
            </div>

            <p style="margin: 24px 0 0 0; font-size: 14px; color: #0f172a; font-weight: 600;">
              Best regards,<br>
              <span style="color: #2563eb;">Lalit Saini</span><br>
              <span style="font-size: 12px; font-weight: 400; color: #64748b;">Full-Stack Web Developer | Sikar, Rajasthan, India</span>
            </p>
          </div>

          <div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 14px; text-align: center; font-size: 12px; color: #94a3b8;">
            © 2026 Lalit Saini. All rights reserved. • <a href="https://w3lalit.vercel.app" style="color: #64748b; text-decoration: none;">w3lalit.vercel.app</a>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    const [ownerRes, clientRes] = await Promise.allSettled([
      dispatchEmail({
        to: OWNER_EMAIL,
        replyTo: email,
        subject: ownerMailOptions.subject,
        html: ownerMailOptions.html,
        text: `New Inquiry from ${name} (${email}): ${message}`,
        fromName: name || "W3 Lalit Portfolio",
        clientData: contactData,
      }),
      dispatchEmail({
        to: email,
        replyTo: OWNER_EMAIL,
        subject: clientMailOptions.subject,
        html: clientMailOptions.html,
        text: `Thank you for reaching out, ${name}! Lalit Saini will reply within 24 hours.`,
        fromName: "Lalit Saini",
        clientData: contactData,
      }),
    ]);

    if (ownerRes.status === "rejected" || !ownerRes.value?.success) {
      console.warn("⚠️ [EmailService] Failed to send owner alert:", ownerRes.reason?.message || ownerRes.value?.error);
    } else {
      console.log("✅ [EmailService] Inquiry notification delivered to", OWNER_EMAIL);
    }

    if (clientRes.status === "rejected" || !clientRes.value?.success) {
      console.warn("⚠️ [EmailService] Failed to send client confirmation:", clientRes.reason?.message || clientRes.value?.error);
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
      dispatchEmail({
        to: subscriberEmail,
        replyTo: OWNER_EMAIL,
        subject: subscriberOptions.subject,
        html: subscriberOptions.html,
        fromName: "Lalit Saini",
      }),
      dispatchEmail({
        to: OWNER_EMAIL,
        replyTo: subscriberEmail,
        subject: ownerOptions.subject,
        html: ownerOptions.html,
        fromName: "W3 Lalit Subscribers",
      }),
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
    await dispatchEmail({
      to: OWNER_EMAIL,
      subject: alertOptions.subject,
      html: alertOptions.html,
      fromName: "W3 Lalit Security",
    });
    return { success: true };
  } catch (err) {
    console.warn("⚠️ [EmailService] Security alert email failed:", err.message);
    return { success: false, error: err.message };
  }
}
