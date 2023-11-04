import { Kafka } from "kafkajs";

export const KAFKA_BROKER = 'localhost:29092';
export const CONSUMER_GROUP_ID = 'my_nest_kafka_app';

export const USERS_TOPIC = 'users';

export class KafkaBase {
    protected readonly KAFKA_CLIENT_ID = 'nest-kafka-app';
    protected readonly kafka = new Kafka({
        clientId: this.KAFKA_CLIENT_ID,
        brokers: [KAFKA_BROKER]
    });
}