import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id: Number(id) },
    });

    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const existing = await this.usersRepository.findOneBy({
      email: createUserDto.email,
    });
    if (existing) {
      throw new BadRequestException(
        'Пользователь с таким email уже существует',
      );
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.usersRepository.save(user);

    return savedUser;
  }

  async findMany(search: string) {
    const users = await this.usersRepository.find({
      where: [
        { username: ILike(`%${search}%`) },
        { email: ILike(`%${search}%`) },
      ],
    });

    return users;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const userId = Number(id);
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const updateData = { ...updateUserDto };
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    Object.assign(user, updateData);
    const updated = await this.usersRepository.save(user);

    return updated;
  }

  async findByUsername(username: string) {
    const user = await this.usersRepository.findOneBy({
      username,
    });

    return user;
  }

  async getOwnWishes(userId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: Number(userId) },
      relations: ['wishes', 'wishes.owner', 'wishes.offers'],
    });
    return user?.wishes || [];
  }

  async getUserWishes(username: string) {
    const user = await this.usersRepository.findOne({
      where: { username },
      relations: ['wishes', 'wishes.owner', 'wishes.offers'],
    });
    return user?.wishes || [];
  }
}
