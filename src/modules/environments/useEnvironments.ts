const CURRENT_ENVIRONMENT = process.env.ENVIRONMENT_NAME;
const PRODUCTION_ENVIRONMENT = 'Production';
const DEVELOPMENT_ENVIRONMENT = 'Development';

export default () => {
    return {
        CURRENT_ENVIRONMENT,
        PRODUCTION_ENVIRONMENT,
        DEVELOPMENT_ENVIRONMENT
    }
}