import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Outbox } from "./entities/outbox.entity";
import { OutboxService } from "./outbox.service";

@Module({
  imports: [TypeOrmModule.forFeature([Outbox])],
  providers: [OutboxService],
  exports: [OutboxService],
})
export class OutboxModule {}
