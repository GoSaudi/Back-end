import sgMail from "@sendgrid/mail";

export async function sendEmail(emailData: {
  to: string;
  subject: string;
  text: string;
}): Promise<boolean> {
  try {
    if (
      process.env.STRAPI_ADMIN_SENDGRID_API_KEY &&
      process.env.STRAPI_ADMIN_SENDGRID_SENDER_NAME
    ) {
      sgMail.setApiKey(process.env.STRAPI_ADMIN_SENDGRID_API_KEY);

      const { to, subject, text } = emailData;
      const mailData = {
        to,
        from: process.env.STRAPI_ADMIN_SENDGRID_SENDER_NAME,
        subject,
        html: text,
      };

      await sgMail.send(mailData);
      return true;
    }
    throw new Error("Something went wrong");
  } catch (error) {
    throw new Error("Failed to send email. " + error);
  }
}
