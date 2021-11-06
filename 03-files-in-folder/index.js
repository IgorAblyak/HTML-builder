const path = require('path');
const fs = require('fs/promises');

const dirPath = path.join(__dirname, 'secret-folder');

(async () => {
  try {
    const fileList = await fs.readdir(dirPath);
    fileList.map(file => {
      const pathToFile = path.join(dirPath, file);
      fs.stat(pathToFile).then((res)=> {
        const ext = path.extname(file);
        const withoutPointExt = path.extname(file).slice(1);
        const transformSize = (res.size / 1024).toFixed(3);
        if (res.isFile()) {
          console.log(
            path.basename(file, ext) + ' - ' + withoutPointExt + ' - ' + transformSize + ' kb'
          );
        } else {
          fs.unlink(pathToFile);
        }
      });
    });
  } catch (err) {
    console.log('Oops! Something happend!' + '\n', err.message);
  }
})();