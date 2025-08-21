import { Module } from "@nestjs/common";
import { JwtInterceptor } from "./jwt.interceptor";

@Module({
    providers: [JwtInterceptor],
})
export class JwtModule {}