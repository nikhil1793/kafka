import { Injectable, OnApplicationShutdown, OnModuleInit } from "@nestjs/common";
import { Producer, ProducerRecord } from "kafkajs";
import { KafkaBase } from "./kafka.base";

@Injectable()
export class ProducerService extends KafkaBase implements OnModuleInit, OnApplicationShutdown {

    private readonly producer: Producer = this.kafka.producer();

    async onModuleInit() {
        await this.producer.connect();
    }

    async produce(record: ProducerRecord){
        await this.producer.send(record);
    }

    async onApplicationShutdown(signal?: string) {
        await this.producer.disconnect();
    }
}