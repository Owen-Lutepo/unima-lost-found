import { ExtractJwt, Strategy } from 'passport-jwt'; 
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'super_secret_key_unima_porters_2026', // Hardcoded key 
    });
  }

  async validate(payload: any) {
    // payload contain the sub (User ID) and email from the token
    if (!payload) {
      throw new UnauthorizedException();
    }
    return { userId: payload.sub, email: payload.email };
  }
}