import fs from "fs";
import path from "path";

export default () => {
    const filePath = path.join(__dirname, '..', '..', 'assets', 'data', 'username.txt');
    let usernameBuffer = fs.readFileSync(filePath);
    const username = usernameBuffer.toString();

    return username;
};;