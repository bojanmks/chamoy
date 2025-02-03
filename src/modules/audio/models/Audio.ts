import { IEntity } from "@database/models/IEntity";

export interface Audio extends IEntity {
    name: string;
    filePath: string;
}