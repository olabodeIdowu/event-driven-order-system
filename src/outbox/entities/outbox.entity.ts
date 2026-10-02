import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("outbox")
export class Outbox {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  aggregateType: string;

  @Column()
  aggregateId: string;

  @Column()
  eventType: string;

  @Column({ type: "jsonb" })
  payload: any;

  @Column({ default: false })
  published: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
