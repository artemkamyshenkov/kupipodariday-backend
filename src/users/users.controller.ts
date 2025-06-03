import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  UseGuards,
  Param,
  Request,
  Req,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from '../auth/guards/jwt-auth.guard';
import { UserResponseDto } from './dto/response-user.dto';
import { WishResponseDto } from '../wishes/dto/response-wish.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('find')
  findMany(@Body() body: { query: string }) {
    return this.usersService.findMany(body.query);
  }

  @UseGuards(JwtGuard)
  @Get('me')
  me(@Req() req) {
    return req.user;
  }

  @UseGuards(JwtGuard)
  @Patch('me')
  update(@Body() updateUserDto: UpdateUserDto, @Req() req) {
    const { id } = req.user;
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(JwtGuard)
  @Get(':username')
  findUser(@Param() param: { username: string }) {
    const { username } = param;
    const user = this.usersService.findByUsername(username);

    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(JwtGuard)
  @Get('me/wishes')
  async getMeWishes(@Request() req) {
    const userId = req.user.id;
    const wishes = await this.usersService.findUserWishes(userId);

    return plainToInstance(WishResponseDto, wishes, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(JwtGuard)
  @Get(':username/wishes')
  getWishesByUsername(@Param() param: { username: string }) {
    const { username } = param;
    const user = this.usersService.findByUsername(username);

    return [];
  }
}
