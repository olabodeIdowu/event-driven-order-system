import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrdersModule } from "./orders/orders.module";
import { InventoryModule } from "./inventory/inventory.module";
import { OutboxModule } from "./outbox/outbox.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.POSTGRES_HOST || "localhost",
      port: parseInt(process.env.POSTGRES_PORT || "5432", 10),
      username: process.env.POSTGRES_USER || "postgres",
      password: process.env.POSTGRES_PASSWORD || "postgres",
      database: process.env.POSTGRES_DB || "orders_db",
      autoLoadEntities: true,
      synchronize: true, // disable in production
    }),
    OrdersModule,
    InventoryModule,
    OutboxModule,
  ],
})
export class AppModule {}
