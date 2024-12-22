import { IEntity } from "@database/models/IEntity";
import { IRepository } from "@database/repositories/IRepository";

export interface ICommandParameterChoicesRepositoryOptions<TEntity extends IEntity> {
    repository: IRepository<TEntity>;
    choiceNameGetter: (entity: TEntity) => string;
    choiceValueGetter: (entity: TEntity) => any;
}