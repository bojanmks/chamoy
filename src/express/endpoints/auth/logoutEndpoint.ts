import { ActionResult, ActionResultStatus, Endpoint } from "../Endpoint";

import { destroyAuthSession } from "@modules/auth/discordAuth";

const logoutEndpoint: Endpoint = {
    method: 'post',
    route: '/auth/logout',
    async handler(req, res): Promise<ActionResult<void>> {
        await destroyAuthSession(req, res);

        return {
            status: ActionResultStatus.Success
        };
    }
};

export default logoutEndpoint;