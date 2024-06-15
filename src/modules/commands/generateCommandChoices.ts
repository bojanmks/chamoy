module.exports = (data) => {
    return data.filter(x => !x.deleted).map(x => ({
        name: x.name,
        value: x.id
    }));
};