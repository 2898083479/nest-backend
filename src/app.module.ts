import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CatModule } from './wx/com/cat/cat.module';
import { DogModule } from './wx/com/dog/dog.module';
import { UserModule } from './wx/com/user/user.module';
import { NestModule } from '@nestjs/common';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './jwt/auth.module';

@Module({
  imports: [
    JwtModule.register({
      secret: 'ethanwong666', //密钥
      signOptions: { expiresIn: '1h' }, //1小时后过期
    }),
    AuthModule,
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
