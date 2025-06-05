import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtGuard } from '../auth/guards/jwt-auth.guard';
import { WishResponseDto } from './dto/response-wish.dto';

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

  @Get()
  findAll() {
    return this.wishesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const wish = await this.wishesService.findOne(id);

    return plainToInstance(WishResponseDto, wish, {
      excludeExtraneousValues: true,
    });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWishDto: UpdateWishDto) {
    return this.wishesService.update(+id, updateWishDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wishesService.remove(id);
  }
}
