import { Body, Controller, Post } from '@nestjs/common';
import { CredentialDto } from 'src/users/dto/credential.dto';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}
  @Post('login')
  async login(@Body() credentialDto: CredentialDto) {
    const user = await this.usersService.validateUser(credentialDto);
    return this.authService.login(user);
  }
}
