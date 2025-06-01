import { PartialType } from '@nestjs/swagger';
import { IsString, Length, IsUrl, IsEmail } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

// Добавить user response
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @Length(2, 30)
  username: string;

  @IsString()
  @Length(2, 200)
  about?: string;

  @IsUrl()
  avatar?: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
