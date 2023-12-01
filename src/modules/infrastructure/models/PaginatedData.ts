export interface PaginatedData<T> {
  page: number;
  perPage: number;
  data: T[];
  total: number;
}
