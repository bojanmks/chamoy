module.exports = (path) => {
    const startIndex = path.lastIndexOf("\\") + 1;
    return path.substring(startIndex);
}