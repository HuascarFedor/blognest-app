import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateProfileDto } from './dto/create-profile.dto';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    getUsers: jest.fn().mockResolvedValue([new User()]),
    getUser: jest.fn().mockResolvedValue(new User()),
    createUser: jest.fn().mockResolvedValue(new User()),
    deleteUser: jest.fn().mockResolvedValue(true),
    updateUser: jest.fn().mockResolvedValue(new User()),
    createProfile: jest.fn().mockResolvedValue(new User()),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUsers', () => {
    it('should return an array of users', async () => {
      await expect(controller.getUsers()).resolves.toEqual([new User()]);
      expect(service.getUsers).toHaveBeenCalled();
    });
  });

  describe('getUser', () => {
    it('should return a user by id', async () => {
      const id = 1;
      await expect(controller.getUser(id)).resolves.toEqual(new User());
      expect(service.getUser).toHaveBeenCalledWith(id);
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const newUser: CreateUserDto = {
        username: 'juan',
        password: 'C$1234567',
        roles: ['ADMIN'],
      };
      await expect(controller.createUser(newUser)).resolves.toEqual(new User());
      expect(service.createUser).toHaveBeenCalledWith(newUser);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user by id', async () => {
      const id = 1;
      await expect(controller.deleteUser(id)).resolves.toEqual(true);
      expect(service.deleteUser).toHaveBeenCalledWith(id);
    });
  });

  describe('updateUser', () => {
    it('should update a user by id', async () => {
      const id = 1;
      const updateUserDto: UpdateUserDto = {
        username: 'usermodificaod',
        password: 'C$1234567',
      };
      await expect(controller.updateUser(id, updateUserDto)).resolves.toEqual(
        new User(),
      );
      expect(service.updateUser).toHaveBeenCalledWith(id, updateUserDto);
    });
  });

  describe('createProfile', () => {
    it('should create a profile for a user by id', async () => {
      const id = 1;
      const createProfileDto: CreateProfileDto = {
        firstname: 'Juan',
        lastname: 'Roman',
        age: 30,
      };
      await expect(
        controller.createProfile(id, createProfileDto),
      ).resolves.toEqual(new User());
      expect(service.createProfile).toHaveBeenCalledWith(id, createProfileDto);
    });
  });
});
