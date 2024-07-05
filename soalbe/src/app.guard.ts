
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { User } from 'types/customRequest';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService : JwtService) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();

        if (req?.cookies?.token == null) {
            throw new UnauthorizedException("Anda Tidak Memiliki Akses")
        }
        
        try {
            const payload : User = this.jwtService.verify(req.cookies.token);
            (req as any).user = payload
            
        }catch(err) {
            throw new UnauthorizedException("Anda Tidak Memiliki Akses")

        }
            

        return true
    }
}