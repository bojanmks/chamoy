import { getObjectsFromFilesInPath } from "@modules/files/files";
import path from "path";

export const getJobs = async () => {
    const jobsPath = path.join(__dirname, '..', '..', 'jobs');
    const jobs = await getObjectsFromFilesInPath(jobsPath);

    return jobs;
}