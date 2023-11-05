import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { KafkaMessage } from "kafkajs";
import { ConsumerService } from "./kafka/consumer.service";

@Injectable()
export class SecondConsumer implements OnModuleInit {
  private readonly logger = new Logger(SecondConsumer.name);
  constructor(private readonly consumerService: ConsumerService) {}

  async onModuleInit() {
    await this.consumerService.consume({
      topics: { topics: ["Users"] },
      config: { groupId: "group-2" },
      onMessage: async (message: KafkaMessage) => {
        this.logger.log(message.value.toString());
      },
    });
  }
}
