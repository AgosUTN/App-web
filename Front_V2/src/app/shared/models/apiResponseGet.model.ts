export interface ApiResponseGet<T> {
  message: string;
  data: T;
}

export interface ApiResponseGetByPage<T> {
  message: string;
  data: T;
  total: number;
}

export interface PagedResult<T> {
  data: T;
  total: number;
}

// Es necesario el PagedResult porque el componente solo debe recibir lo que va a usar.

export interface apiResponseGetById<T> {
  message: string;
  data: T;
}
