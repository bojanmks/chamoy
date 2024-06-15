import getAllFiles from "@util/getAllFiles";

export default async (path: any) => {
    let objects = [];

    const files = getAllFiles(path);

    for (const file of files) {
        const obj = (await import(file)).default;
        objects.push(obj);
    }

    return objects;
};