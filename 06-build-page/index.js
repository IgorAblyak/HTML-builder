const path = require('path');
const fs = require('fs/promises');

const projectDirPath = path.join(__dirname, 'project-dist');
const templateFilePath = path.join(__dirname, 'template.html');
const stylesDirPath = path.join(__dirname, 'styles');
const componentsPath = path.join(__dirname, 'components');
const assetsDirPath = path.join(__dirname, 'assets');
const projectAssetsPath = path.join(projectDirPath, 'assets');

async function createDir(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true } );
  } catch (err) {
    console.log('Project directory do not create!' + '\n', err);
  }
}

async function readTemplate(path) {
  try {
    const temp = await fs.readFile(path, 'utf-8');
    return temp;
  } catch (err) {
    console.log ('Can not read template file!' + '\n', err);
  }
}
 
async function getPath(getPath, name) {
  try {
    const pathToFile = path.join(getPath, name);
    return pathToFile;
  } catch (err) {
    console.log ('Can not give a path!' + '\n', err);
  }
}

async function getFileHtmlPath(getPath, file) {
  try {
    const pathToFile = path.join(getPath, `${file}.html`);
    return pathToFile;
  } catch (err) {
    console.log ('Can not give html path!' + '\n', err);
  }
}

async function getFileCssPath(getPath, file) {
  try {
    if (path.extname(file).slice(1) !== 'css') {
      const pathToFile = path.join(getPath, `${file}.css`);
      return pathToFile;
    }
    const pathToFile = path.join(getPath, file);
    return pathToFile;
  } catch (err) {
    console.log ('Can not give css path!' + '\n', err);
  }
}

async function mergeStyles() {
  try {
    const arrayStyles = [];
    const fileList = await fs.readdir(stylesDirPath);
    fileList.map(async file => {
      const withoutPointExt = path.extname(file).slice(1);
      const styleFilesPath = await getFileCssPath(stylesDirPath, file);
      const bundleCssPath = await getFileCssPath(projectDirPath, 'style');
      fs.stat(styleFilesPath).then(res => {
        if (res.isFile() && withoutPointExt === 'css') {
          fs.readFile(styleFilesPath, 'utf-8').then(res => {
            arrayStyles.push(res);
            fs.writeFile(bundleCssPath, arrayStyles.join(''));
          });
        }
      });
    });
  } catch (err) {
    console.log('Oops, error!' + '\n', err);
  }
}
  
async function replaceTag() {
  try {
    let contentTemp = await readTemplate(templateFilePath);
    const tagName = contentTemp.match(/{{\w+}}/g);
    createDir(projectDirPath);
    tagName.forEach(async (item) => {
      const name = item.match(/\w+/g);
      const componentFilePath = await getFileHtmlPath(componentsPath, name);
      const contentComponent = await readTemplate(componentFilePath);
      contentTemp = contentTemp.replace(item, contentComponent);
      const bundleFilePath = await getFileHtmlPath(projectDirPath, 'index');
      fs.writeFile(bundleFilePath, contentTemp);
    });
  } catch (err) {
    console.log('Error with tags!' + '\n', err);
  }
}

async function copyProcess(projectAssetsPath, assetsPath = assetsDirPath) {
  try {
    await fs.mkdir(projectAssetsPath, { recursive: true } );
    const fileList = await fs.readdir(assetsPath);
    fileList.map(async file => {
      const assetsSrcFilePath = await getPath(assetsPath, file);
      const assetsDestFilePath = await getPath(projectAssetsPath, file);
      const smthExist = await fs.stat(assetsSrcFilePath);
      if (smthExist.isDirectory()) {
        copyProcess(assetsDestFilePath, assetsSrcFilePath);
      } else if (smthExist.isFile()) {
        fs.copyFile(assetsSrcFilePath, assetsDestFilePath);
      }
    });
  } catch (err) {
    console.log('Oops, copy error!' + '\n', err);
  }
}

async function copyAssets(assetsPath = projectAssetsPath) {
  try {
    await fs.access(projectAssetsPath)
      .catch(() => {
        console.log('Create assets!');
        copyProcess(projectAssetsPath);
      });
    const fileList = await fs.readdir(assetsPath);
    fileList.forEach(async file => {
      const assetsFilePath =  await getPath(assetsPath, file);
      const dirExists = await fs.stat(assetsFilePath);
      if (dirExists.isDirectory() && fileList !== []) {
        copyAssets(assetsFilePath);
      } else if (dirExists.isFile())
        fs.unlink(assetsFilePath);
    });
    copyProcess(projectAssetsPath);
  } catch (err) {
    if (err.code == 'ENOENT') {
      console.log('');
    }
  }
}

replaceTag();
mergeStyles();
copyAssets();