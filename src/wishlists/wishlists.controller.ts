import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Delete,
  Param,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { JwtGuard } from '../auth/guards/jwt-auth.guard';
import { WishlistResponseDto } from './dto/response-wishlist.dto';
import { Serialize } from '../decorators/serialize.decorator';

@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Serialize(WishlistResponseDto)
  @UseGuards(JwtGuard)
  @Post()
  create(@Request() req, @Body() createWishlistDto: CreateWishlistDto) {
    return this.wishlistsService.create(createWishlistDto, req.user);
  }

  @Serialize(WishlistResponseDto)
  @UseGuards(JwtGuard)
  @Get()
  findAll(@Request() req) {
    const wishlists = this.wishlistsService.findAll(req.user);

    return wishlists;
  }

  @Serialize(WishlistResponseDto)
  @UseGuards(JwtGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    const wishlist = await this.wishlistsService.remove(id, req.user?.id);

    return wishlist;
  }
}
