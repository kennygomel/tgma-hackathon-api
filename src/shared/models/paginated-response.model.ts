export abstract class PaginatedResponse<T> {
  success: boolean;
  data: T;
  pagination?: {
    offset: number;
    limit: number;
    total: number;
  };
  count?: number;
}
