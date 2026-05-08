import { IsNotEmpty, IsString, IsIn, MinLength, IsOptional } from 'class-validator';

export class CreateItemDto {
  @IsNotEmpty({ message: 'Title is required for identification' })
  @IsString()
  @MinLength(3)
  title: string;

  @IsNotEmpty({ message: 'Please describe the item to help the owner' })
  @IsString()
  @MinLength(10)
  description: string;

  @IsNotEmpty({ message: 'Category is mandatory' })
  @IsString()
  // Matches your api/categories logic exactly
  @IsIn(['Bags&Wallets', 'IDs', 'Keys', 'Gadgets', 'Others'], {
    message: 'Category must be one of: Bags&Wallets, IDs, Keys, Gadgets, or Others',
  })
  category: string;

  @IsNotEmpty({ message: 'A Base64 image string is required' })
  @IsString()
  image: string;

  // We make this optional in the DTO because the Entity defaults it to 'available'
  // But having it here allows you to manually override it if needed for testing
  @IsOptional()
  @IsString()
  @IsIn(['available', 'claimed'])
  status?: string;
}