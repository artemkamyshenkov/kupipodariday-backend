import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from '../auth/guards/jwt-auth.guard';

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
}
