import { Injectable, OnApplicationShutdown } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Message } from "kafkajs";
import { IProducer } from "./producer/producer.interface";
import { KafkaJsProducer } from "./producer/kafkajs.producer";

@Injectable()
export class ProducerService implements OnApplicationShutdown {
  private readonly producers = new Map<string, IProducer>();

  constructor(private readonly configService: ConfigService) {}

  async produce(topic: string, message: Message) {
    const producer = await this.getProducer(topic);
    await producer.produce(message);
  }

  async getProducer(topic: string) {
    let producer = this.producers.get(topic);
    if (!producer) {
      producer = new KafkaJsProducer(topic, this.configService.get("KAFKA_BROKER"));
      await producer.connect();
      this.producers.set(topic, producer);
    }
    return producer;
  }

  async onApplicationShutdown(signal?: string) {
    for (let producer of this.producers.values()) {
      await producer.disconnect();
    }
  }
}
