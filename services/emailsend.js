const { google } = require('googleapis');

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

  // --- Official Google Gmail API Logic ---
  const OAuth2 = google.auth.OAuth2;
  const oauth2Client = new OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
  });

  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

  const subject = 'Password Reset Request';
  const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
  
  const messageParts = [
    `From: RideMate <${process.env.GMAIL_USER || 'darshanvarpe@gmail.com'}>`,
    `To: ${email}`,
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${utf8Subject}`,
    '',
    emailTemplate
  ];
  
  const message = messageParts.join('\n');
  
  // Gmail API requires base64url format
  const encodedMessage = Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  try {
    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage
      }
    });
  } catch (error) {
    throw new Error(`Gmail API provider error: ${error.message || 'Unknown'}`);
  }
}

module.exports = { sendemail };