import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Inventory } from "./entities/inventory.entity";

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepo: Repository<Inventory>,
  ) {}

  async reserve(productId: string, quantity: number): Promise<boolean> {
    const item = await this.inventoryRepo.findOne({ where: { productId } });
    if (!item || item.available < quantity) {
      return false;
    }

    item.available -= quantity;
    await this.inventoryRepo.save(item);
    return true;
  }
}
