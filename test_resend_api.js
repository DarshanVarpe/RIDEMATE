const { Resend } = require('resend');

const resend = new Resend('re_QmmznhJc_KwtEHWmZwHE393TYrr25eUQG');

async function testEmail() {
  const { data, error } = await resend.emails.send({
    from: 'RideMate <onboarding@resend.dev>',
    to: 'darshanvarpe@gmail.com',
    subject: 'Test',
    html: '<p>Test</p>'
  });

  if (error) {
    console.error("RESEND ERROR:", error);
  } else {
    console.log("RESEND SUCCESS:", data);
  }
}

testEmail();
