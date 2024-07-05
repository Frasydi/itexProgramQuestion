import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleWare implements NestMiddleware {
    constructor(private jwtSrvice: JwtService) {

    }
    use(req: Request, res: Response, next: NextFunction) {

        if(req?.cookies?.token == null) {
            throw new UnauthorizedException("Anda Tidak Memiliki Akses")
        }
        const payload = this.jwtSrvice.verify(req.cookies.token)
        if(payload == null) {
            throw new UnauthorizedException("Anda Tidak Memiliki Akses")
        }
        (req as any).user = payload
        next();
    }
}
