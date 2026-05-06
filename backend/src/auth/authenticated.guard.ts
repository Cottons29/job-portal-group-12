import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {Request} from 'express';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
    constructor(private jwtService: JwtService) {
    }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>();
        if (request.session?.userId) {
            request['user'] = {sub: request.session.userId};
            return true;
        }

        const authHeader = request.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('Not authenticated');
        }

        const token = authHeader.split(' ')[1];
        try {
            request['user'] = this.jwtService.verify(token, {
                secret: process.env.JWT_SECRET || 'fallback_secret',
            });
            return true;
        } catch (e) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}
