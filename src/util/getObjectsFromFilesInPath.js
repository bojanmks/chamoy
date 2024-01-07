const getAllFiles = require("@util/getAllFiles");


module.exports = (path) => {
    let objects = [];

    const files = getAllFiles(path);

    for (const file of files) {
        const obj = require(file);
        objects.push(obj);
    }

    return objects;
};