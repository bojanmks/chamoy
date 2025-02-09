import { Audio } from "@modules/audio/models/Audio"
import { Game } from "@modules/games/models/Game";
import { GameLink } from "@modules/games/models/GameLink";
import { PrismaClient } from "@prisma/client"
import { PrismaRepository } from "./PrismaRepository";

const prisma = new PrismaClient();

export const audioRepository = new PrismaRepository<Audio>(prisma.audio);
export const gamesRepository = new PrismaRepository<Game>(prisma.game, true);
export const gameLinksRepository = new PrismaRepository<GameLink>(prisma.gameLink, true);