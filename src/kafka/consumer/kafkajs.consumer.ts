import { Logger } from "@nestjs/common";
import { Consumer, ConsumerConfig, ConsumerSubscribeTopics, Kafka, KafkaMessage } from "kafkajs";
import { sleep } from "../util/sleep";
import { IConsumer } from "./consumer.interface";
import * as retry from "async-retry";

export class KafkaJsConsumer implements IConsumer {
  private readonly kafka: Kafka;
  private readonly consumer: Consumer;
  private readonly logger: Logger;

  constructor(
    private readonly topics: ConsumerSubscribeTopics,
    config: ConsumerConfig,
    broker: string
  ) {
    this.kafka = new Kafka({
      clientId: "client_id_1",
      brokers: [broker],
    });
    this.consumer = this.kafka.consumer(config);
    this.logger = new Logger(`${topics.topics}-${config.groupId}`);
  }

  async connect() {
    try {
      await this.consumer.connect();
    } catch (error) {
      this.logger.error("Failed to connect to kafka", error);
      await sleep(5000);
      await this.connect();
    }
  }

  async disconnect() {
    await this.consumer.disconnect();
  }

  async consume(onMessage: (message: KafkaMessage) => Promise<void>) {
    await this.consumer.subscribe(this.topics);
    await this.consumer.run({
      eachMessage: async ({ message, partition }) => {
        this.logger.debug(`Processing partition : ${partition}`);
        try {
          await retry(async () => onMessage(message), {
            retries: 3,
            onRetry: (error, attempt) => {
              this.logger.error(`Error consuming message, executig retry ${attempt}`, error);
            },
          });
        } catch (error) {
          this.logger.error(`Error consuming message, adding to Dead Letter Queue - Database`, error);
        }
      },
    });
  }
}
