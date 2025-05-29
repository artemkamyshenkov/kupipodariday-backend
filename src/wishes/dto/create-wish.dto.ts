import {
  IsString,
  MinLength,
  MaxLength,
  IsUrl,
  IsNumber,
  IsNotEmpty,
  IsArray,
  IsOptional,
  IsInt,
} from 'class-validator';
import { CreateUserDto } from '../../users/dto/create-user.dto';

export class CreateWishDto {
  @IsString()
  @MinLength(1, { message: 'Название не может быть короче 1 символа' })
  @MaxLength(250, { message: 'Название не может быть длиннее 250 символов' })
  name: string;

  @IsString()
  @IsUrl({}, { message: 'Ссылка должна быть валидным URL' })
  link: string;

  @IsString()
  @IsUrl({}, { message: 'Изображение должно быть валидным URL' })
  image: string;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Цена должна быть числом с максимум 2 знаками после запятой' },
  )
  price: number;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'Сумма сбора должна быть числом с максимум 2 знаками после запятой',
    },
  )
  raised: number;

  @IsNotEmpty()
  owner: CreateUserDto[];

  @IsString()
  @MinLength(1, { message: 'Описание не может быть пустым' })
  @MaxLength(1024, { message: 'Описание не может быть длиннее 1024 символов' })
  description: string;

  @IsArray()
  @IsOptional()
  offers?: any;

  @IsInt()
  copied: number;
}
