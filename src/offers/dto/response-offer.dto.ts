import { Expose, Type, Transform } from 'class-transformer';
import { UserResponseDto } from '../../users/dto/response-user.dto';

export class OfferResponseDto {
  @Expose()
  id: number;

  @Expose()
  @Transform(({ value }) => Number(value).toFixed(2))
  amount: number;

  @Expose()
  hidden: boolean;

  @Expose()
  @Type(() => UserResponseDto)
  user: UserResponseDto;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;
}
