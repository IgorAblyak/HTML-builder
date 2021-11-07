const path = require('path');
const fs = require('fs/promises');

const srcDirPath = path.join(__dirname, 'styles');
const destFilePath = path.join(__dirname, 'project-dist', 'bundle.css');

(async () => {
  try {
    const arrayStyles = [];
    const fileList = await fs.readdir(srcDirPath);
    fileList.map(file => {
      const withoutPointExt = path.extname(file).slice(1);
      fs.stat(path.join(srcDirPath, file)).then(res => {
        if (res.isFile() && withoutPointExt === 'css') {
          fs.readFile(path.join(srcDirPath, file), 'utf-8').then(res => {
            arrayStyles.push(res);
            fs.writeFile(destFilePath, arrayStyles.join(''));
          });
        }
      });
    });
  } catch (err) {
    console.log('Oops, error!' + '\n', err);
  }
})();