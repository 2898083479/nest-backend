import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../domain/user';

@Injectable()
export class UserService {
  // constructor(
  //     @InjectRepository(User)
  //     private userRepository: Repository<User>
  // ) {}
  // async findAll(): Promise<User[]> {
  //     return this.userRepository.find();
  // }
  // async findOne(id: number): Promise<User> {
  //     return this.userRepository.findOne(id ? { where: { id } } : undefined);
  // }
  // async create(user: User): Promise<User> {
  //     return this.userRepository.save(user);
  // }
  // createUsers = async (users: User[]) => {
  //     const queryRunner = this.dataSource.createQueryRunner();
  //     await queryRunner.connect();
  //     await queryRunner.startTransaction();
  //     try {
  //         await queryRunner.manager.save(User, users); // 保存用户
  //         await queryRunner.commitTransaction(); // 提交事务
  //     } catch (error) {
  //         await queryRunner.rollbackTransaction(); // 回滚事务
  //     } finally {
  //         await queryRunner.release(); // 释放查询执行器
  //     }
  // }
}
