import fs from 'fs';
import path from 'path';

export default (username: any) => {
    const filePath = path.join(__dirname, '..', '..', 'assets', 'data', 'username.txt');
    fs.writeFileSync(filePath, username, 'utf-8');
};