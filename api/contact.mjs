import nodemailer from 'nodemailer';
import { createContactHandler } from '../server/contact-handler.mjs';

export default createContactHandler({
  getConfig: () => ({
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASS,
    siteUrl: process.env.CONTACT_SITE_URL,
  }),
  getTransport: config => nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user: config.user, pass: config.password },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 10000,
    disableFileAccess: true,
    disableUrlAccess: true,
  }),
});
