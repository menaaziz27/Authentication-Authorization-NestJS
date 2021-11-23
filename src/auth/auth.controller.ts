import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshAuthGuard } from './guards/refresh.guard';
import { TokenService } from './token/token.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenservice: TokenService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() credentials: AuthDto, @Res() res: Response) {
    let { userData: secretData, user } = await this.authService.login(credentials);

    res.cookie('auth-cookie', secretData, { httpOnly: true });
    return res.json({ message: 'user is logged in successfully', user });
  }

  @Get('refresh-tokens')
  @UseGuards(RefreshAuthGuard)
  async regenerateTokens(@Req() req, @Res({ passthrough: true }) res: Response) {
    const { accessToken: token } = await this.tokenservice.generateAuthToken(req.user);

    const refreshToken = await this.tokenservice.getRefreshToken(req.user._id.toString());

    const secretData = {
      token,
      refreshToken,
    };

    res.cookie('auth-cookie', secretData, { httpOnly: true });
    return { msg: 'done' };
  }

  @Get('logout')
  logout(@Res() res: Response) {
    res.clearCookie('auth-cookie');
    return res.json('logged out');
  }
}
