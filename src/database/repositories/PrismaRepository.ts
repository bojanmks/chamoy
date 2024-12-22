import { IEntity } from "@database/models/IEntity";
import { IRepository } from "./IRepository";

export class PrismaRepository<T extends IEntity> implements IRepository<T> {
  private model: any;
  private isSoftDeletable: boolean;

  constructor(model: any, isSoftDeletable: boolean = false) {
    this.model = model;
    this.isSoftDeletable = isSoftDeletable;
  }

  getAll(data?: { include?: { [K in keyof T]?: boolean } }): Promise<T[]> {
    return this.isSoftDeletable
      ? this.model.findMany({ where: { deleted: false }, include: data?.include })
      : this.model.findMany({ include: data?.include });
  }

  find(id: T["id"], data?: { include?: { [K in keyof T]?: boolean } }): Promise<T | null> {
    return this.model.findUnique({
      where: { id, deleted: this.isSoftDeletable ? false : undefined },
      include: data?.include
    });
  }

  insert(data: Omit<T, "id">): Promise<T> {
    return this.model.create({
      data
    });
  }

  update(id: T["id"], data: Partial<T>): Promise<T | null> {
    return this.model.update({
      where: { id },
      data: { ...data, updatedAt: new Date() }
    });
  }

  delete(id: T["id"]): Promise<void> {
    if (this.isSoftDeletable) {
      return this.model.update({
        where: { id },
        data: { deleted: true, updatedAt: new Date() }
      });
    }

    return this.model.delete({
      where: { id }
    });
  }
}