import nodemailer from 'nodemailer';
// Force reload for .env

const createTransporter = async () => {
  // If SMTP configuration is provided, use it (Production / Real Email)
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Fallback: Ethereal Test Account (Development Only)
  console.warn('\n⚠️  WARNING: Using Ethereal mock email service. Configure SMTP_HOST in .env for real emails.\n');
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

export const sendPasswordResetEmail = async (toEmail, resetUrl) => {
  const transporter = await createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Dream Builder AI" <noreply@dreambuilder.ai>',
    to: toEmail,
    subject: 'Reset Your Dream Builder AI Password',
    html: `
      <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #0B0F14; color: #FFFFFF; border-radius: 12px; border: 1px solid #252B36;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #00B8D9; margin: 0; font-size: 24px; font-weight: bold; letter-spacing: -0.5px;">Dream Builder AI</h1>
          <p style="color: #9CA3AF; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin-top: 8px;">Executive Grade Intelligence</p>
        </div>
        
        <div style="background-color: #151B23; padding: 30px; border-radius: 8px; border: 1px solid #252B36;">
          <p style="color: #FFFFFF; font-size: 16px; margin-top: 0;">Hello,</p>
          <p style="color: #9CA3AF; font-size: 15px; line-height: 1.6;">We received a request to reset the password for your startup workspace. If you made this request, please click the secure link below to create a new password:</p>
          
          <div style="text-align: center; margin: 35px 0;">
            <a href="${resetUrl}" style="display: inline-block; background-color: #00B8D9; color: #000000; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px; transition: background-color 0.2s;">Securely Reset Password</a>
          </div>
          
          <p style="color: #9CA3AF; font-size: 14px; margin-bottom: 5px;">Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #00B8D9; font-size: 13px; margin-top: 0;">${resetUrl}</p>
        </div>

        <p style="margin-top: 30px; font-size: 12px; color: #64748B; text-align: center; line-height: 1.5;">
          This link will expire in 30 minutes for your security.<br>
          If you didn't request this, you can safely ignore this email.<br>
          © ${new Date().getFullYear()} Dream Builder AI. All rights reserved.
        </p>
      </div>
    `,
  };

  const info = await transporter.sendMail(mailOptions);

  if (info.messageId && nodemailer.getTestMessageUrl(info)) {
    console.log('\n======================================================');
    console.log('✉️  EMAIL SENT (TEST MODE)');
    console.log('Preview URL: ' + nodemailer.getTestMessageUrl(info));
    console.log('======================================================\n');
  } else {
    console.log(`\n✉️  Email successfully sent to ${toEmail}\n`);
  }
};
