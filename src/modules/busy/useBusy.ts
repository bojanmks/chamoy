const busyServerIds: any = [];

const isBusy = (serverId: any) => {
    return busyServerIds.includes(serverId);
}

const setBusy = (serverId: any) => {
    if (isBusy(serverId)) {
        return;
    }

    busyServerIds.push(serverId);
}

const setNotBusy = (serverId: any) => {
    if (!isBusy(serverId)) {
        return;
    }

    const serverIdIndex = busyServerIds.indexOf(serverId);
    busyServerIds.splice(serverIdIndex, 1);
}

const toggleBusy = (serverId: any) => {
    if (isBusy(serverId)) {
        return setNotBusy(serverId);
    }

    setBusy(serverId);
}

export default () => {
    return {
        isBusy,
        setBusy,
        setNotBusy,
        toggleBusy
    }
}