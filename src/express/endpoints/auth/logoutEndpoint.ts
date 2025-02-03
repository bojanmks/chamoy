import useAuthConstants from "@modules/auth/useAuthConstants";
import { Endpoint, ActionResult, ActionResultStatus } from "../Endpoint";
import { ApplicationUser } from "@modules/auth/models/ApplicationUser";
import useRefreshTokens from "@modules/auth/useRefreshTokens";

const { DISCORD_AUTH_COOKIE_KEY, REFRESH_TOKEN_COOKIE_KEY } = useAuthConstants();
const { deleteUsersRefreshToken } = useRefreshTokens();

const logoutEndpoint: Endpoint = {
    method: 'post',
    route: '/auth/logout',
    async handler(req, res): Promise<ActionResult<void>> {
        const userId = (req.user as ApplicationUser)?.id;

        if (userId) {
            await deleteUsersRefreshToken(userId);
        }

        await new Promise((resolve) => {
            req.session.destroy(() => {
                resolve({});
            });
        });

        res.clearCookie(DISCORD_AUTH_COOKIE_KEY);
        res.clearCookie(REFRESH_TOKEN_COOKIE_KEY);

        return {
            status: ActionResultStatus.Success
        };
    }
};

export default logoutEndpoint;