export interface ApiResponseGetAll<T> {
  message: string;
  data: T[];
}
export interface ApiResponseGetOne<T> {
  message: string;
  data: T;
}
