import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { KafkaMessage } from 'kafkajs';
import { ConsumerService } from './kafka/consumer.service';

@Injectable()
export class FirstConsumer implements OnModuleInit {
  private readonly logger = new Logger(FirstConsumer.name);
  constructor(private readonly consumerService: ConsumerService) {}

  async onModuleInit() {
    await this.consumerService.consume({
      topics: { topics: ['Users'] },
      config: { groupId: 'group-1' },
      onMessage: async (message: KafkaMessage) => {
        this.logger.log(message.value.toString());
      }
    });
  }
}
