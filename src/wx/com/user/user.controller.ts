import { Controller, Get, UseInterceptors, Inject } from '@nestjs/common';
import { UserService } from './service/user.service';
import { JwtInterceptor } from 'src/interceptor/jwt.interceptor';

@Controller('user')
@UseInterceptors(JwtInterceptor)
export class UserController {
  
  @Inject(UserService)
  private readonly userService: UserService;

  @Get()
  findAll(): string {
    return 'hello world';
  }
}
