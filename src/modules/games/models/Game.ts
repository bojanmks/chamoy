import { IEntity } from "@database/models/IEntity";
import { ISoftDeletableEntity } from "@database/models/ISoftDeletableEntity";
import { GameLink } from "@prisma/client";

export interface Game extends IEntity, ISoftDeletableEntity {
    name: string;
    thumbnail: string;

    gameLinks?: GameLink[];
}