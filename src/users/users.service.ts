import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { MailerService } from '@nestjs-modules/mailer'; 
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    private readonly mailerService: MailerService, 
  ) {}

  async register(dto: CreateUserDto) {
    const existing = await this.usersRepo.findOne({ where: { email: dto.email } });
    if (existing) throw new BadRequestException('Email already registered');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const user = this.usersRepo.create({
      ...dto,
      password: hashedPassword,
      verificationCode: code,
      isVerified: false, 
    });

    await this.usersRepo.save(user);

    console.log(`DEBUG: Attempting to send email to: ${user.email}`);

    try {
      await this.mailerService.sendMail({
        from: '"Unima Found" <ceej6478@gmail.com>', 
        to: user.email,
        subject: 'UNIMA Found - Verification Code',
        html: `<p>Your verification code is: <b>${code}</b></p>`,
      });
    } catch (error) {
      console.error('Email sending failed:', error);
    }

    return { 
      message: 'Account created. Please check your email for the verification code.',
      email: user.email 
    };
  }

  async verify(dto: VerifyCodeDto) {
    const user = await this.usersRepo.findOne({ where: { email: dto.email } });
    
    if (!user) throw new NotFoundException('User not found');
    
    // Check code (using a fallback empty string if verificationCode is null)
    if (user.verificationCode !== dto.code) {
        throw new BadRequestException('Invalid code');
    }

    user.isVerified = true;
    user.verificationCode = null; 
    await this.usersRepo.save(user);

    return { message: 'Account verified successfully. You can now log in.' };
  }

  // UPDATED SIGNATURE: Using 'null' instead of 'undefined'
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepo.findOne({ 
      where: { email },
      select: ['id', 'email', 'password', 'phone', 'isVerified'] 
    });
  }
}