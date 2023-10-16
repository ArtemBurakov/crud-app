import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const email = createUserDto.email;
    const userExists = await this.findByEmail(email);
    if (userExists)
      throw new ConflictException('User with this email already exists');

    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findAll() {
    return this.userRepository.find();
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async findByEmail(email: string) {
    return (await this.userRepository.findOne({ where: { email } })) || null;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    user.name = updateUserDto.name;
    user.age = updateUserDto.age;
    user.email = updateUserDto.email;
    user.username = updateUserDto.username;
    user.password = updateUserDto.password;
    user.role = updateUserDto.role;
    user.refreshToken = updateUserDto.refreshToken;

    return this.userRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
}
