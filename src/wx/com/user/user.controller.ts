import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  Inject,
  Body,
  Param,
  Query
} from '@nestjs/common';
import { UserService } from './service/user.service';
import { JwtInterceptor } from 'src/interceptor/jwt.interceptor';
import { handleFailed, handleSuccess } from '@/common/response-code';
import { UserModel } from '@/schema/user/types';

@Controller('user')
export class UserController {

  @Inject(UserService)
  private readonly userService: UserService;

  @Post("signup")
  async signup(@Body() user: UserModel) {
    const userResult = await this.userService.findUserByEmail(user.email);
    if (userResult) {
      return handleFailed("The User Email existed!");
    }
    const result = await this.userService.signup(user);
    if (!result) {
      return handleFailed("Registry Failed!");
    }
    return handleSuccess(
      "Registry Success",
      {
        id: result._id,
        email: result.email
      }
    )
  }

  @Get("one")
  @UseInterceptors(JwtInterceptor)
  async findOneById(@Query('userId') userId: string) {
    const user = await this.userService.findOneById(userId);
    if (!user) {
      return handleFailed();
    }
    return handleSuccess(undefined, user);
  }
}
