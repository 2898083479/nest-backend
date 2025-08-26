import { Injectable } from '@nestjs/common';
import { UserModel } from '@/schema/user/types';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '@/schema/user/model';
import { RedisService } from '@/redis/redis.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel.name) private readonly userModel: Model<UserModel>,
    private readonly redisService: RedisService
  ) { }

  async signup(user: User): Promise<UserModel> {
    const result = await this.userModel.create(user);
    if (!result) {
      return null;
    }
    return result;
  }

  async findOneById(id: string): Promise<UserModel> {
    const result = await this.userModel.findOne({ "_id": id });
    if (!result) {
      return null;
    }
    return result;
  }

  async findUserByEmail(email: string): Promise<UserModel> {
    const user = await this.userModel.findOne({ email: email });
    if (!user) return null;
    return user;
  }

  async findAll(): Promise<UserModel[]> {
    const memoUserList = await this.redisService.get("user-list");
    if (!memoUserList) {
      const userList = await this.userModel.find();
      if (userList.length === 0) return [];
      await this.redisService.set("user-list", JSON.stringify(userList));
      return userList;
    }
    return JSON.parse(memoUserList);
  }

}
