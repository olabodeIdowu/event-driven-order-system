import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Order } from "./order.entity";

@Entity("order_items")
export class OrderItem {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  productId: string;

  @Column("int")
  quantity: number;

  @ManyToOne(() => Order, (order) => order.items)
  order: Order;
}
