
import { comparePasswordHandler } from '@/helpers/util';
import { UsersService } from '@/modules/users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CodeAuthDto, CreateAuthDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    
    const isValidPassword = await comparePasswordHandler(pass, user.password);
    if (!isValidPassword) return null;
    
    return user;
  }

  async login(user: any) {
    const payload = { sub: user._id, email: user.email }
    const access_token = await this.jwtService.signAsync(payload);

    return {
      user: {
        email: user.email,
        _id: user._id,
        name: user.name,
      },
      access_token: access_token
    }
  }

  handleRegister = async (registerDto: CreateAuthDto) => {
    return await this.usersService.handleRegister(registerDto)
  }

  handleCheckCode = async (codeAuthDto: CodeAuthDto) => {
    return await this.usersService.handleCheckCode(codeAuthDto)
  }

  handleRetryActive = async (email: string) => {
    return await this.usersService.handleRetryActive(email)
  }
}

