import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';
import { Auth } from 'src/common/decorators/auth.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @ApiTags('Publicaciones')
  @ApiBearerAuth()
  @Auth()
  @Post()
  createPost(@Body() post: CreatePostDto) {
    return this.postsService.createPost(post);
  }

  @ApiTags('Publicaciones')
  @Get()
  getPosts() {
    return this.postsService.getPosts();
  }

  @ApiTags('API externa - Obras de Arte')
  @Get('list/api')
  public async listApi() {
    return this.postsService.listApi();
  }
}
