const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, otpCode) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Unique Records of Universe" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:20px;">
        <table align="center" width="600" cellpadding="0" cellspacing="0" 
          style="background:#fff; border-radius:8px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr style="background:linear-gradient(90deg,#2c3e50,#34495e); color:white;">
            <td style="padding:20px; text-align:center;">
              <h1 style="margin:0; font-size:22px;">Unique Records of Universe</h1>
              <p style="margin:0; font-size:14px;">Password Reset Security</p>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding:30px; color:#333;">
              <h2 style="color:#2c3e50;">Hello,</h2>
              <p style="font-size:15px; line-height:1.6;">
                We received a request to reset your password.  
                Please use the OTP below to complete the process:
              </p>

              <div style="background:#f9f9f9; border-left:4px solid #e67e22; padding:15px; margin:20px 0; border-radius:4px; text-align:center;">
                <p style="margin:0; font-size:20px; letter-spacing:3px; font-weight:bold; color:#e67e22;">
                  ${otpCode}
                </p>
              </div>

              <p style="font-size:14px; line-height:1.6; color:#555;">
                ⚠️ This OTP will expire in <b>5 minutes</b>.  
                If you didn’t request this, please ignore this email.
              </p>

              <!-- Call to Action -->
              <div style="text-align:center; margin:25px 0;">
                <a href="#" 
                  style="background:#2c3e50; color:#fff; padding:12px 25px; text-decoration:none; border-radius:4px; font-size:14px;">
                  Reset Password
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr style="background:#ecf0f1;">
            <td style="padding:15px; text-align:center; font-size:12px; color:#7f8c8d;">
              <p style="margin:5px 0;">© ${new Date().getFullYear()} Unique Records of Universe</p>
              <p style="margin:5px 0;">
                Support: <a href="mailto:${process.env.EMAIL_USER}" style="color:#2c3e50; text-decoration:none;">${process.env.EMAIL_USER}</a>
              </p>
            </td>
          </tr>
        </table>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
