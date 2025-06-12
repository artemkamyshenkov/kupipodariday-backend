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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from '../auth/guards/jwt-auth.guard';
import {
  UserResponseDto,
  UserResponseDtoWithEmail,
} from './dto/response-user.dto';
import { WishResponseDto } from '../wishes/dto/response-wish.dto';
import { Serialize } from '../decorators/serialize.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Serialize(UserResponseDtoWithEmail)
  @UseGuards(JwtGuard)
  @Get('me')
  me(@Req() req) {
    return req.user;
  }

  @Serialize(WishResponseDto)
  @UseGuards(JwtGuard)
  @Get('me/wishes')
  async getMeWishes(@Request() req) {
    const userId = req?.user?.id;
    const wishes = await this.usersService.getOwnWishes(userId);

    return wishes;
  }

  @Serialize(UserResponseDto)
  @UseGuards(JwtGuard)
  @Get(':username')
  findUser(@Param() param: { username: string }) {
    const { username } = param;
    const user = this.usersService.findByUsername(username);

    return user;
  }

  @Serialize(WishResponseDto)
  @UseGuards(JwtGuard)
  @Get(':username/wishes')
  getWishesByUsername(@Param() param: { username: string }) {
    const { username } = param;
    const wishes = this.usersService.getUserWishes(username);

    return wishes;
  }

  @Serialize(UserResponseDto)
  @UseGuards(JwtGuard)
  @Post('find')
  findMany(@Body() body: { query: string }) {
    return this.usersService.findMany(body.query);
  }

  @Serialize(UserResponseDtoWithEmail)
  @UseGuards(JwtGuard)
  @Patch('me')
  update(@Body() updateUserDto: UpdateUserDto, @Req() req) {
    const { id } = req.user;
    return this.usersService.update(id, updateUserDto);
  }
}
