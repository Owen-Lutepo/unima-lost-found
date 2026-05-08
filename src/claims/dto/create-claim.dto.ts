import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateClaimDto {
  @IsNotEmpty({ message: 'A phone number is required to claim an item' })
  @IsString()
  @MinLength(10, { message: 'Please enter a valid phone number' })
  phone: string;
}