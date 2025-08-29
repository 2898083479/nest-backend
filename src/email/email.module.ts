import { join } from 'path';
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './email.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
    imports: [
        MailerModule.forRoot({
            transport: {
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: "ethanwang627@gmail.com",
                    pass: "yefj qkeo pmdn qsqj",
                },
                tls: {
                    rejectUnauthorized: false,
                },
            },
            defaults: {
                from: '"No Reply" <noreply@example.com>',
            },
            template: {
                dir: join(process.cwd(), 'src/templates/email'),
                adapter: new HandlebarsAdapter(),
                options: {
                    strict: true,
                },
            },
        })
    ],
    providers: [EmailService],
    exports: [EmailModule, EmailService]
})
export class EmailModule { };
