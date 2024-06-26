import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class MailService {
  constructor() {
    sgMail.setApiKey(process.env.SEND_GRID_KEY);
  }

  async sendEmail(req): Promise<void> {
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
          <body style="font-family: Arial, sans-serif; color: #000;">
              <h2 style="font-family: Arial, sans-serif; color: #000;" >Hello,</h2>
              <p style="color: #000;">${req.body.msg}</p>
              <p style="font-family: Arial, sans-serif; color: #000;">Best regards,<br>
              Beyond Abundance Team</p>
          </body>
      </html>
    `;
    const msg = {
      to: req.body.email,
      from: {
        email: process.env.SEND_GRID_EMAIL,
        name: process.env.SEND_GRID_EMAIL_NAME,
      },
      subject: req.body.subject,
      html: htmlContent,
    };

    try {
      await sgMail.send(msg);
    } catch (err) {
      console.error("Email not sent", err);
    }
  }
}
