import { Expose, Type, Transform } from 'class-transformer';
import { UserResponseDto } from '../../users/dto/response-user.dto';
import { OfferResponseDto } from '../../offers/dto/response-offer.dto';

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
  @Transform(({ value }) => Number(value).toFixed(2))
  raised: number;

  @Expose()
  description: string;

  @Expose()
  copied: number;

  @Expose()
  @Type(() => UserResponseDto)
  owner: UserResponseDto;

  @Expose()
  @Type(() => OfferResponseDto)
  offers: OfferResponseDto[];

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;
}
