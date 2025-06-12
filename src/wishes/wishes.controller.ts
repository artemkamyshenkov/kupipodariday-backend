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
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { JwtGuard } from '../auth/guards/jwt-auth.guard';
import { WishResponseDto } from './dto/response-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Serialize } from '../decorators/serialize.decorator';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Serialize(WishResponseDto)
  @Get('last')
  async findLastAddedWished() {
    const wish = await this.wishesService.findLastAddedWishes();

    return wish;
  }

  @Serialize(WishResponseDto)
  @Get('top')
  async findMostPopularWished() {
    const wish = await this.wishesService.findMostPopularWishes();

    return wish;
  }

  @Serialize(WishResponseDto)
  @UseGuards(JwtGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const wish = await this.wishesService.findOne(id);

    return wish;
  }

  @UseGuards(JwtGuard)
  @Post()
  create(@Body() createWishDto: CreateWishDto, @Request() req) {
    return this.wishesService.create(createWishDto, req.user);
  }

  @Serialize(WishResponseDto)
  @UseGuards(JwtGuard)
  @Post(':id/copy')
  async copy(@Param() param: { id: string }, @Request() req) {
    const wish = await this.wishesService.copyWish(param.id, req.user);

    return wish;
  }

  @Serialize(WishResponseDto)
  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.wishesService.remove(id, req.user?.id);
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
