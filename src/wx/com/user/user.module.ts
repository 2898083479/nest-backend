import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { UserController } from './user.controller';
import { AuthModule } from 'src/jwt/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel, UserSchema } from '@/schema/user/types';
import { RedisModule } from '@/redis/redis.module';
import { EmailModule } from '@/email/email.module';
import { KafkaModule } from '@/kafka/kafka.module';

@Module({
  imports: [
    EmailModule,
    AuthModule,
    RedisModule,
    KafkaModule,
    MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }])
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule { }
