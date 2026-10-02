import { Entity, PrimaryColumn, Column, VersionColumn } from "typeorm";

@Entity("inventory")
export class Inventory {
  @PrimaryColumn()
  productId: string;

  @Column("int")
  available: number;

  @VersionColumn()
  version: number; // optimistic locking
}
