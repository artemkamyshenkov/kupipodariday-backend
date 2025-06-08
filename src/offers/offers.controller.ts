import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { JwtGuard } from '../auth/guards/jwt-auth.guard';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @UseGuards(JwtGuard)
  @Post()
  async create(@Body() createOfferDto: CreateOfferDto, @Request() req) {
    const offer = await this.offersService.create(createOfferDto, req?.user);

    return offer;
  }

  @UseGuards(JwtGuard)
  @Get()
  findAll() {
    /** В задании нет объяснения что должен возвращать эндпоинт и фронт не использует его */
    return [];
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const offer = await this.offersService.findOne(id);
    return offer;
  }
}
