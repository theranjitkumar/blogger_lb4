import {inject, injectable} from '@loopback/core';
import nodemailer from 'nodemailer';
import {ConfigService} from '../services';

@injectable()
export class EmailService {
  private transporter;

  constructor(
    @inject('services.ConfigService') private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_HOST, // Use your email service provider
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verificationLink = `${this.configService.getBaseUrl()}/verify-email?token=${token}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Email Verification',
      html: `<p>Please verify your email by clicking the link below:</p>
             <a href="${verificationLink}">Verify Email</a>`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}

