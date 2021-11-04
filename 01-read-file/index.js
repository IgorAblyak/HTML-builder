const path = require('path');
const fs = require('fs');
const { stdout } = require('process');

const filePath = path.join(__dirname, 'text.txt');

let readableStream = fs.createReadStream(filePath, 'utf-8');

readableStream.on('data', (data) => {
  stdout.write(data.trim());
});