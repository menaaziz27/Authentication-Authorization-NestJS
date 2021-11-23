import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AuthDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @MinLength(8)
  @IsNotEmpty()
  readonly password: string;
}
