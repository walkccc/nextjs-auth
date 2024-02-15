import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmailVerificationEmail = async (
  email: string,
  token: string,
) => {
  const link = `http://localhost:3000/auth/verify-email?token=${token}`;
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Verify your email',
    html: `<p>Click <a href="${link}">here</a> to verify your email.</p>`,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const link = `http://localhost:3000/auth/reset-password?token=${token}`;
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Reset your password',
    html: `<p>Click <a href="${link}">here</a> to reset your password.</p>`,
  });
};

export const sendTwoFactorCodeEmail = async (email: string, code: string) => {
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: '2FA Code',
    html: `<p>Your 2FA code: ${code}</p>`,
  });
};
