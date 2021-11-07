const path = require('path');
const fs = require('fs/promises');

const srcDirPath = path.join(__dirname, 'files');
const destDirPath = path.join(__dirname, 'files-copy');

async function copyDir() {
  await fs.mkdir(destDirPath, { recursive: true } );
  const fileList = await fs.readdir(srcDirPath);
  fileList.map(file => {
    const srcFilePath = path.join(srcDirPath, file);
    const destFilePath = path.join(destDirPath, file);
    fs.copyFile(srcFilePath, destFilePath);
  });
}

async function main() {
  try {
    const dirExists = await fs.access(destDirPath)
      .catch(() => {
        copyDir();
      });
    if (!dirExists) {
      (await fs.readdir(destDirPath))
        .forEach(file => {
          const destFilePath = path.join(destDirPath, file);
          fs.unlink(destFilePath);
        });
    }
    copyDir();
    console.log('Files are copied!');
  } catch (err) {
    console.log('Something happend!' + '\n', err);
  }
}

main();