import { Injectable, Inject } from '@nestjs/common';
import { UserModel } from '@/schema/user/types';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '@/schema/user/model';
import { ObjectId } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel.name) private readonly userModel: Model<UserModel>
  ) { }

  async signup(user: User): Promise<UserModel> {
    const result = await this.userModel.create(user);
    if (!result) {
      return null;
    }
    return result;
  }

  async findOneById(id: string): Promise<UserModel> {
    const result = await this.userModel.findOne({"_id": id});
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

}
