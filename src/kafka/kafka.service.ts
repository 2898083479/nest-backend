// kafka.service.ts
import { Injectable, OnModuleDestroy, OnModuleInit, Logger } from '@nestjs/common';
import { Kafka, logLevel, Producer, Consumer, Admin, ProducerRecord, Message } from 'kafkajs';

export interface KafkaMessage {
  key?: string;
  value: any;
  headers?: Record<string, string>;
}

export interface ConsumerOptions {
  groupId: string;
  fromBeginning?: boolean;
  autoCommit?: boolean;
}

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaService.name);
  private readonly kafka: Kafka;
  private producer: Producer;
  private admin: Admin;
  private consumers: Map<string, Consumer> = new Map();

  constructor() {
    this.kafka = new Kafka({
      clientId: 'nestjs-kafka-client',
      brokers: ['localhost:9092'], // 默认 broker 地址
      logLevel: logLevel.ERROR,
    });

    this.producer = this.kafka.producer();
    this.admin = this.kafka.admin();
  }

  // 模块初始化时连接
  async onModuleInit() {
    try {
      await this.producer.connect();
      await this.admin.connect();
      this.logger.log('Kafka producer and admin connected successfully');
    } catch (error) {
      this.logger.error('Failed to connect to Kafka', error);
      throw error;
    }
  }

  // 模块销毁时断开连接
  async onModuleDestroy() {
    try {
      // 断开所有消费者
      for (const consumer of this.consumers.values()) {
        await consumer.disconnect();
      }

      await this.producer.disconnect();
      await this.admin.disconnect();
      this.logger.log('Kafka connections closed successfully');
    } catch (error) {
      this.logger.error('Error closing Kafka connections', error);
    }
  }

  private async ensureTopicExists(topic: string): Promise<void> {
    const topics = await this.admin.listTopics();
    if (!topics.includes(topic)) {
      this.logger.log(`Topic "${topic}" does not exist. Creating...`);
      await this.admin.createTopics({
        topics: [{ topic, numPartitions: 1, replicationFactor: 1 }],
      });
      this.logger.log(`Topic "${topic}" created successfully`);
    }
  }

  // 发送消息到指定主题
  async send(topic: string, messages: KafkaMessage | KafkaMessage[]): Promise<void> {
    await this.ensureTopicExists(topic); // 先确保 topic 存在

    const messageArray = Array.isArray(messages) ? messages : [messages];
    const records: ProducerRecord = {
      topic,
      messages: messageArray.map(msg => ({
        key: msg.key,
        value: typeof msg.value === 'string' ? msg.value : JSON.stringify(msg.value),
        headers: msg.headers,
      })),
    };

    try {
      await this.producer.send(records);
      this.logger.debug(`Message sent to topic: ${topic}`);
    } catch (error) {
      this.logger.error(`Failed to send message to topic: ${topic}`, error);
      throw error;
    }
  }

  // 创建消费者
  async createConsumer(groupId: string, topic: string, options: ConsumerOptions = {
    groupId,
    fromBeginning: false,
    autoCommit: true
  }): Promise<void> {
    try {
      // 创建消费者
      const consumer = this.kafka.consumer({
        groupId: options.groupId,
      });
      // 消费者连接到kafka服务器
      await consumer.connect();
      // 消费者订阅主题
      await consumer.subscribe({ topic, fromBeginning: options.fromBeginning });
      // 消费者设置为已创建
      this.consumers.set(`${groupId}-${topic}`, consumer);
      this.logger.log(`Consumer created for topic: ${topic}, group: ${groupId}`);
    } catch (error) {
      this.logger.error(`Failed to create consumer for topic: ${topic}`, error);
      throw error;
    }
  }

  // 消费消息
  async consume(
    groupId: string,
    topic: string,
    callback: (message: any) => Promise<void>
  ): Promise<void> {
    const consumerKey = `${groupId}-${topic}`;
    const consumer = this.consumers.get(consumerKey);

    if (!consumer) {
      throw new Error(`Consumer not found for group: ${groupId}, topic: ${topic}`);
    }

    await consumer.run({
      autoCommit: true,
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const value = message.value?.toString();
          const parsedValue = value ? this.tryParseJson(value) : value;

          await callback({
            topic,
            partition,
            offset: message.offset,
            key: message.key?.toString(),
            value: parsedValue,
            headers: message.headers,
            timestamp: message.timestamp,
          });
        } catch (error) {
          this.logger.error(`Error processing message from topic: ${topic}`, error);
        }
      },
    });
  }

  // 创建主题
  async createTopic(topic: string, partitions: number = 1, replicationFactor: number = 1): Promise<void> {
    try {
      await this.admin.createTopics({
        topics: [{
          topic,
          numPartitions: partitions,
          replicationFactor,
        }],
      });
      this.logger.log(`Topic created: ${topic}`);
    } catch (error) {
      this.logger.error(`Failed to create topic: ${topic}`, error);
      throw error;
    }
  }

  // 获取主题列表
  async listTopics(): Promise<string[]> {
    try {
      const topics = await this.admin.listTopics();
      return topics;
    } catch (error) {
      this.logger.error('Failed to list topics', error);
      throw error;
    }
  }

  // 获取主题详情
  async describeTopic(topic: string): Promise<any> {
    try {
      const description = await this.admin.fetchTopicMetadata({ topics: [topic] });
      return description.topics[0];
    } catch (error) {
      this.logger.error(`Failed to describe topic: ${topic}`, error);
      throw error;
    }
  }

  // 删除主题
  async deleteTopic(topic: string): Promise<void> {
    try {
      await this.admin.deleteTopics({
        topics: [topic],
      });
      this.logger.log(`Topic deleted: ${topic}`);
    } catch (error) {
      this.logger.error(`Failed to delete topic: ${topic}`, error);
      throw error;
    }
  }

  // 获取消费者组信息
  async describeConsumerGroups(groupIds: string[]): Promise<any> {
    try {
      const result = await this.admin.describeGroups(groupIds);
      return result.groups;
    } catch (error) {
      this.logger.error('Failed to describe consumer groups', error);
      throw error;
    }
  }

  // 断开指定消费者
  async disconnectConsumer(groupId: string, topic: string): Promise<void> {
    const consumerKey = `${groupId}-${topic}`;
    const consumer = this.consumers.get(consumerKey);

    if (consumer) {
      await consumer.disconnect();
      this.consumers.delete(consumerKey);
      this.logger.log(`Consumer disconnected for group: ${groupId}, topic: ${topic}`);
    }
  }

  // 尝试解析 JSON
  private tryParseJson(str: string): any {
    try {
      return JSON.parse(str);
    } catch {
      return str;
    }
  }
}