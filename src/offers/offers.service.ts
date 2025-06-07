import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';
import { User } from '../users/entities/user.entity';
import { WishesService } from '../wishes/wishes.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
    private readonly wishService: WishesService,
  ) {}

  async create(createOfferDto: CreateOfferDto, user: User) {
    const { itemId, amount, hidden } = createOfferDto;

    const wish = await this.wishService.findOne(String(itemId));

    if (wish.owner.id === user.id) {
      throw new BadRequestException('Нельзя скинуться на свой подарок');
    }

    if (wish.raised >= wish.price) {
      throw new BadRequestException('На подарок уже собраны все деньги');
    }

    if (wish.raised + amount > wish.price) {
      throw new BadRequestException('Сумма превышает стоимость подарка');
    }

    const offer = this.offersRepository.create({
      amount,
      hidden,
      item: wish,
      user,
    });

    await this.wishService.addRaisedAmount(wish, amount);
    const savedOffer = await this.offersRepository.save(offer);

    return savedOffer;
  }

  findAll() {
    return `This action returns all offers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} offer`;
  }
}
