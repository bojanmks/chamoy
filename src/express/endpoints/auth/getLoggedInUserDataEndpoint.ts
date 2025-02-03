import { Endpoint, ActionResult, ActionResultStatus } from "../Endpoint";

const getLoggedInUserDataEndpoint: Endpoint = {
    method: 'get',
    route: '/auth/user-data',
    async handler(req): Promise<ActionResult<any>> {
        return {
            status: ActionResultStatus.Success,
            result: req.user
        };
    },
};

export default getLoggedInUserDataEndpoint;