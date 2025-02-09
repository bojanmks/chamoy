export const CURRENT_ENVIRONMENT = process.env.ENVIRONMENT_NAME;
export const PRODUCTION_ENVIRONMENT = 'Production';
export const DEVELOPMENT_ENVIRONMENT = 'Development';

export const isDevelopment = (): boolean => {
    return CURRENT_ENVIRONMENT === DEVELOPMENT_ENVIRONMENT;
}