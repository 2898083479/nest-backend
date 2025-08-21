import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cat } from 'src/schema/cat/model';
import { Response } from '../../../../common';
import { Model } from 'mongoose';
import { CatModel } from 'src/schema/cat/types';

@Injectable()
export class CatService<T> {

  constructor(
    @InjectModel(CatModel.name) private readonly catModel: Model<CatModel>,
  ) {}

  async createCat(cat: Cat): Promise<boolean> {
    const result = this.catModel.insertOne(cat);
    if (!result) {
      return false;
    }
    return true;
  }

  async getCat(id: string): Promise<CatModel> {
    const result = this.catModel.findById(id);
    return result;
  }
}
