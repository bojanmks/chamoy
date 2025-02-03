import { IEntity } from "@database/models/IEntity";
import { ISoftDeletableEntity } from "@database/models/ISoftDeletableEntity";
import { Game } from "@prisma/client";

export interface GameLink extends IEntity, ISoftDeletableEntity {
    name: string;
    link: string;

    game?: Game;
}