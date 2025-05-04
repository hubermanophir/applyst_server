export abstract class Base<T> {
  abstract getById(
    id: string,
    user_id?: number,
    options?: { select?: Partial<Record<keyof T, boolean>> }
  ): Promise<T>;
  abstract getMany(
    filter: Partial<T>,
    options?: {
      select?: Partial<Record<keyof T, boolean>>;
      take?: number;
      skip?: number;
    }
  ): Promise<T[]>;
  abstract update(id: string, data: Partial<T>): Promise<T>;
  abstract delete(id: string, user_id?: number): Promise<T>;
  abstract create(data: Partial<T>): Promise<T>;
}
