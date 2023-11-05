import { Injectable, OnApplicationShutdown } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IConsumer } from "./consumer/consumer.interface";
import { KafkaJsConsumer } from "./consumer/kafkajs.consumer";
import { IConsumerOptions } from "./consumer/kafkajs.consumer-options.interface";

@Injectable()
export class ConsumerService implements OnApplicationShutdown {
  private readonly consumers: IConsumer[] = [];

  constructor(private readonly configService: ConfigService) {}

  async consume({ topics, config, onMessage }: IConsumerOptions) {
    const consumer = new KafkaJsConsumer(topics, config, this.configService.get<string>("KAFKA_BROKER"));
    await consumer.connect();
    await consumer.consume(onMessage);
    this.consumers.push(consumer);
  }

  async onApplicationShutdown(signal?: string) {
    for (let _consumer of this.consumers) {
      await _consumer.disconnect();
    }
  }
}
