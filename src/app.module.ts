import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CatModule } from './wx/com/cat/cat.module';
import { DogModule } from './wx/com/dog/dog.module';
import { UserModule } from './wx/com/user/user.module';
import { NestModule } from '@nestjs/common';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { randomBytes } from 'crypto';

@Module({
  imports: [
    JwtModule.register({
      secret: randomBytes(64).toString('hex'), //密钥
      signOptions: { expiresIn: '1h' }, //1小时后过期
    }),
    CatModule,
    DogModule,
    UserModule,
    MongooseModule.forRoot('mongodb://localhost:27017', {
      dbName: 'test',
    }), // 连接mongodb
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('cats');
  }
}
