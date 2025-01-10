export interface Repository<T> {
  findAll(): Promise<T[]>; // En el futuro, pensar en hidratar siempre y hacer paginación.
  findOne(item: { id: string }): Promise<T | undefined>;
  add(item: T): Promise<T | undefined>;
  update(id: string, item: T): Promise<T | undefined>;
  delete(item: { id: string }): Promise<T | undefined>;
}
