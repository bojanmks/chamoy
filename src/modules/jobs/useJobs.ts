import path from "path";
import useFiles from "@modules/files/useFiles";

const { getObjectsFromFilesInPath } = useFiles();

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