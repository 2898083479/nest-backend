import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { DogService } from './service/dog.service';
import { DogDto } from './domain/dog.dto';
import { JwtInterceptor } from 'src/interceptor/jwt.interceptor';

@Controller('dogs')
@UseInterceptors(JwtInterceptor)
export class DogController {
  @Inject(DogService)
  private readonly dogService: DogService;

  @Post()
  create(@Body() dog: DogDto) {
    this.dogService.create(dog);
    return 'This action adds a new dog';
  }

  @Get('/exception')
  findAll() {
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }
}
