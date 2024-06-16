import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateProfileDto } from './dto/create-profile.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Profile } from './profile.entity';
import { Post } from 'src/posts/post.entity';

describe('UsersController (Integration)', () => {
  let controller: UsersController;
  let userRepository: Repository<User>;
  let profileRepository: Repository<Profile>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: ['.env.test'],
          isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            type: 'postgres',
            host: configService.get<string>('DATABASE_HOST'),
            port: configService.get<number>('DATABASE_PORT'),
            username: configService.get<string>('DATABASE_USERNAME'),
            password: configService.get<string>('DATABASE_PASSWORD'),
            database: configService.get<string>('DATABASE_NAME'),
            entities: [__dirname + './**/**/*entity{.ts,.js}'],
            autoLoadEntities: true,
            synchronize: true,
            logging: true,
          }),
          inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([User, Profile, Post]),
      ],
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    profileRepository = module.get<Repository<Profile>>(
      getRepositoryToken(Profile),
    );
  });

  afterEach(async () => {
    await userRepository.query(
      'TRUNCATE TABLE "user" RESTART IDENTITY CASCADE',
    );
    await profileRepository.query(
      'TRUNCATE TABLE "user_profile" RESTART IDENTITY CASCADE',
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUsers', () => {
    it('should return an array of users', async () => {
      const user = userRepository.create({
        username: 'testuser',
        password: 'password',
        roles: ['ADMIN'],
      });

      await userRepository.save(user);

      const users = await controller.getUsers();
      expect(users).toHaveLength(1);
      expect(users[0].username).toBe('testuser');
    });
  });

  describe('getUser', () => {
    it('should return a user by id', async () => {
      const user = userRepository.create({
        username: 'testuser',
        password: 'password',
        roles: ['ADMIN'],
      });

      await userRepository.save(user);

      const foundUser = await controller.getUser(user.id);
      expect(foundUser).toBeDefined();
      expect(foundUser.username).toBe('testuser');
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        password: 'password',
        roles: ['ADMIN'],
      };

      const createdUser = await controller.createUser(createUserDto);
      expect(createdUser).toBeDefined();
      expect(createdUser.username).toBe('testuser');

      const users = await userRepository.find();
      expect(users).toHaveLength(1);
      expect(users[0].username).toBe('testuser');
    });
  });

  describe('deleteUser', () => {
    it('should delete a user by id', async () => {
      const user = userRepository.create({
        username: 'testuser',
        password: 'password',
        roles: ['ADMIN'],
      });

      await userRepository.save(user);

      const deleteResult = await controller.deleteUser(user.id);
      expect(deleteResult).toEqual({ raw: [], affected: 1 });

      const users = await userRepository.find();
      expect(users).toHaveLength(0);
    });
  });

  describe('updateUser', () => {
    it('should update a user by id', async () => {
      const user = userRepository.create({
        username: 'testuser',
        password: 'password',
        roles: ['ADMIN'],
      });

      await userRepository.save(user);

      const updateUserDto: UpdateUserDto = {
        username: 'usermodificado',
        password: 'password',
      };
      const updatedUser = await controller.updateUser(user.id, updateUserDto);
      expect(updatedUser).toBeDefined();
      expect(updatedUser.username).toBe('usermodificado');

      const foundUser = await userRepository.findOne({
        where: { id: user.id },
      });
      expect(foundUser.username).toBe('usermodificado');
    });
  });

  describe('createProfile', () => {
    it('should create a profile for a user by id', async () => {
      const user = userRepository.create({
        username: 'testuser',
        password: 'password',
        roles: ['ADMIN'],
      });

      await userRepository.save(user);

      const createProfileDto: CreateProfileDto = {
        firstname: 'Juan',
        lastname: 'Roman',
        age: 30,
      };

      const updatedUser = await controller.createProfile(
        user.id,
        createProfileDto,
      );
      expect(updatedUser).toBeDefined();
      expect(updatedUser.profile).toBeDefined();
      expect(updatedUser.profile.firstname).toBe('Juan');
    });
  });
});
