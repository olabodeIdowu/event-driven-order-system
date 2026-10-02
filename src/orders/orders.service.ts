import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import { Order, OrderStatus } from "./entities/order.entity";
import { CreateOrderDto } from "./dto/create-order.dto";
import { OutboxService } from "../outbox/outbox.service";

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    private readonly dataSource: DataSource,
    private readonly outboxService: OutboxService,
  ) {}

  async create(dto: CreateOrderDto): Promise<Order> {
    return this.dataSource.transaction(async (manager) => {
      const order = manager.create(Order, {
        customerId: dto.customerId,
        status: OrderStatus.PENDING,
        items: dto.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      });

      const savedOrder = await manager.save(order);

      // Write to outbox in the SAME transaction
      await this.outboxService.createOutboxEvent(manager, {
        aggregateType: "order",
        aggregateId: savedOrder.id,
        eventType: "order.created",
        payload: {
          orderId: savedOrder.id,
          customerId: savedOrder.customerId,
          items: savedOrder.items,
        },
      });

      return savedOrder;
    });
  }

  async findOne(id: string) {
    return this.orderRepo.findOne({ where: { id }, relations: ["items"] });
  }
}
