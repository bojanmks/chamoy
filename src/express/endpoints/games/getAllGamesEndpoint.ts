import useRepositories from "@database/repositories/useRepositories";
import { Endpoint, ActionResult, ActionResultStatus } from "../Endpoint";
import { Game } from "@modules/games/models/Game";

const { gamesRepository } = useRepositories();

const getAllGamesEndpoint: Endpoint = {
    method: 'get',
    route: '/games',
    async handler(req): Promise<ActionResult<Game[]>> {
        const result = await gamesRepository.getAll({ include: { gameLinks: true } });

        return {
            status: ActionResultStatus.Success,
            result
        };
    }
};

export default getAllGamesEndpoint;