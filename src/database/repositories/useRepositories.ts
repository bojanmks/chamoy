import { PrismaClient } from "@prisma/client"
import { PrismaRepository } from "./PrismaRepository";
import { Audio } from "@modules/audio/models/Audio"
import { Game } from "@modules/games/models/Game";
import { GameLink } from "@modules/games/models/GameLink";

const prisma = new PrismaClient();

const audioRepository = new PrismaRepository<Audio>(prisma.audio);
const gamesRepository = new PrismaRepository<Game>(prisma.game, true);
const gameLinksRepository = new PrismaRepository<GameLink>(prisma.gameLink, true);

export default () => {
    return {
        audioRepository,
        gamesRepository,
        gameLinksRepository
    }
}