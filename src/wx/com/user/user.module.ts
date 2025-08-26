import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { UserController } from './user.controller';
import { AuthModule } from 'src/jwt/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel, UserSchema } from '@/schema/user/types';
import { RedisModule } from '@/redis/redis.module';

@Module({
  imports: [
    AuthModule,
    RedisModule,
    MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }])
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule { }
