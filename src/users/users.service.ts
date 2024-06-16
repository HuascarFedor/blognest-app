import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CredentialDto } from './dto/credential.dto';
import { CreateProfileDto } from './dto/create-profile.dto';
import { Profile } from './profile.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
  ) {}

  async createUser(user: CreateUserDto) {
    //Primero, revisar si el nombre de usuario ya existe
    const userFound = await this.userRepository.findOne({
      where: {
        username: user.username,
      },
    });
    //Segundo, emitir la excepcion correspondiente si el usuario ya existe
    if (userFound) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }
    //Tercero, en caso de superar el control se registra el usuario
    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  getUsers() {
    return this.userRepository.find({
      relations: ['posts', 'profile'],
    });
  }

  async getUser(id: number) {
    const userFound = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: ['posts', 'profile'],
    });
    if (!userFound) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return userFound;
  }

  async deleteUser(id: number) {
    const result = await this.userRepository.delete({ id });
    if (result.affected === 0) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return result;
  }

  async updateUser(id: number, user: UpdateUserDto) {
    const userFoundById = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (!userFoundById) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (user.username) {
      const userFoundByName = await this.userRepository.findOne({
        where: {
          username: user.username,
        },
      });
      if (userFoundByName && userFoundByName.id !== id) {
        throw new HttpException('User already exists', HttpStatus.CONFLICT);
      }
    }
    const updateUser = Object.assign(userFoundById, user);
    return this.userRepository.save(updateUser);
  }

  async validateUser(user: CredentialDto): Promise<User> {
    //Primero, revisar si el nombre de usuario ya existe
    const userFound = await this.userRepository.findOne({
      where: {
        username: user.username,
      },
    });
    //Segundo, emitir la excepcion correspondiente si el usuario no existe o no coincide el password
    if (!userFound || userFound.password !== user.password) {
      throw new UnauthorizedException('Username and/or password are incorrect');
    }
    //Tercero, retornar el usuario
    return userFound;
  }

  async createProfile(id: number, profile: CreateProfileDto) {
    const userFound = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (!userFound) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const newProfile = this.profileRepository.create(profile);
    const savedProfile = await this.profileRepository.save(newProfile);
    userFound.profile = savedProfile;
    return this.userRepository.save(userFound);
  }
}
