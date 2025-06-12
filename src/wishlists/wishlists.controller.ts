import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Delete,
  Param,
  Patch,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { JwtGuard } from '../auth/guards/jwt-auth.guard';
import { WishlistResponseDto } from './dto/response-wishlist.dto';
import { Serialize } from '../decorators/serialize.decorator';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Serialize(WishlistResponseDto)
  @UseGuards(JwtGuard)
  @Get()
  async findAll(@Request() req) {
    const wishlists = await this.wishlistsService.findAll(req.user);
    return wishlists;
  }

  @Serialize(WishlistResponseDto)
  @UseGuards(JwtGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const wishlists = await this.wishlistsService.findOne(id);
    return wishlists;
  }

  @Serialize(WishlistResponseDto)
  @UseGuards(JwtGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    const wishlist = await this.wishlistsService.remove(id, req.user?.id);
    return wishlist;
  }

  @Serialize(WishlistResponseDto)
  @UseGuards(JwtGuard)
  @Post()
  async create(@Request() req, @Body() createWishlistDto: CreateWishlistDto) {
    const wishlist = await this.wishlistsService.create(
      createWishlistDto,
      req.user,
    );
    return wishlist;
  }

  @Serialize(WishlistResponseDto)
  @UseGuards(JwtGuard)
  @Patch(':id')
  async update(
    @Request() req,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @Param('id') id: string,
  ) {
    const wishlist = await this.wishlistsService.updateWishlist(
      id,
      req?.user,
      updateWishlistDto,
    );
    return wishlist;
  }
}
