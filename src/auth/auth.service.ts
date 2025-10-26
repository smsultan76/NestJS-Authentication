import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.create(registerDto);
    
    // Remove password from response
    const { password, ...result } = user;
    
    return {
      message: 'User registered successfully',
      user: result,
    };
  }

  async login(loginDto: LoginDto) {
    // Find user by username or email
    let user = await this.usersService.findByUsername(loginDto.username);
    
    if (!user) {
      user = await this.usersService.findByEmail(loginDto.username);
    }

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = { sub: user.id, username: user.username, email: user.email };
    const access_token = await this.jwtService.signAsync(payload);

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    return {
      message: 'Login successful',
      access_token,
      user: userWithoutPassword,
    };
  }

  async validateUser(userId: string): Promise<User> {
    return this.usersService.findById(userId);
  }
}