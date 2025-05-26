import nodemailer from 'nodemailer';
import { Resend } from 'resend';

// Initialize Resend for email notifications
const resend = new Resend(process.env.RESEND_API_KEY);

// Email transporter configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export interface NotificationData {
  userId: string;
  type: 'ORDER' | 'SHIPPING' | 'PAYMENT' | 'CUSTOM_JERSEY' | 'SYSTEM';
  title: string;
  message: string;
  link?: string;
  metadata?: Record<string, any>;
}

export class NotificationService {
  // Send in-app notification
  static async sendInAppNotification(data: NotificationData) {
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to send in-app notification');
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending in-app notification:', error);
      throw error;
    }
  }

  // Send email notification
  static async sendEmailNotification(data: NotificationData) {
    try {
      const { userId, type, title, message, link } = data;

      // Get user email from database
      const userResponse = await fetch(`/api/users/${userId}`);
      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data');
      }
      const user = await userResponse.json();

      // Prepare email content
      const emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a365d;">${title}</h2>
          <p style="color: #4a5568;">${message}</p>
          ${link ? `<a href="${link}" style="display: inline-block; padding: 10px 20px; background-color: #2c5282; color: white; text-decoration: none; border-radius: 5px;">View Details</a>` : ''}
          <p style="color: #718096; font-size: 12px; margin-top: 20px;">
            This is an automated message from XSpot. Please do not reply to this email.
          </p>
        </div>
      `;

      // Send email using Resend
      await resend.emails.send({
        from: 'XSpot <notifications@xspot.com>',
        to: user.email,
        subject: title,
        html: emailContent,
      });

      return { success: true };
    } catch (error) {
      console.error('Error sending email notification:', error);
      throw error;
    }
  }

  // Send notification to all admins
  static async notifyAdmins(data: Omit<NotificationData, 'userId'>) {
    try {
      // Get all admin users
      const response = await fetch('/api/users/admins');
      if (!response.ok) {
        throw new Error('Failed to fetch admin users');
      }
      const admins = await response.json();

      // Send notifications to each admin
      const notifications = await Promise.all(
        admins.map((admin: { id: string; email: string }) =>
          this.sendInAppNotification({
            ...data,
            userId: admin.id,
          })
        )
      );

      // Send email notifications to admins
      const emailNotifications = await Promise.all(
        admins.map((admin: { id: string; email: string }) =>
          this.sendEmailNotification({
            ...data,
            userId: admin.id,
          })
        )
      );

      return { notifications, emailNotifications };
    } catch (error) {
      console.error('Error notifying admins:', error);
      throw error;
    }
  }

  // Send notification to specific user
  static async notifyUser(data: NotificationData) {
    try {
      const [inAppNotification, emailNotification] = await Promise.all([
        this.sendInAppNotification(data),
        this.sendEmailNotification(data),
      ]);

      return { inAppNotification, emailNotification };
    } catch (error) {
      console.error('Error notifying user:', error);
      throw error;
    }
  }
} 