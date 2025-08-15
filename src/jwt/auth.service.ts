import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

//token的组成体
export interface UserPayload {
    userId: number;
    email: string;
}

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService
    ) { }

    //生成token
    generateToken(user: UserPayload): string {
        return this.jwtService.sign(user);
    }

    //验证token
    verifyToken(token: string): UserPayload | null {
        try {
            return this.jwtService.verify<UserPayload>(token);
        } catch (err) {
            return null;
        }
    }
}