
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator<{
    username: string,
    id: number,
    role: number
}>(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user as {
            username: string,
            id: number,
            role: number
        };
    },
);

export type User = {
    username: string,
    id: number,
    role: number
}