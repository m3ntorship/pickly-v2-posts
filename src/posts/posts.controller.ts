import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  Param,
  Patch,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as winston from 'winston';
import { winstonLoggerOptions } from '../logging/winston.options';
import { ValidationExceptionFilter } from '../shared/exception-filters/validation-exception.filter';
import { PostIdParam } from '../shared/validations/uuid.validator';
import { FlagPostFinishedDto } from './dto/flag-post-finished';
import { OptionsGroupCreationDto } from './dto/optionGroupCreation.dto';
import { PostCreationDto } from './dto/postCreation.dto';
import type { Posts } from './interfaces/getPosts.interface';
import { OptionsGroups } from './interfaces/optionsGroup.interface';
import type { PostCreation as PostCreationInterface } from './interfaces/postCreation.interface';
import { PostsService } from './posts.service';

@Controller('posts')
@UseFilters(
  new ValidationExceptionFilter(winston.createLogger(winstonLoggerOptions)),
)
export class PostsController {
  constructor(private postsService: PostsService) {}
  logger = winston.createLogger(winstonLoggerOptions);

  @Post('/')
  createPost(
    @Body() postCreationDto: PostCreationDto,
    @Headers() headers: { Authorization: string },
  ): Promise<PostCreationInterface> {
    const userId = headers.Authorization;
    return this.postsService.createPost(postCreationDto, userId);
  }

  @Get('/')
  @UseGuards(AuthGuard('firebase-jwt'))
  async getAllPosts(): Promise<Posts> {
    return await this.postsService.getAllPosts();
  }

  @Get('/:postid')
  getSinglePost(@Param() params: PostIdParam) {
    return this.postsService.getSinglePost(params.postid);
  }

  @Post('/:postid/groups')
  async createOptionGroup(
    @Param() params: PostIdParam,
    @Body() createGroupsDto: OptionsGroupCreationDto,
    @Headers() headers: { Authorization: string },
  ): Promise<OptionsGroups> {
    const userId = headers.Authorization;
    const createdGroups = await this.postsService.createOptionGroup(
      params.postid,
      createGroupsDto,
      userId,
    );
    return createdGroups;
  }

  @Patch('/:postid')
  @HttpCode(204)
  async flagPost(
    @Param() params: PostIdParam,
    @Body() flagPostDto: FlagPostFinishedDto,
    @Headers() headers: { Authorization: string },
  ): Promise<void> {
    const userId = headers.Authorization;
    await this.postsService.flagPost(
      params.postid,
      flagPostDto.finished,
      userId,
    );
  }

  @Delete('/:postid')
  @HttpCode(204)
  async deletePost(
    @Param() params: PostIdParam,
    @Headers() headers: { Authorization: string },
  ) {
    const userId = headers.Authorization;
    await this.postsService.deletePost(params.postid, userId);
  }
}
