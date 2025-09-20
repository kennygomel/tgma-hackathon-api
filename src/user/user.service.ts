import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { from, Observable } from "rxjs";
import { BaseService } from "src/shared/services/base.service";
import { User } from "src/user/entities/user.entity";
import { FindOptionsOrderValue, MoreThan, Repository } from "typeorm";
import { FindOneOptions } from "typeorm/find-options/FindOneOptions";

@Injectable()
export class UserService extends BaseService<User> {
  defaultOrder = { id: "DESC" as FindOptionsOrderValue };
  entity = User;
  itemCacheTimeout = 0;
  listCacheTimeout = 0;
  searchCacheTimeout = 0;

  constructor(
    @InjectRepository(User)
    protected repository: Repository<User>,
  ) {
    super();
  }

  findByTelegramId(telegram_id: string): Observable<User | null> {
    return from(
      this.repository.findOne({
        where: { telegram_id: telegram_id },
        ...(this.isCacheEnabled && { cache: this.itemCacheTimeout }),
      }),
    );
  }

  findByEmailConfirmationToken(
    email_confirmation_token: string,
  ): Observable<User | null> {
    return from(
      this.repository.findOne({
        where: {
          email_confirmation_token,
          email_confirmation_token_expires_at: MoreThan(new Date()),
        },
        ...(this.isCacheEnabled && { cache: this.itemCacheTimeout }),
      }),
    );
  }
}
