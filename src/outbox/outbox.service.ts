import { Injectable } from "@nestjs/common";
import { EntityManager } from "typeorm";
import { Outbox } from "./entities/outbox.entity";

@Injectable()
export class OutboxService {
  async createOutboxEvent(
    manager: EntityManager,
    data: {
      aggregateType: string;
      aggregateId: string;
      eventType: string;
      payload: any;
    },
  ) {
    const event = manager.create(Outbox, {
      ...data,
      published: false,
    });
    return manager.save(event);
  }
}
