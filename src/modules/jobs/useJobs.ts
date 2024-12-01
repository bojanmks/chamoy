import path from "path";
import getObjectsFromFilesInPath from "@util/getObjectsFromFilesInPath";

const getJobs = async () => {
    const jobsPath = path.join(__dirname, '..', '..', 'jobs');
    const jobs = await getObjectsFromFilesInPath(jobsPath);

    return jobs;
}

export default () => {
    return {
        getJobs
    }
}