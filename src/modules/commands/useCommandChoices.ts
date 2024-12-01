const makeCommandChoices = (data: any) => {
    return data.filter((x: any) => !x.deleted).map((x: any) => ({
        name: x.name,
        value: x.id
    }));
}

export default () => {
    return {
        makeCommandChoices
    }
}