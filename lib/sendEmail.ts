import { transporter } from '@/config/nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

interface MailOptions {
  receipent: string;
  subject: string;
  html: string;
}

const sendEmail = async ({ receipent, subject, html }: MailOptions) => {
  const mailOptions = {
    from: process.env.EMAIL_AUTH_USER!,
    to: receipent,
    subject,
    html,
  };

  return new Promise<SMTPTransport.SentMessageInfo>((resolve, reject) => {
    transporter.sendMail(mailOptions, (error: any, info) => {
      if (error) {
        reject(error);
      }

      resolve(info);
    });
  });
};

export default sendEmail;
