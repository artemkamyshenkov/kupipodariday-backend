import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { User } from '../users/entities/user.entity';
import { Wishlist } from './entities/wishlist.entity';
import { Wish } from '../wishes/entities/wish.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  async create(createWishlistDto: CreateWishlistDto, owner: User) {
    if (!createWishlistDto.itemsId?.length) {
      throw new BadRequestException({
        message: 'В коллекции должен быть хотя бы один подарок',
      });
    }
    const wishes = await this.wishesRepository.find({
      where: {
        id: In(createWishlistDto.itemsId),
      },
    });

    const { itemsId, ...restWishlistData } = createWishlistDto;
    const wishlist = this.wishlistRepository.create({
      ...restWishlistData,
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

  findOne(id: number) {
    return `This action returns a #${id} wishlist`;
  }

  update(id: number, updateWishlistDto: UpdateWishlistDto) {
    return `This action updates a #${id} wishlist`;
  }

  remove(id: number) {
    return `This action removes a #${id} wishlist`;
  }
}
