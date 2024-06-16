import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}
  async login(user: User) {
    const payload = { username: user.username, sub: user.id };
    return {
      acces_token: this.jwtService.sign(payload),
    };
  }
}
