// const { Resend } = require('resend');
const nodemailer = require('nodemailer');
const dns = require('node:dns').promises;

async function sendemail(Url, email, firstName, lastName) {

  const emailTemplate = `
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f9fafb;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 40px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #6d74fc;
            margin-top: 0;
        }
        p {
            color: #555;
        }
        .reset-link a {
            font-size: 18px;
            font-weight: bold;
            color: #6d74fc;
            text-decoration: none;
        }
        .reset-link a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Password Reset Request</h1>
        <p>Hi ${firstName} ${lastName},</p>
        <p>We received a request to reset your password. Click the link below to reset your password:</p>
        <p class="reset-link"><a href="${Url}">Reset Password</a></p>
        <p><em>This link will expire in 1 hour.</em></p>
        <p>If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
        <p>Thank you,</p>
        <p>RideMate</p>
    </div>
</body>
</html>
`;

  // --- Resend Logic (Commented Out) ---
  // const resend = new Resend(process.env.RESEND_EMAIL_API_KEY);
  // const { data, error } = await resend.emails.send({
  //   from: process.env.SENDER_EMAIL,
  //   to: email,
  //   subject: 'Password Reset Request',
  //   html: emailTemplate
  // });
  // if (error) {
  //   throw new Error(`Resend provider error: ${error.message || 'Unknown'}`);
  // }

  // --- Nodemailer Logic ---
  // Explicitly resolve IPv4 address because Render Free Tier breaks IPv6 routing on port 587/465
  const { address } = await dns.lookup('smtp.gmail.com', { family: 4 });

  const transporter = nodemailer.createTransport({
    host: address,
    port: 587,
    secure: false, // Use TLS on port 587
    requireTLS: true,
    tls: {
        servername: 'smtp.gmail.com'
    },
    auth: {
      user: process.env.GMAIL_USER || 'varpedarsh11@gmail.com',
      pass: (process.env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, '')
    }
  });

  const mailOptions = {
    from: `"RideMate" <${process.env.GMAIL_USER || 'varpedarsh11@gmail.com'}>`,
    to: email,
    subject: 'Password Reset Request',
    html: emailTemplate
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error(`Nodemailer provider error: ${error.message || 'Unknown'}`);
  }
}

module.exports = { sendemail };