import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  // 1. 发送欢迎邮件
  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: '欢迎加入我们！🎉',
        template: 'welcome', // 对应 templates/email/welcome.hbs
        context: {
          name,
          signupDate: new Date().toLocaleDateString('zh-CN'),
          currentYear: new Date().getFullYear(),
        },
      });
      console.log('欢迎邮件发送成功');
    } catch (error) {
      console.error('发送欢迎邮件失败:', error);
      throw error;
    }
  }

  // 2. 发送密码重置邮件
  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    const resetLink = `https://yourdomain.com/reset-password?token=${resetToken}`;
    
    await this.mailerService.sendMail({
      to: email,
      subject: '重置您的密码',
      html: `
        <h2>密码重置请求</h2>
        <p>请点击下面的链接重置您的密码：</p>
        <a href="${resetLink}" style="color: #007bff;">重置密码</a>
        <p>链接24小时内有效</p>
      `,
    });
  }

  // 3. 发送验证邮件
  async sendVerificationEmail(email: string, verificationCode: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: '邮箱验证',
      template: './verification',
      context: {
        code: verificationCode,
        expiryTime: '30分钟',
      },
    });
  }

  // 4. 发送纯文本邮件
  async sendPlainTextEmail(to: string, subject: string, text: string): Promise<void> {
    await this.mailerService.sendMail({
      to,
      subject,
      text, // 纯文本内容
    });
  }

  // 5. 发送带附件的邮件
  async sendEmailWithAttachment(
    to: string, 
    subject: string, 
    html: string, 
    attachments: any[]
  ): Promise<void> {
    await this.mailerService.sendMail({
      to,
      subject,
      html,
      attachments,
    });
  }
}