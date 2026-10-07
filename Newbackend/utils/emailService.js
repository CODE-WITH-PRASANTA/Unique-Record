const nodemailer = require('nodemailer');
const path = require('path');
const dotenv = require('dotenv');

// Create Nodemailer Transporter using Gmail SMTP credentials
const createTransporter = () => {
  // Always ensure fresh env vars
  dotenv.config({ path: path.join(__dirname, '../.env') });
  const emailUser = (process.env.EMAIL_USER || '').trim();
  const emailPass = (process.env.EMAIL_PASS || '').replace(/\s+/g, '').trim();

  if (!emailUser || !emailPass) {
    console.warn('⚠️ Warning: EMAIL_USER or EMAIL_PASS is not configured in .env');
  }

  // Try standard Gmail service or direct SMTP
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

/**
 * Send 6-Digit Password Reset OTP Email
 * @param {string} toEmail - Recipient email address
 * @param {string} otp - 6 digit OTP string
 * @param {string} userName - Optional user's name
 */
const sendResetPasswordOtp = async (toEmail, otp, userName = 'Valued User') => {
  try {
    const transporter = createTransporter();
    const fromEmail = process.env.EMAIL_USER || 'uruonline2025@gmail.com';

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset OTP</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f6f8;
            margin: 0;
            padding: 20px;
            color: #1f2937;
          }
          .email-container {
            max-width: 560px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            border: 1px solid #e5e7eb;
          }
          .header {
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            color: #ffffff;
            padding: 30px 20px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 700;
            letter-spacing: 0.5px;
          }
          .header p {
            margin: 6px 0 0 0;
            font-size: 14px;
            opacity: 0.9;
          }
          .content {
            padding: 30px;
            text-align: center;
          }
          .greeting {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 12px;
            color: #111827;
          }
          .text {
            font-size: 14px;
            color: #4b5563;
            line-height: 1.6;
            margin-bottom: 24px;
          }
          .otp-badge {
            display: inline-block;
            background: #fff8e6;
            color: #b45309;
            border: 2px dashed #f59e0b;
            border-radius: 10px;
            padding: 14px 28px;
            font-size: 32px;
            font-weight: 800;
            letter-spacing: 8px;
            margin-bottom: 24px;
            font-family: 'Courier New', Courier, monospace;
          }
          .timer-warning {
            background-color: #fef2f2;
            border: 1px solid #fecaca;
            color: #991b1b;
            padding: 10px;
            border-radius: 6px;
            font-size: 13px;
            margin-bottom: 20px;
          }
          .footer {
            background-color: #f9fafb;
            border-top: 1px solid #e5e7eb;
            padding: 16px;
            text-align: center;
            font-size: 12px;
            color: #9ca3af;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>Unique Records of Universe</h1>
            <p>Password Reset Verification Code</p>
          </div>
          <div class="content">
            <div class="greeting">Hello, ${userName}!</div>
            <p class="text">
              We received a request to reset the password for your account associated with <b>${toEmail}</b>. Use the 6-digit verification code below to complete the reset process:
            </p>
            <div class="otp-badge">${otp}</div>
            <div class="timer-warning">
              ⏰ This OTP is valid for <strong>10 minutes</strong>. Do not share it with anyone.
            </div>
            <p class="text" style="font-size: 12px; color: #6b7280;">
              If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.
            </p>
          </div>
          <div class="footer">
            &copy; ${new Date().getFullYear()} Unique Records of Universe. All rights reserved.
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"Unique Records of Universe" <${fromEmail}>`,
      to: toEmail,
      subject: `🔒 Password Reset OTP: ${otp} - Unique Records of Universe`,
      text: `Hello ${userName},\n\nYour 6-digit password reset OTP is: ${otp}\n\nThis code is valid for 10 minutes. If you did not request this, please ignore this message.`,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset OTP email sent successfully to ${toEmail}. Message ID: ${info.messageId}`);
    return { sent: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Nodemailer Error sending OTP to ${toEmail}:`, error.message);
    return { sent: false, error: error.message };
  }
};

module.exports = {
  sendResetPasswordOtp,
};
