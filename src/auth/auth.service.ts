
import { comparePasswordHandler } from '@/helpers/util';
import { UsersService } from '@/modules/users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { access } from 'fs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    const isValidPassword = await comparePasswordHandler(pass, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException("Email or password is invalid");
    }

    const payload = { sub: user._id, email: user.email }
    return { access_token: await this.jwtService.signAsync(payload) }
  }
}
