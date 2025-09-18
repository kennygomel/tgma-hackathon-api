import { BaseEntity } from "src/shared/entities/base.entity";
import { Column, Entity, Unique } from "typeorm";

@Entity()
@Unique("telegram_id", ["telegram_id"])
export class User extends BaseEntity {
  @Column()
  telegram_id: string;
}
