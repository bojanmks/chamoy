import { ActionResult, ActionResultStatus, Endpoint } from "../Endpoint";
import { findUserIdByRefreshToken, makeRefreshToken, setResponseRefreshTokenCookie, storeRefreshToken } from "@modules/auth/refreshTokens";

import { REFRESH_TOKEN_COOKIE_KEY } from "@modules/auth/constants/authConstants";
import { findUserSessionDataByUserId } from "@modules/auth/userSessionDataStore";

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