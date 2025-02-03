import { GameLink } from "./GameLink";
import { IEntity } from "@database/models/IEntity";
import { ISoftDeletableEntity } from "@database/models/ISoftDeletableEntity";

export interface Game extends IEntity, ISoftDeletableEntity {
    name: string;
    thumbnail: string;

    gameLinks?: GameLink[];
}