
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { User } from 'types/customRequest';
import { jwtConstants } from './constant';

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(private jwtService : JwtService) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();

        if (req?.cookies?.token == null) {
            throw new UnauthorizedException("Anda Tidak Memiliki Akses")
        }
        try {

            const payload : User = this.jwtService.verify(req.cookies.token, {
                secret : jwtConstants.secret
            })


         
    
            if(payload.role != 99) {
                throw new UnauthorizedException("Anda Tidak Memiliki Akses")
            }
            (req as any).user = payload
            return true
        }catch(err) {
            throw new UnauthorizedException("Anda Tidak Memiliki Akses")
        }


    }
}