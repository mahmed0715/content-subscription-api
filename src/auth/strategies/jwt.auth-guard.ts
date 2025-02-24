import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (!authHeader) return false;

    try {
      const token = authHeader.split(' ')[1];
      console.log(token);
      request.user = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      return true;
    } catch {
      return false;
    }
  }
}
