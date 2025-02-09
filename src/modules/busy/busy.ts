const busyServerIds: any = [];

export const isBusy = (serverId: any) => {
    return busyServerIds.includes(serverId);
}

export const setBusy = (serverId: any) => {
    if (isBusy(serverId)) {
        return;
    }

    busyServerIds.push(serverId);
}

export const setNotBusy = (serverId: any) => {
    if (!isBusy(serverId)) {
        return;
    }

    const serverIdIndex = busyServerIds.indexOf(serverId);
    busyServerIds.splice(serverIdIndex, 1);
}

export const toggleBusy = (serverId: any) => {
    if (isBusy(serverId)) {
        return setNotBusy(serverId);
    }

    setBusy(serverId);
}