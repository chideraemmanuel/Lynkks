import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  service: 'GMAIL',
  port: 587,
  secure: true,
  auth: {
    user: process.env.EMAIL_AUTH_USER,
    pass: process.env.EMAIL_AUTH_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log('[NODEMAILER_CONFIG_ERROR]', error);
  } else {
    console.log('[NODEMAILER_CONFIG_SUCCESS]', success);
  }
});
