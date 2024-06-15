module.exports = (client, activityName, activityType, status) => {
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