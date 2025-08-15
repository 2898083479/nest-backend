import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { randomBytes } from "crypto";
import { AuthService } from "./auth.service";
import { JwtInterceptor } from "src/interceptor/jwt.interceptor";
import { AuthController } from "./auth.controller";

@Module({
    imports: [
        JwtModule.register({
            secret: randomBytes(64).toString('hex'), //密钥
            signOptions: { expiresIn: '1h' }, //1小时后过期
        })
    ],
    providers: [AuthService, JwtInterceptor],
    controllers: [AuthController]
})
export class AuthModule {}