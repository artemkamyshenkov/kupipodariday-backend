/* eslint-disable max-classes-per-file */
import { Expose, Type } from 'class-transformer';
import { WishResponseDto } from '../../wishes/dto/response-wish.dto';

export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  username: string;

  @Expose()
  about?: string;

  @Expose()
  avatar?: string;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;
}

export class UserResponseDtoWithWishes extends UserResponseDto {
  @Expose()
  @Type(() => WishResponseDto)
  wishes: WishResponseDto[];
}
