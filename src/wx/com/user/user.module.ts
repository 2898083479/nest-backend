import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/user';
import { UserService } from './service/user.service';
import { UserController } from './user.controller';
import { AuthModule } from 'src/jwt/auth.module';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel, UserSchema } from '@/schema/user/types';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }])
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule { }
