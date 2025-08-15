import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    UnauthorizedException
} from "@nestjs/common";
import { Observable } from "rxjs";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtInterceptor implements NestInterceptor {
    constructor(
        private readonly jwtService: JwtService
    ) {}

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        // 拿到requst的请求头
        const request = context.switchToHttp().getRequest();
        // 拿到请求头中的authorization
        const authHeader = request.headers['authorization'];
        // 如果没有携带authoriztion，则为未登录
        if (!authHeader) {
            throw new UnauthorizedException('缺少token');
        }
        // 解析Bearer token 拿到 token
        const token = authHeader.split('')[1]; // Bearer token

        try {
            const decoded = this.jwtService.verify(token);
            request.user = decoded; // 可以在控制器中直接进行使用
        } catch (err) {
            throw new UnauthorizedException('Token 无效或过期');
        }

        return next.handle();
    }
}