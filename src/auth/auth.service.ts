
import { comparePasswordHandler } from '@/helpers/util';
import { User } from '@/modules/users/schemas/user.schema';
import { UsersService } from '@/modules/users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    const isValidPassword = await comparePasswordHandler(pass, user.password);
    
    if (!user || !isValidPassword) return null;
    return user;
  }
  
  async login(user: any) {
    const payload = { sub: user._id, email: user.email }
    const access_token = await this.jwtService.signAsync(payload);

    return { access_token: access_token }
  }
}
