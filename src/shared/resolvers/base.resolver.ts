import {
  And,
  Between,
  IsNull,
  LessThanOrEqual,
  MoreThanOrEqual,
  Not,
} from "typeorm";
import { FindOptionsWhere } from "typeorm/find-options/FindOptionsWhere";

export abstract class BaseResolver<T> {
  generateFromTo(fieldName: string, from: any, to: any): FindOptionsWhere<T> {
    let result = {};

    if (!!from && !!to)
      result = { [fieldName]: And(Not(IsNull()), Between(from, to)) };

    if (!!from && !to)
      result = { [fieldName]: And(Not(IsNull()), MoreThanOrEqual(from)) };

    if (!from && !!to)
      result = { [fieldName]: And(Not(IsNull()), LessThanOrEqual(to)) };

    return result;
  }
}
