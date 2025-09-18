import { ObjectLiteral, Repository, UpdateResult } from "typeorm";
import { from, map, Observable, switchMap } from "rxjs";
import { FindOptionsWhere } from "typeorm/find-options/FindOptionsWhere";
import { FindManyOptions } from "typeorm/find-options/FindManyOptions";
import { DeepPartial } from "typeorm/common/DeepPartial";
import { FindOneOptions } from "typeorm/find-options/FindOneOptions";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { FindOptionsOrder } from "typeorm/find-options/FindOptionsOrder";

export abstract class BaseService<T extends ObjectLiteral> {
  protected entity: any;
  protected defaultOrder: FindOptionsOrder<T>;
  protected repository: Repository<T>;
  protected searchFieldNames = ["name"];
  protected itemCacheTimeout = 1800000;
  protected listCacheTimeout = 600000;
  protected searchCacheTimeout = 1800000;

  protected isCacheEnabled: boolean;

  constructor() {
    this.isCacheEnabled = process.env.CACHE === "true";
  }

  create(data: DeepPartial<T>): Observable<T> {
    return from(this.repository.save(data)) as Observable<T>;
  }

  updateOne(
    where: FindOptionsWhere<T>,
    data: QueryDeepPartialEntity<T>,
  ): Observable<T | null> {
    return from(this.repository.update(where, data)).pipe(
      switchMap(() => this.findOne({ where })),
    );
  }

  update(
    conditions: FindOptionsWhere<T>,
    data: QueryDeepPartialEntity<T>,
  ): Observable<number | undefined> {
    return from(this.repository.update(conditions, data)).pipe(
      map((result: UpdateResult) => result.affected),
    );
  }

  findOne(conditions: FindOneOptions<T>): Observable<T | null> {
    return from(
      this.repository.findOne({
        ...conditions,
        ...(this.isCacheEnabled && { cache: this.itemCacheTimeout }),
      }),
    );
  }

  find(args: FindManyOptions<T>): Observable<T[]> {
    const { order: argsOrder, ...restArgs } = args;
    const order = argsOrder || this.defaultOrder || null;

    return from(
      this.repository.find({
        ...(order && { order }),
        ...restArgs,
        ...(this.isCacheEnabled && { cache: this.listCacheTimeout }),
      }),
    );
  }

  count(args: FindManyOptions<T>): Observable<number> {
    const { order: argsOrder, ...restArgs } = args;
    const order = argsOrder || this.defaultOrder || null;

    return from(
      this.repository.count({
        ...(this.isCacheEnabled && { cache: this.listCacheTimeout }),
        ...(order && { order }),
        ...restArgs,
      }),
    );
  }

  delete(
    conditions: FindOptionsWhere<T>,
  ): Observable<number | null | undefined> {
    return from(this.repository.delete(conditions)).pipe(
      map((result) => result.affected),
    );
  }

  remove(entities: T[]): Observable<number> {
    return from(this.repository.remove(entities)).pipe(
      map((removedEntities: T[]) => removedEntities.length),
    );
  }
}
