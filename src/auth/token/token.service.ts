import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/user/interfaces/user.interface';
import { TokenDto } from '../dto/token.dto';
import * as randomToken from 'rand-token';
import { UserService } from 'src/user/user.service';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService, private readonly userService: UserService) {}

  public generateAuthToken(user: IUser): TokenDto {
    const accessToken = this.jwtService.sign({
      id: user.id,
      email: user.email,
    });

    return { accessToken };
  }

  public async getRefreshToken(userId: number): Promise<string> {
    const userDataToUpdate = {
      refreshToken: randomToken.generate(16),
    };

    await this.userService.update(userId, userDataToUpdate);
    return userDataToUpdate.refreshToken;
  }

  public async validRefreshToken(email: string, refreshToken: string): Promise<IUser> {
    let user = await this.userService.findByPayload({
      email,
      refreshToken,
    });

    if (!user) {
      return null;
    }

    return user;
  }
}
