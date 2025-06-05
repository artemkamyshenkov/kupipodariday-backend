import { Expose, Type } from 'class-transformer';
import { UserResponseDto } from '../../users/dto/response-user.dto';
import { WishResponseDto } from '../../wishes/dto/response-wish.dto';

export class WishlistResponseDto {
  @Expose()
  id: number;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;

  @Expose()
  name: string;

  @Expose()
  image: string;

  @Expose()
  link: string;

  @Expose()
  @Type(() => UserResponseDto)
  owner: UserResponseDto;

  @Expose()
  @Type(() => WishResponseDto)
  items: WishResponseDto;
}
