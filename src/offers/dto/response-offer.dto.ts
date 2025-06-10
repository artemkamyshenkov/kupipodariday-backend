import { Expose, Type, Transform } from 'class-transformer';
import { UserResponseDtoWithWishes } from '../../users/dto/response-user.dto';
import { WishResponseDto } from '../../wishes/dto/response-wish.dto';

export class OfferResponseDto {
  @Expose()
  id: number;

  @Expose()
  @Transform(({ value }) => Number(value).toFixed(2))
  amount: number;

  @Expose()
  hidden: boolean;

  @Expose()
  @Type(() => UserResponseDtoWithWishes)
  user: UserResponseDtoWithWishes;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;

  @Expose()
  @Type(() => WishResponseDto)
  item: WishResponseDto;
}
