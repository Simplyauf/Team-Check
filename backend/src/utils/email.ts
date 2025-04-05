const nodemailer = require("nodemailer");
const { AppError } = require("./AppError");

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log("SMTP Connection Error:", error);
  } else {
    console.log("SMTP Server is ready to take our messages");
  }
});

/**
 * Send an invite email to a user
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.inviteToken - Invite token
 * @param {string} options.workspaceName - Name of the workspace
 * @param {string} options.invitedBy - Name of the person who sent the invite
 */
async function sendInviteEmail({ to, inviteToken, workspaceName, invitedBy }) {
  try {
    const inviteUrl = `${process.env.FRONTEND_URL}/invite/${inviteToken}`;

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_ADDRESS}>`,
      to,
      subject: `You've been invited to join ${workspaceName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>You've been invited to join ${workspaceName}</h2>
          <p>${invitedBy} has invited you to join their workspace on Team Check.</p>
          <p>Click the button below to accept the invitation:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${inviteUrl}" style="
              background-color: #0066cc;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 4px;
              display: inline-block;
            ">
              Accept Invitation
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            If you're having trouble clicking the button, copy and paste this URL into your browser:
            <br>
            ${inviteUrl}
          </p>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            If you didn't expect this invitation, you can safely ignore this email.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending invite email:", error);
    throw new AppError("Failed to send invite email", 500);
  }
}

module.exports = {
  sendInviteEmail,
};
