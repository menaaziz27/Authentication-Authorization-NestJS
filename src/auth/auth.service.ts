import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IUser } from 'src/user/interfaces/user.interface';
import { UserService } from 'src/user/user.service';
import { AuthDto } from './dto/auth.dto';
import { TokenDto } from './dto/token.dto';
import * as bcrypt from 'bcrypt';
import { TokenService } from './token/token.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly tokenService: TokenService) {}

  async register(data): Promise<IUser> {
    const { name, email, password, roles } = data;

    const existingUser = await this.userService.findOne(email);

    if (existingUser) {
      throw new HttpException('this email is already exist', HttpStatus.BAD_REQUEST);
    }

    return await this.userService.create({ name, email, password, roles });
  }

  async login(credentails: AuthDto) {
    const user = await this.userService.findOne(credentails.email);

    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.NOT_FOUND);
    }

    const isMatched = await this.checkPassword(user, credentails.password);

    if (!isMatched) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }

    const { accessToken: token }: TokenDto = this.tokenService.generateAuthToken(user);
    const refreshToken = await this.tokenService.getRefreshToken(user._id);

    let userData = {
      token,
      refreshToken,
    };

    return { userData, user };
  }

  private checkPassword(user: IUser, password: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (error, ok) => {
        return error || !ok ? resolve(false) : resolve(true);
      });
    });
  }
}
