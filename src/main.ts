import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Kafka microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: "order-system",
        brokers: (process.env.KAFKA_BROKERS || "localhost:9092").split(","),
      },
      consumer: {
        groupId: "order-consumer-group",
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 3000);

  console.log(
    `🚀 Order system running on http://localhost:${process.env.PORT || 3000}`,
  );
}
bootstrap();
