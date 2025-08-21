import { Controller, Post, Body, Get, Headers, UnauthorizedException } from '@nestjs/common';
import { AuthService, UserPayload } from './auth.service';
import { Response } from 'src/common';
import { getResponseMessage, ResponseCode } from 'src/common/response-code';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) { }

    @Post('login')
    login(@Body() body: UserPayload) {
        const { email, password } = body;
        const token = this.authService.generateToken({ email, password });
        return new Response(
            '000',
            ResponseCode.OPERATING_SUCCESSFULLY,
            getResponseMessage(ResponseCode.OPERATING_SUCCESSFULLY),
            { 
                email: email,
                token: token
            },
        )
    }
}