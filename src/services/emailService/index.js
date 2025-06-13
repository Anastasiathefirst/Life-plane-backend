import nodemailer from 'nodemailer';
import logger from '~/config/logger';
import template from './template';
import config from '~/config/config';

export const transport = nodemailer.createTransport({
  host: config.SMTP_HOST,
  port: Number(config.SMTP_PORT),
  secure: config.SMTP_SECURE === 'true',
  auth: {
    user: config.SMTP_USERNAME,
    pass: config.SMTP_PASSWORD,
  },
});

if (config.NODE_ENV !== 'test') {
  transport
    .verify()
    .then(() => logger.info('📬 Connected to email server'))
    .catch((err) => logger.warn('❌ Unable to connect to email server:', err));
}

export const sendEmail = async (to, subject, html) => {
  const msg = {
    from: `${config.APP_NAME} <${config.EMAIL_FROM}>`,
    to,
    subject,
    html,
  };
  console.log('➡️ Sending email:', { to, subject });
  try {
    const info = await transport.sendMail(msg);
    console.log('✅ Email sent:', info.messageId);
    return info;
  } catch (err) {
    logger.error('❌ Failed to send email:', err);
    throw err;
  }
};

export const sendVerificationEmail = async (to, token) => {
  console.log('➡️ sendVerificationEmail token:', token);
  const subject = 'Код подтверждения email';
  const html = template.verifyEmail(token, config.APP_NAME);
  return sendEmail(to, subject, html);
};

export const sendResetPasswordEmail = async (to, token) => {
  console.log('➡️ sendResetPasswordEmail token:', token);
  const subject = 'Reset password';
  const resetPasswordUrl = `${config.FRONTEND_URL}/reset-password?token=${token}`;
  const html = template.resetPassword(resetPasswordUrl, config.APP_NAME);
  return sendEmail(to, subject, html);
};

export default {
  sendEmail,
  sendVerificationEmail,
  sendResetPasswordEmail,
};
