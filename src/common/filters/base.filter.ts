import { SelectQueryBuilder } from 'typeorm';

export abstract class BaseFilter<Entity> {
  constructor(protected qb: SelectQueryBuilder<Entity>) {}

  /**
   * Apply filters based on provided query params
   */
  apply(filters: Record<string, any>): SelectQueryBuilder<Entity> {
    Object.keys(filters).forEach((key) => {
      const value = filters[key];
      const method = this[key];

      if (
        typeof method === 'function' &&
        value !== undefined &&
        value !== null
      ) {
        method.call(this, value);
      }
    });

    return this.qb;
  }
}
