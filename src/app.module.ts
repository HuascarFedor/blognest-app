import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessControlModule } from 'nest-access-control';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { roles } from './app.roles';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';

import {
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_NAME,
} from './config/constants';
import { UserService } from './config/default-user';
import { User } from './users/user.entity';

const modules = [
  AccessControlModule.forRoles(roles),
  AuthModule,
  UsersModule,
  PostsModule,
];

export const global_modules = [
  TypeOrmModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
      type: 'postgres',
      host: config.get<string>(DATABASE_HOST),
      port: parseInt(config.get<string>(DATABASE_PORT), 10),
      username: config.get<string>(DATABASE_USERNAME),
      password: config.get<string>(DATABASE_PASSWORD),
      database: config.get<string>(DATABASE_NAME),
      entities: [__dirname + './**/**/*entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
    }),
  }),
  TypeOrmModule.forFeature([User]),
  ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: ['.env'],
  }),
];

@Module({
  imports: [...global_modules, ...modules],
  controllers: [AppController],
  providers: [AppService, UserService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
