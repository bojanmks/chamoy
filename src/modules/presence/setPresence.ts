export default (client: any, activityName: any, activityType: any, status: any) => {
    client.user.setPresence({
        activities: [
            {
                name: activityName,
                type: activityType
            }
        ],
        status: status
    });
};