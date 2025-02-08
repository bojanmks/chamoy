import { ActionResult, ActionResultStatus, Endpoint } from "../Endpoint";

import { Game } from "@modules/games/models/Game";
import useRepositories from "@database/repositories/useRepositories";

const { gamesRepository } = useRepositories();

const getAllGamesEndpoint: Endpoint = {
    method: 'get',
    route: '/games',
    async handler(req): Promise<ActionResult<Game[]>> {
        const result = (await gamesRepository.getAll({ include: { gameLinks: true } })).sort((a, b) => a.id - b.id);

        result.forEach(game => {
            game.gameLinks = game.gameLinks?.sort((a, b) => a.id - b.id);
        });

        return {
            status: ActionResultStatus.Success,
            result
        };
    }
};

export default getAllGamesEndpoint;