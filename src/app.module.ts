import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaModule } from './kafka/kafka.module';
import { FirstConsumer } from './fisrt-consumer';
import { SecondConsumer } from './second-consumer';

@Module({
  imports: [KafkaModule],
  controllers: [AppController],
  providers: [AppService, FirstConsumer, SecondConsumer],
})
export class AppModule {}
