require('dotenv').config();

module.exports = {
    CURRENT_ENVIRONMENT: process.env.ENVIRONMENT_NAME,
    PRODUCTION_ENVIRONMENT: 'Production',
    DEVELOPMENT_ENVIRONMENT: 'Development'
};