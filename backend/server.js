import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3002;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middlewares
app.use(cors({
  origin: '*', // Allow any origin in development to prevent CORS errors if ports change
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve static uploaded files
app.use('/uploads', express.static(uploadsDir));

// In-memory store for OTP challenges (challengeId -> { email, code, expiresAt, transaction })
const challenges = new Map();

// Helper to generate a random 6-digit numeric OTP
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Clean up expired challenges every minute to prevent memory bloat
setInterval(() => {
  const now = Date.now();
  for (const [id, challenge] of challenges.entries()) {
    if (challenge.expiresAt < now) {
      challenges.delete(id);
    }
  }
}, 60 * 1000);

// Endpoint: Send or Resend OTP
app.post('/api/otp/resend', async (req, res) => {
  try {
    const { email, fullName, transaction } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    const otpCode = generateOtp();
    const challengeId = crypto.randomUUID();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes expiration

    // Store in-memory
    challenges.set(challengeId, {
      email,
      code: otpCode,
      expiresAt,
      transaction
    });

    console.log(`\n=================== OTP TRANSACTION CHALLENGE ===================`);
    console.log(`Challenge ID : ${challengeId}`);
    console.log(`Recipient    : ${email} (${fullName || 'N/A'})`);
    console.log(`Amount       : ${transaction?.currency || 'GBP'} ${transaction?.amount || 0}`);
    console.log(`To Payee     : ${transaction?.recipientName || 'N/A'} (Acc: ${transaction?.recipientAccount || 'N/A'})`);
    console.log(`OTP Code     : ${otpCode} (Expires in 5 minutes)`);
    console.log(`=================================================================\n`);

    const apiKey = process.env.RESEND_API_KEY;
    const fromAddress = process.env.EMAIL_FROM || 'onboarding@resend.dev';

    if (!apiKey || apiKey === 'your_resend_api_key_here') {
      // Demo Mode
      return res.json({
        message: `[DEMO MODE] OTP generated! The code has been printed to the backend server's console log. Use code: ${otpCode}`,
        challengeId
      });
    }

    // Real Mode - send using Resend API
    const resend = new Resend(apiKey);
    const amountStr = new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: transaction?.currency || 'GBP'
    }).format(transaction?.amount || 0);

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; max-width: 600px; margin: 0 auto; border: 1px solid #e1e8e5; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <div style="background-color: #006A4D; color: #ffffff; padding: 24px; text-align: center;">
          <h2 style="margin: 0; font-size: 20px; letter-spacing: 0.5px;">KORVANTIS IMPERIAL BANK</h2>
          <p style="margin: 4px 0 0 0; font-size: 14px; opacity: 0.85;">Security Verification</p>
        </div>
        <div style="padding: 24px; background-color: #ffffff;">
          <p style="font-size: 16px; margin-top: 0;">Hello ${fullName || 'Valued Customer'},</p>
          <p style="font-size: 15px;">We received a request to authorize a transfer from your account. Please use the following One-Time Password (OTP) to authorize this transaction:</p>
          
          <div style="background-color: #f4faf7; border: 1px dashed #006A4D; border-radius: 6px; padding: 16px; text-align: center; margin: 24px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #006A4D; font-family: monospace;">${otpCode}</span>
            <p style="margin: 8px 0 0 0; font-size: 12px; color: #667a73;">This code is valid for 5 minutes.</p>
          </div>

          <h3 style="font-size: 15px; color: #006A4D; margin-top: 24px; margin-bottom: 12px; border-bottom: 1px solid #e1e8e5; padding-bottom: 6px;">Transaction Details</h3>
          <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
            <tr>
              <td style="padding: 6px 0; color: #667a73; width: 40%;">Transfer Type:</td>
              <td style="padding: 6px 0; font-weight: bold;">${transaction?.transferType || 'Transfer'}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #667a73;">Recipient Name:</td>
              <td style="padding: 6px 0; font-weight: bold;">${transaction?.recipientName || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #667a73;">Recipient Account:</td>
              <td style="padding: 6px 0; font-weight: bold; font-family: monospace;">${transaction?.recipientAccount || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #667a73;">Amount:</td>
              <td style="padding: 6px 0; font-weight: bold; color: #006A4D;">${amountStr}</td>
            </tr>
          </table>

          <div style="margin-top: 32px; padding: 16px; background-color: #fff9f6; border-left: 4px solid #ff7a00; border-radius: 4px;">
            <p style="margin: 0; font-size: 12px; color: #7a3d00; font-weight: bold;">Security Warning:</p>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #7a3d00;">If you did not initiate this transaction, please log in to your account and freeze your card immediately, or call Korvantis Imperial Bank customer service.</p>
          </div>
        </div>
        <div style="background-color: #f4faf7; color: #667a73; padding: 16px; text-align: center; font-size: 11px; border-top: 1px solid #e1e8e5;">
          <p style="margin: 0;">This is an automated security message. Please do not reply to this email.</p>
          <p style="margin: 4px 0 0 0;">&copy; Korvantis Imperial Bank Group plc. All rights reserved.</p>
        </div>
      </div>
    `;

    const { data: resData, error: resError } = await resend.emails.send({
      from: fromAddress,
      to: [email],
      subject: `Korvantis Imperial Bank Security: Authorize Transfer - ${otpCode}`,
      html: emailHtml
    });

    if (resError) {
      console.error('Resend API returned error:', resError);
      return res.status(500).json({ error: resError.message || 'Failed to send OTP email via Resend.' });
    }

    return res.json({
      message: 'OTP sent to your registered email address.',
      challengeId
    });
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return res.status(500).json({ error: error.message || 'Failed to send OTP.' });
  }
});

// Endpoint: Verify OTP
app.post('/api/otp/verify', (req, res) => {
  const { code, challengeId } = req.body;

  if (!code || !challengeId) {
    return res.status(400).json({ error: 'Both code and challengeId are required.' });
  }

  const storedChallenge = challenges.get(challengeId);

  if (!storedChallenge) {
    return res.status(400).json({ error: 'Verification session expired or invalid. Please request a new OTP.' });
  }

  if (storedChallenge.expiresAt < Date.now()) {
    challenges.delete(challengeId);
    return res.status(400).json({ error: 'Verification code has expired. Please request a new OTP.' });
  }

  if (storedChallenge.code !== code.trim()) {
    return res.status(400).json({ error: 'Invalid verification code.' });
  }

  // Successfully verified! Clean up key
  challenges.delete(challengeId);

  return res.json({
    verified: true,
    message: 'OTP verification successful.'
  });
});

// Endpoint: Upload avatar image (accepts Base64 payload)
app.post('/api/upload', (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Image data is required.' });
    }

    // Match image mime type and base64 data
    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: 'Invalid Base64 image format.' });
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    // Simple extension mapping
    let extension = 'png';
    if (mimeType.includes('jpeg') || mimeType.includes('jpg')) {
      extension = 'jpg';
    } else if (mimeType.includes('gif')) {
      extension = 'gif';
    } else if (mimeType.includes('webp')) {
      extension = 'webp';
    }

    const filename = `${crypto.randomUUID()}.${extension}`;
    const filePath = path.join(uploadsDir, filename);

    // Save file
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `http://localhost:${port}/uploads/${filename}`;
    return res.json({ url: publicUrl });
  } catch (error) {
    console.error('Error during image upload:', error);
    return res.status(500).json({ error: error.message || 'Upload failed.' });
  }
});

app.listen(port, () => {
  console.log(`OTP Server is running on http://localhost:${port}`);
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey === 'your_resend_api_key_here') {
    console.log(`Backend is starting in DEMO MODE (OTP codes print to console).`);
    console.log(`To send real emails, set a valid RESEND_API_KEY in the backend .env file.\n`);
  } else {
    console.log(`Backend is starting in EMAIL MODE (OTP emails will be sent using Resend).\n`);
  }
});
