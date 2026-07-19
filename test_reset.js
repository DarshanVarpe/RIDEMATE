const mongoose = require('mongoose');
require('dotenv').config();


const emailService = require('./services/emailsend');
let lastSentUrl = null;
const originalSendEmail = emailService.sendemail;
emailService.sendemail = async (url, email, fName, lName) => {
  console.log(`[MOCK EMAIL SENT to ${email}] URL: ${url}`);
  lastSentUrl = url;
  return;
};

const userModel = require('./models/user.models');
const request = require('supertest');
const app = require('./app');
const jwt = require('jsonwebtoken');

async function runTests() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const manualEmail = "testmanual@example.com";
  const googleEmail = "testgoogle@example.com";
  await userModel.deleteMany({ email: { $in: [manualEmail, googleEmail] } });

  const manualPassword = 'password123';
  const hashedPassword = await userModel.hashPassword(manualPassword);
  
  const manualUser = await userModel.create({
    firstName: 'Test',
    lastName: 'Manual',
    email: manualEmail,
    password: hashedPassword,
    department: 'Testing',
    phone: '9876543210',
    img: 'test.jpg'
  });


  const googleUser = await userModel.create({
    firstName: 'Test',
    lastName: 'Google',
    email: googleEmail,
    googleId: '123456789',
    department: 'Testing',
    phone: '9876543210',
    img: 'test.jpg'
  });

  console.log("--- STARTING TESTS ---");

  console.log("\n1. Testing Manual Account (Valid)");
  lastSentUrl = null;
  let res1 = await request(app).post('/forget-password').send({ email: manualEmail });
  console.log("-> Status:", res1.statusCode);
  console.log("-> Body:", res1.body);
  console.log("-> Email sent:", !!lastSentUrl);

  const token = lastSentUrl.split('/reset-password/')[1];

  console.log("\n7. Testing Successful Password Reset");
  let res7 = await request(app).post('/resetPassword').send({ token, password: 'newPassword123' });
  console.log("-> Status:", res7.statusCode);
  console.log("-> Body:", res7.body);

  console.log("\n6. Testing Reused Reset Token");
  let res6 = await request(app).post('/resetPassword').send({ token, password: 'newPassword1234' });
  console.log("-> Status:", res6.statusCode);
  console.log("-> Body:", res6.body);

  console.log("\n2. Testing Unknown Email");
  lastSentUrl = null;
  let res2 = await request(app).post('/forget-password').send({ email: 'unknown_fake_email@test.com' });
  console.log("-> Status:", res2.statusCode);
  console.log("-> Body:", res2.body);
  console.log("-> Email sent:", !!lastSentUrl);

  console.log("\n3. Testing Google Account");
  let res3 = await request(app).post('/forget-password').send({ email: googleEmail });
  console.log("-> Status:", res3.statusCode);
  console.log("-> Body:", res3.body);

  console.log("\n5. Testing Expired Token");
  const expiredToken = jwt.sign({ userId: manualUser._id }, process.env.JWT_SECRET, { expiresIn: "-1h" });
  let res5 = await request(app).post('/resetPassword').send({ token: expiredToken, password: 'pw' });
  console.log("-> Status:", res5.statusCode);
  console.log("-> Body:", res5.body);

  console.log("\n4. Testing Missing API Key (simulating Resend rejection)");
  await userModel.updateOne({ email: manualEmail }, { resetTokenExpiry: null });
  
  emailService.sendemail = originalSendEmail; 
  const originalApiKey = process.env.RESEND_EMAIL_API_KEY;
  process.env.RESEND_EMAIL_API_KEY = "invalid_api_key_for_test";
  
  let res4 = await request(app).post('/forget-password').send({ email: manualEmail });
  console.log("-> Status:", res4.statusCode);
  console.log("-> Body:", res4.body);
  
  process.env.RESEND_EMAIL_API_KEY = originalApiKey;
  await userModel.deleteMany({ _id: { $in: [manualUser._id, googleUser._id] } });
}

runTests().then(() => {
  console.log("\nTests completed");
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
