import { ActionResult, ActionResultStatus, Endpoint } from "../Endpoint";

import useDiscordAuth from "@modules/auth/useDiscordAuth";

const { destroyAuthSession } = useDiscordAuth();

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