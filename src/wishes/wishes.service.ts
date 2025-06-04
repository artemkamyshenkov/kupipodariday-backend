import { Injectable, NotFoundException } from '@nestjs/common';
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

  findAll() {
    return `This action returns all wishes`;
  }

  async findOne(id: string) {
    const wish = await this.wishesRepository.findOne({
      where: {
        id: Number(id),
      },
      relations: ['owner'],
    });

    if (!wish) {
      throw new NotFoundException(`Подарка с id ${id} не найдено`);
    }

    return wish;
  }

  update(id: number, updateWishDto: UpdateWishDto) {
    return `This action updates a #${id} wish`;
  }

  remove(id: number) {
    return `This action removes a #${id} wish`;
  }
}
