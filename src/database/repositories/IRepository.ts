import { IEntity } from "@database/models/IEntity";

export interface IRepository<T extends IEntity> {
    getAll(data?: { include?: { [K in keyof T]?: boolean } }): Promise<T[]>;
    find(id: T["id"], data?: { include?: { [K in keyof T]?: boolean } }): Promise<T | null>;
    insert(data: Omit<T, "id">): Promise<T>;
    update(id: number, data: Partial<T>): Promise<T | null>;
    delete(id: number): Promise<void>;
}