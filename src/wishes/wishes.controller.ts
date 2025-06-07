import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  Patch,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { JwtGuard } from '../auth/guards/jwt-auth.guard';
import { WishResponseDto } from './dto/response-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Get('top')
  async findMostPopularWished() {
    const wish = await this.wishesService.findMostPopularWishes();

    return plainToInstance(WishResponseDto, wish, {
      excludeExtraneousValues: true,
    });
  }

  @Get('last')
  async findLastAddedWished() {
    const wish = await this.wishesService.findLastAddedWishes();

    return plainToInstance(WishResponseDto, wish, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(JwtGuard)
  @Post()
  create(@Body() createWishDto: CreateWishDto, @Request() req) {
    return this.wishesService.create(createWishDto, req.user);
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  async copy(@Param() param: { id: string }, @Request() req) {
    const wish = await this.wishesService.copyWish(param.id, req.user);

    return plainToInstance(WishResponseDto, wish, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const wish = await this.wishesService.findOne(id);

    return plainToInstance(WishResponseDto, wish, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.wishesService.remove(id, req.user.id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    const wish = await this.wishesService.updateWish(
      id,
      updateWishDto,
      req.user,
    );

    return wish;
  }
}
