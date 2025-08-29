import { join } from 'path';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CatModule } from './wx/com/cat/cat.module';
import { DogModule } from './wx/com/dog/dog.module';
import { UserModule } from './wx/com/user/user.module';
import { NestModule } from '@nestjs/common';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './jwt/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
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
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY, //密钥
      signOptions: { expiresIn: process.env.JWT_SECRET_KEY_EXPIRESIN }, //1小时后过期
    }),
    AuthModule,
    CatModule,
    DogModule,
    UserModule,
    MongooseModule.forRoot(`${process.env.MONGODB_URL}/${process.env.MONGODB_DB_NAME}`), // 连接mongodb
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('cats');
  }
}
