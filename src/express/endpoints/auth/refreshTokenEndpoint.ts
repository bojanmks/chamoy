import { ActionResult, ActionResultStatus, Endpoint } from "../Endpoint";

import useAuthConstants from "@modules/auth/useAuthConstants";
import useRefreshTokens from "@modules/auth/useRefreshTokens";
import useUserSessionDataStore from "@modules/auth/useUserSessionDataStore";

const { REFRESH_TOKEN_COOKIE_KEY } = useAuthConstants();
const { findUserIdByRefreshToken } = useRefreshTokens();
const { findUserSessionDataByUserId } = useUserSessionDataStore();
const { makeRefreshToken, storeRefreshToken, setResponseRefreshTokenCookie } = useRefreshTokens();

const refreshTokenEndpoint: Endpoint = {
    method: 'post',
    route: '/auth/refresh',
    doNotAuthorize: true,
    async handler(req, res): Promise<ActionResult<void>> {
        const refreshToken: string | null = req.cookies ? req.cookies[REFRESH_TOKEN_COOKIE_KEY] : null;

        if (!refreshToken) {
            return {
                status: ActionResultStatus.Unauthorized
            }
        }

        const userId = await findUserIdByRefreshToken(refreshToken);

        if (!userId) {
            return {
                status: ActionResultStatus.Unauthorized
            }
        }

        const storedUserSessionData = await findUserSessionDataByUserId(userId);
        
        if (!storedUserSessionData) {
            return {
                status: ActionResultStatus.Unauthorized
            }
        }

        await new Promise(resolve => {
            req.session.regenerate((err) => {
                req.login(storedUserSessionData, () => {
                    resolve({});
                });
            });
        });

        const newRefreshToken = makeRefreshToken();

        await storeRefreshToken(userId, newRefreshToken);

        setResponseRefreshTokenCookie(res, newRefreshToken);

        return {
            status: ActionResultStatus.Success
        };
    }
};

export default refreshTokenEndpoint;