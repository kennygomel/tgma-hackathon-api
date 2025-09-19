import { User } from "src/user/entities/user.entity";

export type AuthUser = Pick<User, "id" | "telegram_id">;
