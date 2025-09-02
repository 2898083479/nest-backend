import { Injectable, OnModuleInit } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { KafkaService } from '@/kafka/kafka.service';
import e from 'express';

@Injectable()
export class EmailService implements OnModuleInit {
  private readonly groupId = "email-service";

  constructor(
    private readonly mailerService: MailerService,
    private readonly kafkaService: KafkaService,
  ) { }

  async onModuleInit(): Promise<void> {
    const consumers = [
      {
        topic: "user-signup",
        handler: async (message) => {
          const value = typeof message.value === "string" ? JSON.parse(message.value) : message.value;
          const { email, name } = value;
          try {
            await this.sendWelcomeEmail(email, name);
            console.log("send welcome email successfully!");
          } catch (error) {
            console.error(
              "send email Failed:",
              error
            );
          }
        }
      },
      {
        topic: "reset-password",
        handler: async (message) => {
          const value = typeof message.value === "string" ? JSON.parse(message.value) : message.value;
          const { email, newPassword } = value;
          try {
            await this.sendResetSuccessEmail(email, newPassword);
          } catch (error) {
            console.error('send Email Failed: ', error);
          }
        }
      },
      {
        topic: "send-v-code",
        handler: async (message) => {
          const value = typeof message.value === "string" ? JSON.parse(message.value) : message.value;
          const { email, verificationCode } = value;
          try {
            await this.sendVerificationEmail(email, verificationCode);
          } catch (error) {
            console.log("send Failed: ", error);
          }
        }
      }
    ]
    // 创建消费者
    for (const consumer of consumers) {
      await this.kafkaService.createConsumer(this.groupId, consumer.topic, {
        groupId: this.groupId,
        fromBeginning: true,
      });

      await this.kafkaService.consume(this.groupId, consumer.topic, consumer.handler);
    }
  }

  // 1. 发送欢迎邮件
  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    Promise.resolve().then(async () => {
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
    })
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

  async sendResetSuccessEmail(email: string, newPassword: string): Promise<void> {
    Promise.resolve().then(async () => {
      try {
        await this.mailerService.sendMail({
          to: email,
          subject: '重置密码成功🏅',
          template: 'resetSuccess',
          context: {
            email,
          },
        });
        console.log('成功重置密码邮件发送成功');
      } catch (error) {
        console.error('发送失败：', error);
        throw error;
      }
    });
  }

  // 3. 发送验证邮件
  async sendVerificationEmail(email: string, verificationCode: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: '邮箱验证',
      template: 'verification',
      context: {
        code: verificationCode,
        expiryTime: '30分钟',
        currentYear: new Date().getFullYear(),
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