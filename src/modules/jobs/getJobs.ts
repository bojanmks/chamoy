import path from "path";
import getObjectsFromFilesInPath from "@util/getObjectsFromFilesInPath";

export default async () => {
    const jobsPath = path.join(__dirname, '..', '..', 'jobs');
    const jobs = await getObjectsFromFilesInPath(jobsPath);

    return jobs;
};;