import {
  IsString,
  MinLength,
  MaxLength,
  IsUrl,
  IsArray,
  IsInt,
  IsOptional,
} from 'class-validator';

export class UpdateWishlistDto {
  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'Название не может быть короче 1 символа' })
  @MaxLength(250, { message: 'Название не может быть длиннее 250 символов' })
  name: string;

  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'Изображение должно быть валидным URL' })
  image: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  itemsId: number[];
}
