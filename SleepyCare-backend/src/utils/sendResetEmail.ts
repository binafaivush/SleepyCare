import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);


export const sendResetPasswordEmail = async (to: string, token: string): Promise<void> => {
  // Validate email address
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
    throw new Error('Invalid email address');
  }

  // Create the reset password URL
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

  // Email content
  const html = `
    <h1>Password Reset</h1>
    <p>Click the link below to reset your password:</p>
    <a href="${resetUrl}">Reset Password</a>
    <p>If you did not request this, please ignore this email.</p>
  `;

  try {
    // Send the email
    const response = await resend.emails.send({
      from: 'sleepyCareApp<onboarding@resend.dev>', // Replace with your verified domain
      to,
      subject: 'Password Reset Request',
      html,
    });
    console.log('resend response:', response);
    console.log(`Password reset email sent to ${to}`);
  } catch (error) {
    console.error(`Failed to send password reset email to ${to}:`, error);
    throw new Error('Failed to send password reset email');
  }
};