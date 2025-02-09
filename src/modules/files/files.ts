import fs from "fs";
import path from "path";

export const getContentsOfDirectory = (directory: any, folders = false) => {
    let fileNames = [];

    const files = fs.readdirSync(directory, { withFileTypes: true });

    for (const file of files) {
        const filePath = path.join(directory, file.name);

        if (folders) {
            if (file.isDirectory()) {
                fileNames.push(filePath);
            }

            continue;
        }

        if (file.isFile()) {
            fileNames.push(filePath);
        }
    }

    return fileNames;
}

export const getObjectsFromFilesInPath = async (path: any) => {
    let objects = [];

    const files = getContentsOfDirectory(path);

    for (const file of files) {
        const obj = (await import(file)).default;
        objects.push(obj);
    }

    return objects;
}