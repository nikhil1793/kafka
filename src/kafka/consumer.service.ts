import { Injectable, OnApplicationShutdown } from "@nestjs/common";
import { Consumer, ConsumerRunConfig, ConsumerSubscribeTopics } from "kafkajs";
import { CONSUMER_GROUP_ID, KafkaBase } from "./kafka.base";

@Injectable()
export class ConsumerService extends KafkaBase implements OnApplicationShutdown {
    private readonly consumers: Consumer[] = [];

    async consume(topic: ConsumerSubscribeTopics, config: ConsumerRunConfig) {
        const _consumer = this.kafka.consumer({
            groupId: CONSUMER_GROUP_ID,
        });

        await _consumer.connect();
        await _consumer.subscribe(topic);
        await _consumer.run(config);
        this.consumers.push(_consumer);
    }

    async onApplicationShutdown(signal?: string) {
        for(let _consumer of this.consumers){
            await _consumer.disconnect();
        }
    }
}