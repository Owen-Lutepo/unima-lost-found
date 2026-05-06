import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, pass: string) {
    // Fetch user from database
    const user = await this.usersService.findByEmail(email);

    // Check if user exists and password is correct
    if (!user || !(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Check if they verified their email
    if (!user.isVerified) {
      throw new UnauthorizedException('Please verify your email first');
    }

    // Generate the JWT
    const payload = { sub: user.id, email: user.email };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone
      }
    };
  }
}