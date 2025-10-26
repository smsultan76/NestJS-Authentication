import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  username: string; // Can be email or username

  @IsNotEmpty()
  @IsString()
  password: string;
}