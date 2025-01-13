import { hashPasswordHandler } from './../../helpers/util';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose'
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import aqp from 'api-query-params';
import { query } from 'express';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>
  ) { }

  async create(createUserDto: CreateUserDto) {
    try {
      const { name, email, password, phone, address, image } = createUserDto;

      const isUserExist = await this.IsUserExists(email, phone); // Thêm `await`
      if (isUserExist) {
        throw new BadRequestException(`Email or number phone already exists`);
      }

      const hashPassword = await hashPasswordHandler(password);

      const user = await this.userModel.create({
        name,
        email,
        password: hashPassword,
        phone,
        address,
        image,
      });

      return {
        _id: user._id,
      };
    } catch (error) {
      console.error('Error creating user:', error.message);
      throw new BadRequestException(error.message || 'An error occurred');
    }
  }

  async IsUserExists(email: string, phone: string): Promise<boolean> {
    const user = await this.userModel.findOne({ email, phone });
    return !!user;
  }

  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query)

    if(filter.current) delete filter.current
    if(filter.pageSize) delete filter.pageSize
    if (!current) current = 1
    if (!pageSize) pageSize = 5

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (current - 1) * pageSize

    const result = await this.userModel
      .find(filter)
      .limit(pageSize)
      .skip(skip)
      .select("-password")
      .sort(sort as any)
    return {result, totalPages};
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
