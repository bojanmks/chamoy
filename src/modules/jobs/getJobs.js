const path = require('path');
const getObjectsFromFilesInPath = require("@util/getObjectsFromFilesInPath");

module.exports = () => {
    const jobsPath = path.join(__dirname, '..', '..', 'jobs');
    const jobs = getObjectsFromFilesInPath(jobsPath);

    return jobs;
};