import fs from "fs";
import path from "path";

export default (directory: any, foldersOnly = false) => {
    let fileNames = [];

    const files = fs.readdirSync(directory, { withFileTypes: true });

    for (const file of files) {
        const filePath = path.join(directory, file.name);

        if (foldersOnly) {
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
};