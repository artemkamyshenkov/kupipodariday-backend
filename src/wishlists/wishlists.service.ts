import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { User } from '../users/entities/user.entity';
import { Wishlist } from './entities/wishlist.entity';
import { WishesService } from '../wishes/wishes.service';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    private readonly wishService: WishesService,
  ) {}

  async create(createWishlistDto: CreateWishlistDto, owner: User) {
    if (!createWishlistDto.itemsId?.length) {
      throw new BadRequestException({
        message: 'В коллекции должен быть хотя бы один подарок',
      });
    }
    const wishes = await this.wishService.findWishesByIds(
      createWishlistDto.itemsId,
    );

    const wishlist = this.wishlistRepository.create({
      name: createWishlistDto.name,
      image: createWishlistDto.image,
      owner,
      items: wishes,
    });

    const saved = await this.wishlistRepository.save(wishlist);
    return saved;
  }

  async findAll(user: User) {
    const wishlists = await this.wishlistRepository.find({
      where: {
        owner: {
          id: user.id,
        },
      },
      relations: ['owner'],
    });

    return wishlists;
  }

  async remove(id: string, userId: string) {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id: Number(id) },
      relations: ['owner'],
    });

    if (!wishlist) {
      throw new NotFoundException(`Подарок с id ${id} не найден`);
    }

    if (Number(userId) !== wishlist.owner.id) {
      throw new ForbiddenException('Вы не можете удалить чужой вишлист');
    }
    await this.wishlistRepository.remove(wishlist);

    return wishlist;
  }
}
