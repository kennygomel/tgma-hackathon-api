import { Exclude } from "class-transformer";
import { BaseEntity } from "src/shared/entities/base.entity";
import { Column, Entity, Unique } from "typeorm";

@Entity()
@Unique("telegram_id", ["telegram_id"])
@Unique("email", ["email"])
@Unique("mobile", ["mobile"])
export class User extends BaseEntity {
  @Column()
  @Exclude()
  telegram_id: string;

  @Column({ type: "varchar", nullable: true, default: null })
  email?: string | null;

  @Column({ type: "varchar", nullable: true, default: null })
  mobile?: string | null;

  @Column({ default: false })
  email_confirmed: boolean;

  @Column({ type: "varchar", nullable: true })
  @Exclude()
  email_confirmation_token: string | null;

  @Column({ type: "timestamp with time zone", nullable: true })
  @Exclude()
  email_confirmation_token_expires_at?: Date | null;
}
