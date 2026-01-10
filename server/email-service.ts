import nodemailer from 'nodemailer';

// Function to get email configuration from environment variables
function getEmailConfig() {
  return {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER || 'at917920@gmail.com',
      pass: process.env.SMTP_PASS || 'your-app-password',
    },
  };
}

// Create transporter function that reads config dynamically
function createTransporter() {
  const config = getEmailConfig();
  console.log('📧 Creating email transporter with:', {
    host: config.host,
    port: config.port,
    user: config.auth.user,
    pass: config.auth.pass ? '***' + config.auth.pass.slice(-4) : 'NOT SET'
  });
  return nodemailer.createTransport(config);
}

// Create reusable transporter (recreated on each use to get fresh env vars)
let transporter = createTransporter();

// Email templates
const generateOTPEmailHTML = (otp: string, purpose: string) => {
  let purposeText = 'Verification';
  let purposeDescription = 'verification';

  switch (purpose) {
    case 'login':
      purposeText = 'Login';
      purposeDescription = 'login';
      break;
    case 'register':
      purposeText = 'Registration';
      purposeDescription = 'registration';
      break;
    case 'reset-password':
      purposeText = 'Password Reset';
      purposeDescription = 'password reset';
      break;
    case 'change-password':
      purposeText = 'Password Change';
      purposeDescription = 'changing your password';
      break;
    case 'feedback':
      purposeText = 'Rating Submission';
      purposeDescription = 'submitting your rating and feedback';
      break;
    default:
      purposeText = 'Verification';
      purposeDescription = 'verification';
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #16a34a 0%, #2563eb 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .otp-box { background: white; border: 2px dashed #16a34a; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
        .otp-code { font-size: 32px; font-weight: bold; color: #16a34a; letter-spacing: 8px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        .warning { background: #fef2f2; border-left: 4px solid #ef4444; padding: 12px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Digital Governance</h1>
          <p>Your ${purposeText} OTP</p>
        </div>
        <div class="content">
          <h2>Hello!</h2>
          <p>You requested a one-time password for ${purposeDescription}. Use the code below to proceed:</p>
          
          <div class="otp-box">
            <div class="otp-code">${otp}</div>
            <p style="margin-top: 10px; color: #666;">Valid for 10 minutes</p>
          </div>
          
          <div class="warning">
            <strong>⚠️ Security Notice:</strong> Never share this OTP with anyone. Our team will never ask for your OTP.
          </div>
          
          <p>If you didn't request this code, please ignore this email or contact support if you have concerns.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Digital Governance Platform. All rights reserved.</p>
          <p>This is an automated message, please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Send OTP via email
 */
export async function sendEmailOTP(email: string, otp: string, purpose: string): Promise<void> {
  // Recreate transporter to get fresh environment variables
  transporter = createTransporter();
  
  try {
    let subjectText = 'Verification Code';
    switch (purpose) {
      case 'login':
        subjectText = 'Login Verification Code';
        break;
      case 'register':
        subjectText = 'Registration Verification Code';
        break;
      case 'reset-password':
        subjectText = 'Password Reset Code';
        break;
      case 'change-password':
        subjectText = 'Password Change Verification Code';
        break;
      case 'feedback':
        subjectText = 'Rating Submission Verification Code';
        break;
    }

    const config = getEmailConfig();
    const mailOptions = {
      from: `"Digital Governance" <${config.auth.user}>`,
      to: email,
      subject: subjectText,
      html: generateOTPEmailHTML(otp, purpose),
      text: `Your OTP is: ${otp}. Valid for 10 minutes. Do not share this code with anyone.`,
    };

    console.log(`📧 Attempting to send OTP email for ${purpose} to: ${email}`);
    console.log(`📤 Sending from: ${config.auth.user}`);
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email OTP sent successfully to ${email} for ${purpose}`);
    // If using Ethereal (dev test account), log preview URL
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`🔎 Preview email at: ${previewUrl}`);
    }
  } catch (error: any) {
    console.error('❌ Failed to send email OTP:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    if (error.code === 'EAUTH') {
      console.error('🔐 Email authentication failed. Please check your SMTP credentials in the .env file.');
      console.error('💡 For Gmail, ensure you are using an App Password (not your regular password).');
      console.error('💡 Generate App Password at: https://myaccount.google.com/apppasswords');
      console.error('💡 Make sure 2-Step Verification is enabled on your Google account.');
    } else if (error.code === 'ECONNECTION') {
      console.error('🌐 Connection failed. Check your internet connection and SMTP settings.');
      console.error(`💡 Verify SMTP_HOST=${process.env.SMTP_HOST} and SMTP_PORT=${process.env.SMTP_PORT}`);
    } else if (error.code === 'EENVELOPE') {
      console.error('📧 Envelope error. Check FROM_EMAIL and recipient email address.');
    } else {
      console.error('🔍 Full error details:', JSON.stringify(error, null, 2));
    }
    // In development, log the OTP to console as fallback
    if (process.env.NODE_ENV !== 'production') {
      console.log(`🔑 DEV MODE - OTP for ${email}: ${otp}`);
    }
    throw new Error(`Failed to send email: ${error.message || 'Unknown error'}`);
  }
}

/**
 * Verify email configuration
 */
export async function verifyEmailConfig(): Promise<boolean> {
  // Recreate transporter to get fresh environment variables
  transporter = createTransporter();
  
  try {
    console.log('🔍 Verifying email configuration...');
    const config = getEmailConfig();
    
    // Check if required env vars are set
    if (!config.auth.user || config.auth.user === 'at917920@gmail.com' || config.auth.user.includes('@example.com')) {
      console.warn('⚠️  SMTP_USER not properly configured in .env file');
    }
    if (!config.auth.pass || config.auth.pass === 'your-app-password') {
      console.warn('⚠️  SMTP_PASS not properly configured in .env file');
      console.warn('💡 For Gmail, you need an App Password (not your regular password)');
    }
    
    await transporter.verify();
    console.log('✅ Email server is ready to send messages');
    console.log(`📧 SMTP configured: ${config.auth.user} via ${config.host}:${config.port}`);
    return true;
  } catch (error: any) {
    console.error('❌ Email server verification failed:', error.message || error);
    console.error('Error code:', error.code);
    
    if (error.code === 'EAUTH') {
      console.error('🔐 Authentication failed. Common issues:');
      console.error('   1. Wrong App Password (for Gmail, use App Password, not regular password)');
      console.error('   2. App Password might be expired or revoked');
      console.error('   3. 2-Step Verification not enabled on Google account');
      console.error('   4. SMTP_USER or SMTP_PASS incorrect in .env file');
      console.error('💡 Generate new App Password: https://myaccount.google.com/apppasswords');
    } else if (error.code === 'ECONNECTION') {
      console.error('🌐 Connection failed. Check:');
      console.error('   1. Internet connection');
      console.error('   2. SMTP_HOST and SMTP_PORT in .env file');
      console.error('   3. Firewall blocking port 587 or 465');
    } else {
      console.error('🔍 Full error:', JSON.stringify(error, null, 2));
    }

    // In development, automatically create an Ethereal test account as a safe fallback
    if (process.env.NODE_ENV !== 'production') {
      try {
        console.log('🔄 Creating Ethereal test account for local email testing...');
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
          host: testAccount.smtp.host,
          port: testAccount.smtp.port,
          secure: testAccount.smtp.secure,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
        console.log('✅ Ethereal test account created. Emails will be previewable via a URL in the console.');
        console.log('⚠️  Note: Using test account because SMTP configuration failed.');
        console.log('⚠️  To use real email, fix your SMTP credentials in .env and restart server.');
        return true;
      } catch (err: any) {
        console.error('❌ Failed to create Ethereal test account:', err.message || err);
      }
    }

    return false;
  }
}
