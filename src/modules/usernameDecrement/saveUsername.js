const fs = require('fs');
const path = require('path');

module.exports = (username) => {
    const filePath = path.join(__dirname, '..', '..', 'data', 'username.txt');
    fs.writeFileSync(filePath, username, 'utf-8');
};