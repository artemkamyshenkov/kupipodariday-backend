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
import { Serialize } from '../decorators/serialize.decorator';
import { OfferResponseDto } from './dto/response-offer.dto';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Serialize(OfferResponseDto)
  @UseGuards(JwtGuard)
  @Post()
  async create(@Body() createOfferDto: CreateOfferDto, @Request() req) {
    await this.offersService.create(createOfferDto, req?.user);
    return {};
  }

  @Serialize(OfferResponseDto)
  @UseGuards(JwtGuard)
  @Get()
  async findAll(@Request() req) {
    const offers = await this.offersService.findAll(req?.user?.id);
    return offers;
  }

  @Serialize(OfferResponseDto)
  @UseGuards(JwtGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const offer = await this.offersService.findOne(id);
    return offer;
  }
}
