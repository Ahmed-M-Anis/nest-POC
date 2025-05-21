export class PaginatedResponse<T> {
  items: T[];
  private page: number;
  private limit: number;
  private totalCount: number;

  constructor(items: T[], page: number, limit: number, totalCount: number) {
    this.items = items;
    this.page = page;
    this.limit = limit;
    this.totalCount = totalCount;
  }

  getMeta() {
    return {
      page: this.page,
      limit: this.limit,
      totalCount: this.totalCount,
      totalPages: Math.ceil(this.totalCount / this.limit),
      hasNextPage: this.page * this.limit < this.totalCount,
      hasPreviousPage: this.page > 1,
    };
  }
}
