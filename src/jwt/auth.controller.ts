import { Controller, Post, Body, Get, Headers, UnauthorizedException } from '@nestjs/common';
import { AuthService, UserPayload } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @Post('login')
    login(@Body() body: UserPayload) {
        const { userId, email } = body;
        const token = this.authService.generateToken({ userId, email });
        return token;
    }
}