const CURRENT_ENVIRONMENT = process.env.ENVIRONMENT_NAME;
const PRODUCTION_ENVIRONMENT = 'Production';
const DEVELOPMENT_ENVIRONMENT = 'Development';

const isDevelopment = (): boolean => {
    return CURRENT_ENVIRONMENT === DEVELOPMENT_ENVIRONMENT;
}

export default () => {
    return {
        CURRENT_ENVIRONMENT,
        PRODUCTION_ENVIRONMENT,
        DEVELOPMENT_ENVIRONMENT,
        isDevelopment
    }
}