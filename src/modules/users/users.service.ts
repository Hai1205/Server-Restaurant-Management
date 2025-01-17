import { hashPasswordHandler } from './../../helpers/util';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose'
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import aqp from 'api-query-params';
import { CodeAuthDto, CreateAuthDto } from '@/auth/dto/create-auth.dto';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid'
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,

    private readonly mailerService: MailerService
  ) { }

  async create(createUserDto: CreateUserDto) {
    try {
      const { name, email, password, phone, address, image } = createUserDto;

      const isUserExist = await this.IsUserExists(email);
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

  async IsUserExists(email: string): Promise<boolean> {
    const user = await this.userModel.findOne({ email });
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

  async findByEmail(email: string) {
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

  generateRandomNumber() {
    const randomCode = Math.floor(Math.random() * 1000000);
    return randomCode.toString().padStart(6, '0');
  }

  async handleRegister(registerDto: CreateAuthDto) {
    try {
      const { name, email, password } = registerDto;

      const isUserExist = await this.IsUserExists(email); // Thêm `await`
      if (isUserExist) {
        throw new BadRequestException(`Email already exists`);
      }

      const hashPassword = await hashPasswordHandler(password);
      const codeId = this.generateRandomNumber();
      const codeExpired = dayjs().add(5, 'minutes')
      const user = await this.userModel.create({
        name,
        email,
        password: hashPassword,
        isActive: false,
        codeId: codeId,
        codeExpired: codeExpired,
      });

      this.sendEmail(user, codeId)

      return {
        _id: user._id,
      };
    } catch (error) {
      console.error('Error creating user:', error.message);
      throw new BadRequestException(error.message || 'An error occurred');
    }
  }

  sendEmail(user: User, codeId: string) {
    this.mailerService
      .sendMail({
        to: user.email, // list of receivers
        subject: 'Activate your account', // Subject line
        template: "register.hbs",
        context: {
          name: user?.name ?? user.email,
          activationCode: codeId
        }
      })
      .then(() => { })
      .catch(() => { });
  }

  async handleCheckCode(codeAuthDto: CodeAuthDto) {
    try {
      const { _id, code } = codeAuthDto;

      const user = await this.userModel.findOne(
        {
          _id: _id,
          codeId: code
        },
      );

      if (!user || !dayjs().isBefore(user.codeExpired)) {
        throw new BadRequestException("The authentication code is invalid or has expired");
      }

      const result = await this.userModel.updateOne({ _id: _id }, { isActive: true, })

      return { result };
    } catch (error) {
      console.error('Error creating user:', error.message);
      throw new BadRequestException(error.message || 'An error occurred');
    }
  }

  async handleRetryActive(email: string) {
    try {
      const user = await this.userModel.findOne({ email: email });
      if (!user) {
        throw new BadRequestException(`Email not exists`);
      }

      if (user.isActive) {
        throw new BadRequestException(`Account has been actived`);
      }

      const codeId = this.generateRandomNumber();
      const codeExpired = dayjs().add(5, 'minutes')

      await user.updateOne({
        codeId: codeId,
        codeExpired: codeExpired,
      })

      this.sendEmail(user, codeId)

      return { _id: user._id, };
    } catch (error) {
      console.error('Error creating user:', error.message);
      throw new BadRequestException(error.message || 'An error occurred');
    }
  }
}
