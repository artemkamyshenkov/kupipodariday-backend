import { Expose, Type } from 'class-transformer';
import { UserResponseDto } from '../../users/dto/response-user.dto';

export class WishResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  link: string;

  @Expose()
  image: string;

  @Expose()
  price: number;

  @Expose()
  raised: number;

  @Expose()
  description: string;

  @Expose()
  copied: number;

  @Expose()
  @Type(() => UserResponseDto)
  owner: UserResponseDto;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;
}
