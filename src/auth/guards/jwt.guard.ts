import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { User } from './../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.TOKEN_SECRETE,
      });
      request['user'] = payload;
      const user = await this.usersRepository.findOne({
        where: {
          id: payload.id,
        },
      });

      if (!user) {
        throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
      }

      if (!user.isActive)
        throw new HttpException('User is blocked', HttpStatus.FORBIDDEN);

      if (user.passwordChangedAt) {
        const stamps = new Date(user.passwordChangedAt).getTime() / 1000;
        if (stamps > payload.iat) {
          throw new HttpException(
            'User password changed, login again',
            HttpStatus.BAD_REQUEST,
          );
        }
      }
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
