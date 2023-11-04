import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { async } from 'rxjs';
import { ConsumerService } from './kafka/consumer.service';
import { USERS_TOPIC } from './kafka/kafka.base';

@Injectable()
export class FirstConsumer implements OnModuleInit {
  private readonly logger = new Logger(FirstConsumer.name);
  constructor(private readonly consumerService: ConsumerService) {}

  async onModuleInit() {
    await this.consumerService.consume(
      {
        topics: [USERS_TOPIC],
      },
      {
        eachMessage: async ({ topic, partition, message }) => {
          this.logger.log({
            value: message.value.toString(),
            partition: partition.toString(),
            topic: topic,
          });
        },
      },
    );
  }
}
