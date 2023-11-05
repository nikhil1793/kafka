import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaModule } from './kafka/kafka.module';
import { FirstConsumer } from './fisrt-consumer';
import { SecondConsumer } from './second-consumer';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [KafkaModule, ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController],
  providers: [AppService, FirstConsumer, SecondConsumer],
})
export class AppModule {}
