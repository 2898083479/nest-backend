import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CatService } from 'src/wx/com/cat/service/cat.service';
import { Cat } from 'src/schema';
import { handleSuccess, handleFailed } from 'src/common/response-code';

@Controller('cats')
export class CatController<T> {

  constructor(private readonly catService: CatService<T>) { }

  @Post()
  create(@Body() cat: Cat) {
    const result = this.catService.createCat(cat);
    if (!result) {
      return handleFailed();
    }
    return handleSuccess();
  }

  @Get()
  queryCat(@Query() id: string) {
    const result = this.queryCat(id);
    if (!result) {
      return handleFailed();
    }
    return handleSuccess();
  }
}
