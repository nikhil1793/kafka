import { Controller, Get } from '@nestjs/common';
import { USERS_TOPIC } from './kafka/kafka.base';
import { ProducerService } from './kafka/producer.service';

@Controller()
export class AppController {
  constructor(private readonly producerService: ProducerService) {}

  @Get()
  async getHello() {
    await this.producerService.produce({
      topic: USERS_TOPIC,
      messages: [
        {
          value: 'Hello World!!!'
        }
      ]
    });
    return 'Hello World!!';
  }
}
