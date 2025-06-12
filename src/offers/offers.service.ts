import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

    if (parseFloat(String(wish.raised)) >= parseFloat(String(wish.price))) {
      throw new BadRequestException('На подарок уже собраны все деньги');
    }

    if (
      parseFloat(String(wish.raised)) + amount >
      parseFloat(String(wish.price))
    ) {
      throw new BadRequestException('Сумма превышает стоимость подарка');
    }

    const offer = this.offersRepository.create({
      amount,
      hidden,
      item: wish,
      user,
    });

    await this.wishService.addRaisedAmount(wish, amount);
    await this.offersRepository.save(offer);

    return {};
  }

  async findOne(id: string) {
    const offer = await this.offersRepository.findOne({
      where: {
        id: Number(id),
      },
      relations: ['user', 'user.wishes', 'item'],
    });
    if (!offer) {
      throw new NotFoundException('Предложение с таким id не найдено');
    }

    return offer;
  }

  async findAll(userId: string) {
    if (!userId) {
      throw new BadRequestException('Не передан id пользователя');
    }

    const offers = await this.offersRepository.find({
      where: {
        user: {
          id: Number(userId),
        },
      },
      relations: ['user', 'user.wishes', 'item', 'item.owner', 'item.offers'],
    });

    if (!offers?.length) {
      return [];
    }

    return offers;
  }
}
