import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { Public, ResponseMessage } from '@/decorator/customize';
import { ChangePasswordAuthDto, CodeAuthDto, CreateAuthDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }

  @UseGuards(LocalAuthGuard)
  @ResponseMessage("Fetch login")
  @Public()
  @Post('login')
  handleLogin(@Request() req) {
    return this.authService.login(req.user);
  }

  @Public()
  @Post('check-code')
  checkCode(@Body() codeAuthDto: CodeAuthDto) {
    return this.authService.handleCheckCode(codeAuthDto);
  }

  @Public()
  @Post('change-password')
  changePassword(@Body() changePasswordAuthDto: ChangePasswordAuthDto) {
    return this.authService.handleChangePassword(changePasswordAuthDto);
  }

  @Public()
  @Post('retry-active')
  retryActive(@Body("email") email: string) {
    return this.authService.handleRetryActive(email);
  }

  @Public()
  @Post('retry-password')
  retryPassword(@Body("email") email: string) {
    return this.authService.handleRetryPassword(email);
  }

  @Public()
  @Post('register')
  register(@Body() registerDto: CreateAuthDto) {
    return this.authService.handleRegister(registerDto);
  }
}
