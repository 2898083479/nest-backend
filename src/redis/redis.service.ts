import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD,
    });
  }

  //當模塊銷毀時，關閉redis數據流
  async onModuleDestroy() {
    await this.redis.quit();
  }

  // 設置鍵值對
  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.redis.set(key, value, 'EX', ttl);
    } else {
      await this.redis.set(key, value);
    }
  }

  // 獲取值
  async get(key: string): Promise<string> {
    return await this.redis.get(key);
  }

  // 刪除值
  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  // 設置過期時間
  async expire(key: string, seconds: number): Promise<void> {
    await this.redis.expire(key, seconds);
  }

  // 檢查鍵是否存在
  async exists(key: string): Promise<boolean> {
    return (await this.redis.exists(key)) === 1;
  }
}
