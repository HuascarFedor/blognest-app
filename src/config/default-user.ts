import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async setDefaultUser(): Promise<User> {
    const defaultUserName = this.configService.get<string>('DEFAULT_USER_NAME');
    const userFound = await this.userRepository.findOne({
      where: {
        username: defaultUserName,
      },
    });

    if (!userFound) {
      const adminUser = this.userRepository.create({
        username: defaultUserName,
        password: this.configService.get<string>('DEFAULT_USER_PASSWORD'),
        roles: ['ADMIN'],
      });

      return await this.userRepository.save(adminUser);
    }

    return userFound;
  }
}
