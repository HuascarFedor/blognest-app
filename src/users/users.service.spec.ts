import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Profile } from './profile.entity';
import { HttpException, UnauthorizedException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { CredentialDto } from './dto/credential.dto';
import { CreateProfileDto } from './dto/create-profile.dto';

const mockUserRepository = () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  delete: jest.fn(),
});

const mockProfileRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: MockRepository<User>;
  let profileRepository: MockRepository<Profile>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository(),
        },
        {
          provide: getRepositoryToken(Profile),
          useValue: mockProfileRepository(),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<MockRepository<User>>(getRepositoryToken(User));
    profileRepository = module.get<MockRepository<Profile>>(
      getRepositoryToken(Profile),
    );
  });

  describe('createUser', () => {
    it('should throw an exception if the username already exists', async () => {
      const userDto = {
        username: 'juan',
        password: 'C$1234567',
        roles: ['ADMIN'],
      };
      userRepository.findOne.mockResolvedValue(userDto);
      await expect(service.createUser(userDto)).rejects.toThrow(HttpException);
      await expect(() => service.createUser(userDto)).rejects.toThrow(
        'User already exists',
      );
    });

    it('should create and return the user if the username does not exist', async () => {
      const userDto = {
        username: 'juan',
        password: 'C$1234567',
        roles: ['ADMIN'],
      };
      const createdUser = { id: 1, ...userDto };

      userRepository.findOne.mockResolvedValue(null);
      userRepository.create.mockReturnValue(createdUser);
      userRepository.save.mockResolvedValue(createdUser);

      const result = await service.createUser(userDto);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { username: userDto.username },
      });
      expect(userRepository.create).toHaveBeenCalledWith(userDto);
      expect(userRepository.save).toHaveBeenCalledWith(createdUser);
      expect(result).toEqual(createdUser);
    });
  });

  describe('getUsers', () => {
    it('should return users with their posts and profile relations', async () => {
      const users = [
        {
          id: 1,
          username: 'testuser1',
          password: 'Password$123',
          roles: ['AUTHOR'],
          posts: [],
          profile: {},
        },
        {
          id: 2,
          username: 'testuser2',
          password: 'Password$456',
          roles: ['ADMIN'],
          posts: [],
          profile: {},
        },
      ];

      // Mockear la respuesta del método find del userRepository
      jest.spyOn(userRepository, 'find').mockResolvedValue(users);

      // Llamar al método getUsers del servicio
      const result = await service.getUsers();

      // Verificar que el método find fue llamado con las relaciones correctas
      expect(userRepository.find).toHaveBeenCalledWith({
        relations: ['posts', 'profile'],
      });

      // Verificar que el resultado devuelto sea igual a los usuarios simulados
      expect(result).toEqual(users);
    });
  });

  describe('getUser', () => {
    it('should throw an exception if the user is not found', async () => {
      const userId = 1;
      userRepository.findOne.mockResolvedValue(null);

      await expect(service.getUser(userId)).rejects.toThrow(HttpException);
      await expect(service.getUser(userId)).rejects.toThrow('User not found');
    });

    it('should return the user if found', async () => {
      const userId = 1;
      const user = {
        id: userId,
        username: 'testuser',
        password: 'Password$123',
        roles: ['ADMIN'],
        posts: [],
        profile: {},
      };

      userRepository.findOne.mockResolvedValue(user);

      const result = await service.getUser(userId);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
        relations: ['posts', 'profile'],
      });

      expect(result).toEqual(user);
    });
  });

  describe('deleteUser', () => {
    it('should throw an exception if the user is not found', async () => {
      const userId = 1;
      userRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.deleteUser(userId)).rejects.toThrow(HttpException);
      await expect(service.deleteUser(userId)).rejects.toThrow(
        'User not found',
      );
    });

    it('should delete the user if found', async () => {
      const userId = 1;
      const deleteResult = { affected: 1 };

      userRepository.delete.mockResolvedValue(deleteResult);

      const result = await service.deleteUser(userId);

      expect(userRepository.delete).toHaveBeenCalledWith({ id: userId });
      expect(result).toEqual(deleteResult);
    });
  });

  describe('updateUser', () => {
    it('should throw an exception if the user is not found', async () => {
      const userId = 1;
      const updateUserDto: UpdateUserDto = {
        username: 'updatedUser',
        password: 'Updated$1234',
      };

      userRepository.findOne.mockResolvedValue(null);

      await expect(service.updateUser(userId, updateUserDto)).rejects.toThrow(
        HttpException,
      );
      await expect(service.updateUser(userId, updateUserDto)).rejects.toThrow(
        'User not found',
      );
    });

    it('should update and return the user if found and valid', async () => {
      const userId = 1;
      const existingUser = {
        id: userId,
        username: 'existingUser',
        password: 'Password$123',
        roles: ['USER'],
      };
      const updateUserDto: UpdateUserDto = {
        username: 'updatedUser',
        password: 'Updated$1234',
      };
      const updatedUser = { ...existingUser, ...updateUserDto };

      userRepository.findOne
        .mockResolvedValueOnce(existingUser)
        .mockResolvedValueOnce(null);
      userRepository.save.mockResolvedValue(updatedUser);

      const result = await service.updateUser(userId, updateUserDto);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { username: updateUserDto.username },
      });
      expect(userRepository.save).toHaveBeenCalledWith(updatedUser);
      expect(result).toEqual(updatedUser);
    });
  });

  describe('validateUser', () => {
    it('should throw an exception if the username does not exist', async () => {
      const credentials: CredentialDto = {
        username: 'nonexistentUser',
        password: 'somePassword',
      };

      userRepository.findOne.mockResolvedValue(null);

      await expect(service.validateUser(credentials)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.validateUser(credentials)).rejects.toThrow(
        'Username and/or password are incorrect',
      );
    });

    it('should throw an exception if the password does not match', async () => {
      const credentials: CredentialDto = {
        username: 'existingUser',
        password: 'wrongPassword',
      };
      const user = {
        id: 1,
        username: 'existingUser',
        password: 'correctPassword',
        roles: ['USER'],
      };

      userRepository.findOne.mockResolvedValue(user);

      await expect(service.validateUser(credentials)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.validateUser(credentials)).rejects.toThrow(
        'Username and/or password are incorrect',
      );
    });

    it('should return the user if the username and password match', async () => {
      const credentials: CredentialDto = {
        username: 'existingUser',
        password: 'correctPassword',
      };
      const user = {
        id: 1,
        username: 'existingUser',
        password: 'correctPassword',
        roles: ['USER'],
      };

      userRepository.findOne.mockResolvedValue(user);

      const result = await service.validateUser(credentials);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { username: credentials.username },
      });
      expect(result).toEqual(user);
    });
  });

  describe('createProfile', () => {
    it('should throw an exception if the user is not found', async () => {
      const userId = 1;
      const profileDto: CreateProfileDto = {
        firstname: 'Juan',
        lastname: 'Roman',
        age: 30,
      };

      userRepository.findOne.mockResolvedValue(null);

      await expect(service.createProfile(userId, profileDto)).rejects.toThrow(
        HttpException,
      );
      await expect(service.createProfile(userId, profileDto)).rejects.toThrow(
        'User not found',
      );
    });

    it('should create and return the profile if the user exists', async () => {
      const userId = 1;
      const profileDto: CreateProfileDto = {
        firstname: 'Laura',
        lastname: 'Ramos',
        age: 30,
      };
      const user = {
        id: userId,
        username: 'existingUser',
        password: 'correctPassword',
        roles: ['USER'],
        profile: null,
      };
      const newProfile = {
        id: 1,
        ...profileDto,
      };
      const savedProfile = { ...newProfile };

      userRepository.findOne.mockResolvedValue(user);
      profileRepository.create.mockReturnValue(newProfile);
      profileRepository.save.mockResolvedValue(savedProfile);
      userRepository.save.mockResolvedValue({ ...user, profile: savedProfile });

      const result = await service.createProfile(userId, profileDto);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(profileRepository.create).toHaveBeenCalledWith(profileDto);
      expect(profileRepository.save).toHaveBeenCalledWith(newProfile);
      expect(userRepository.save).toHaveBeenCalledWith({
        ...user,
        profile: savedProfile,
      });
      expect(result).toEqual({ ...user, profile: savedProfile });
    });
  });
});
