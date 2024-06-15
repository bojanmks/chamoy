const fs = require('fs');
const path = require('path');

module.exports = () => {
    const filePath = path.join(__dirname, '..', '..', 'assets', 'data', 'username.txt');
    let usernameBuffer = fs.readFileSync(filePath);
    username = usernameBuffer.toString();

    return username;
};