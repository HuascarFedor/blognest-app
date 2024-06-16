import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { UsersModule } from 'src/users/users.module';
import { ProvidersModule } from 'src/providers/providers.module';
import { HttpCustomService } from 'src/providers/http/http.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), UsersModule, ProvidersModule],
  controllers: [PostsController],
  providers: [PostsService, HttpCustomService],
})
export class PostsModule {}
