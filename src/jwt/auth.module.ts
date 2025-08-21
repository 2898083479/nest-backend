import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { randomBytes } from "crypto";

@Module({
    imports: [
        JwtModule.register({
            secret: 'ethanwong666', //密钥
            signOptions: { expiresIn: '1h' }, //1小时后过期
        }),
    ],
    providers: [AuthService],
    controllers: [AuthController],
    exports: [
        AuthService, JwtModule
    ]
})
export class AuthModule { }