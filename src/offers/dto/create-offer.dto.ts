import { IsBoolean, IsNumber, IsPositive } from 'class-validator';

export class CreateOfferDto {
  @IsNumber()
  @IsPositive({ message: 'Сумма должна быть положительной' })
  amount: number;

  @IsBoolean()
  hidden: boolean;

  @IsNumber()
  itemId: number;
}
