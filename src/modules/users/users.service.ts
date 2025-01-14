import { hashPasswordHandler } from './../../helpers/util';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose'
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import aqp from 'api-query-params';

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

    delete filter.current
    delete filter.pageSize
    if (!current || current < 1) current = 1
    if (!pageSize || pageSize < 1) pageSize = 5

    const totalItems = await this.userModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (current - 1) * pageSize

    const result = await this.userModel
      .find(filter)
      .limit(pageSize)
      .skip(skip)
      .select("-password")
      .sort(sort as any)
    return { result, totalPages };
  }

  async findOne(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException("Id is invalid");
    }

    return await this.userModel.findOne({ _id: id }).select("-password");
  }

  async findByEmail(email:string){
    return await this.userModel.findOne({ email: email });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException("Id is invalid");
    }

    return await this.userModel.updateOne({ _id: id }, { ...updateUserDto });
  }

  async remove(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException("Id is invalid");
    }

    return await this.userModel.deleteOne({ _id: id });
  }
}
