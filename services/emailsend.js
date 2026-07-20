

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

  // --- Brevo (Sendinblue) HTTP API Logic ---
  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: {
          name: 'RideMate',
          email: process.env.BREVO_SENDER_EMAIL || 'sigmamale2332@gmail.com' // MUST match the verified Brevo email
        },
        to: [
          { email: email, name: firstName + " " + lastName }
        ],
        subject: 'Password Reset Request',
        htmlContent: emailTemplate
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Brevo HTTP Error: ${response.status} - ${errorText}`);
    }
  } catch (error) {
    throw new Error(`Brevo provider error: ${error.message || 'Unknown'}`);
  }
}

module.exports = { sendemail };