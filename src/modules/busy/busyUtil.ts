const busyServerIds = [];

module.exports = {
    isBusy: function (serverId) {
        return busyServerIds.includes(serverId);
    },
    setBusy: function (serverId) {
        if (this.isBusy(serverId)) return;

        busyServerIds.push(serverId);
    },
    setNotBusy: function (serverId) {
        if (!this.isBusy(serverId)) return;

        const serverIdIndex = busyServerIds.indexOf(serverId);
        busyServerIds.splice(serverIdIndex, 1);
    },
    toggleBusy: function (serverId) {
        if (this.isBusy(serverId)) {
            return this.setNotBusy(serverId);
        }

        this.setBusy(serverId);
    }
};