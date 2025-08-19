import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { randomBytes } from "crypto";
import { AuthService } from "./auth.service";
import { JwtInterceptor } from "src/interceptor/jwt.interceptor";
import { AuthController } from "./auth.controller";

@Module({
    providers: [AuthService],
    controllers: [AuthController]
})
export class AuthModule {}