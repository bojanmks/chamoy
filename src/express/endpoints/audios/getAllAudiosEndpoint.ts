import { ActionResult, ActionResultStatus, Endpoint } from "../Endpoint"

import { Audio } from "@modules/audio/models/Audio"
import { audioRepository } from "@database/repositories/repositories";

const getAllAudiosEndpoint: Endpoint = {
    method: 'get',
    route: '/audios',
    async handler(req): Promise<ActionResult<Audio[]>> {
        const result = await audioRepository.getAll();

        return {
            status: ActionResultStatus.Success,
            result
        };
    },
};

export default getAllAudiosEndpoint;