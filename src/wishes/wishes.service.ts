import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  async create(createWishDto: CreateWishDto, owner: User) {
    const wish = this.wishesRepository.create({
      ...createWishDto,
      owner,
    });

    const saved = await this.wishesRepository.save(wish);
    return saved;
  }

  async findOne(id: string) {
    const wish = await this.wishesRepository.findOne({
      where: {
        id: Number(id),
      },
      relations: ['owner', 'offers', 'offers.user'],
    });

    if (!wish) {
      throw new NotFoundException(`Подарка с id ${id} не найдено`);
    }

    return wish;
  }

  async remove(id: string, userId: string) {
    const wish = await this.wishesRepository.findOne({
      where: { id: Number(id) },
    });

    if (!wish) {
      throw new NotFoundException(`Подарок с id ${id} не найден`);
    }

    if (Number(userId) !== wish.owner.id) {
      throw new ForbiddenException('Вы не можете редактировать чужой подарок');
    }
    await this.wishesRepository.remove(wish);

    return wish;
  }

  /** 40 последних добавленных подарков */
  async findLastAddedWishes() {
    const wishes = await this.wishesRepository.find({
      order: {
        createdAt: 'DESC',
      },
      take: 40,
      relations: ['owner'],
    });

    return wishes;
  }

  /** 20 самых популярных подарков */
  async findMostPopularWishes() {
    const wishes = await this.wishesRepository.find({
      order: {
        copied: 'DESC',
      },
      take: 20,
      relations: ['owner'],
    });

    return wishes;
  }

  /** Скопировать чужой подарок */
  async copyWish(wishId: string, owner: User) {
    const originalWish = await this.findOne(wishId);
    originalWish.copied += 1;
    await this.wishesRepository.save(originalWish);

    const { name, description, image, link, price } = originalWish;

    const copiedWish = this.wishesRepository.create({
      name,
      description,
      image,
      link,
      price,
      raised: 0,
      owner,
      copied: 0,
    });

    const saved = await this.wishesRepository.save(copiedWish);
    return saved;
  }

  async updateWish(id: string, updateWishDto: UpdateWishDto, user: User) {
    const wish = await this.wishesRepository.findOne({
      where: { id: Number(id) },
      relations: ['owner'],
    });

    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }

    if (wish.owner.id !== user.id) {
      throw new ForbiddenException('Вы не можете редактировать чужой подарок');
    }

    if (wish.raised > 0) {
      throw new BadRequestException(
        'Нельзя редактировать подарок после начала сбора',
      );
    }

    Object.assign(wish, updateWishDto);

    const saved = await this.wishesRepository.save(wish);

    return saved;
  }

  async addRaisedAmount(wish: Wish, amount: number) {
    const currentRaised = parseFloat(wish.raised.toString());
    const newAmount = parseFloat(amount.toString());
    const updatedWish = {
      ...wish,
      raised: currentRaised + newAmount,
    };
    const saved = await this.wishesRepository.save(updatedWish);

    return saved;
  }
}
