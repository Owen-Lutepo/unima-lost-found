import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.register(createUserDto);
  }

  @Post('verify')
  async verify(@Body() verifyCodeDto: VerifyCodeDto) {
    return this.usersService.verify(verifyCodeDto);
  }
}