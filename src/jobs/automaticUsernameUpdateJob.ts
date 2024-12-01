
import useEnvironments from "@modules/environments/useEnvironments";

const { PRODUCTION_ENVIRONMENT } = useEnvironments();

export default {
    name: 'Automatic username update',
    cronExpression: '0 0 * * *',
    environments: [PRODUCTION_ENVIRONMENT],
    deleted: true,
    callback: async (client: any) => {
        //
    }
};