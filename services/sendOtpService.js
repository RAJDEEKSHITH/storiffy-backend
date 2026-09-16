import nodemailer from "nodemailer";
import OTP from "../models/otpModel.js";
import crypto from "node:crypto"

// Create transporter ONCE when the application starts.
// Don't create a new transporter for every OTP request.
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS,
  },
});

// Optional: verify SMTP connection when server starts
transporter
  .verify()
  .then(() => {
    console.log("Gmail SMTP server is ready");
  })
  .catch((err) => {
    console.error("Gmail SMTP verification failed:", err);
  });

export async function sendOtpService(email) {
  try {
    // Generate 4-digit OTP
    const otp = crypto.randomInt(1000, 10000).toString();

    // Store/replace OTP for this email
    await OTP.findOneAndUpdate(
      { email },
      {
        otp,
        createdAt: new Date(),
      },
      {
        upsert: true,
        returnDocument : 'after'
      },
    );

    const html = `
      <div style="font-family: sans-serif;">
        <h2>Your Storage App OTP is: ${otp}</h2>
        <p>This OTP is valid for 10 minutes.</p>
      </div>
    `;

    const info = await transporter.sendMail({
      from: `"Storage App" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Storage App OTP",
      html,
    });

    return {
      success: true,
      message: "OTP sent successfully",
    };
  } catch (error) {
    console.error("Error while sending OTP:", error);

    return {
      success: false,
      message: "Failed to send OTP",
    };
  }
}
