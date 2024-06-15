const busyServerIds: any = [];

export default {
    isBusy: function (serverId: any) {
        return busyServerIds.includes(serverId);
    },
    setBusy: function (serverId: any) {
        if (this.isBusy(serverId)) return;

        busyServerIds.push(serverId);
    },
    setNotBusy: function (serverId: any) {
        if (!this.isBusy(serverId)) return;

        const serverIdIndex = busyServerIds.indexOf(serverId);
        busyServerIds.splice(serverIdIndex, 1);
    },
    toggleBusy: function (serverId: any) {
        if (this.isBusy(serverId)) {
            return this.setNotBusy(serverId);
        }

        this.setBusy(serverId);
    }
};