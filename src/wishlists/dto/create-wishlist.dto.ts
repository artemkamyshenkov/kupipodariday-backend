import {
  IsString,
  MinLength,
  MaxLength,
  IsUrl,
  IsArray,
  IsInt,
} from 'class-validator';

export class CreateWishlistDto {
  @IsString()
  @MinLength(1, { message: 'Название не может быть короче 1 символа' })
  @MaxLength(250, { message: 'Название не может быть длиннее 250 символов' })
  name: string;

  @IsString()
  @IsUrl({}, { message: 'Изображение должно быть валидным URL' })
  image: string;

  @IsArray()
  @IsInt({ each: true })
  itemsId: number[];
}
