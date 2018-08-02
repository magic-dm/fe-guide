/* eslint-disable */
const path = require('path');
const webpack = require('webpack');
const color = require('chalk');
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const resolve = require('resolve');
const chokidar = require('chokidar');
const fs = require('fs-extra');
const readline = require('readline');

const {
  readFileSync: readS,
  readdirSync,
  copy,
  writeFile: write,
  statSync: statS,
  removeSync: removeS,
} = fs;

const {
  CONST,
  Cach,
  isProd,
  isDev,
  logStart,
  logEnd,
  uglify,
  minImage,
  searchFiles,
  compressFile,
  ensureRunFunc,
  clearConsole,
  babelTransform,
  babelTraverse,
  babelGenerator,
  catchError,
  getWebpackCssConfig,
  replaceSlash,
  keys,
  getSuffix,
  fixWavy,
  getPathBack,
} = require('./utils');

const {
  SRC,
  DIR,
  DEST,
} = CONST;

let initial = false;

const jsRe = /\.js$/;
const npmPrefixRe = /^[~_@a-zA-Z]/;
const fileNameRe = /\/([^\/]+)$/;

Cach.init('node_modules');
const absoluteSrcPath = path.join(__dirname, '../', `${SRC}`);
const absoluteDestPath = path.join(__dirname, '../', `${DEST}`);
const absoluteDestNpmPath = path.join(__dirname, '../', `${DEST}/npm`);
const getRelativeFilePath = (src, prefix) => replaceSlash(src.replace(`${prefix}/`, ''));

const traversePathCode = (
  nodeModulePath = '',
  npmPath = '',
  dest = absoluteDestNpmPath,
) => (wxTraverse(babelTransform(readS(npmPath)).ast, npmPath, dest, {
  nodeModulePath,
  module: true,
  debug: true,
}));

const copyCachModule = (
  name,
  props = {},
) => {
  const {
    module = false,
    isModuleCall = false,
    fixSuffix = false,
  } = props;
  let nodeModuleFoldPath;
  let { nodeModulePath = '' } = props;
  nodeModulePath = isModuleCall
    ? resolve.sync(name, path.join(__dirname, '../'))
    : path.resolve(nodeModulePath, '../', name);

  const destNpmPath = `${DEST}/npm`;
  nodeModulePath = replaceSlash(nodeModulePath);
  let npmPath = nodeModulePath.replace(/([\/]node_modules)/, destNpmPath);

  if (fixSuffix) {
    nodeModulePath = nodeModulePath.replace(jsRe, '');
    nodeModuleFoldPath = nodeModulePath.replace(fileNameRe, '');
    npmPath = npmPath.replace(fileNameRe, '');
  }

  if ((isModuleCall || module) && !Cach.get('node_modules', nodeModulePath)) {
    if (!jsRe.test(nodeModulePath)) {
      try {
        Cach.set('node_modules', nodeModulePath, 1);
        const stat = statS(nodeModuleFoldPath);
        if (stat.isDirectory()) {
          const files = searchFiles(/\.(?:js|wxml|json|wxss)$/, nodeModuleFoldPath);
          keys(files, (key) => {
            const src = files[key];
            const dest = path.join(npmPath, key);
            copy(src, dest, catchError(() => {
              if (jsRe.test(src)) {
                traversePathCode(src, dest);
              }
            }));
          });
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      Cach.set('node_modules', nodeModulePath, 1);
      copy(nodeModulePath, npmPath, catchError(() => {
        traversePathCode(nodeModulePath, npmPath);
      }));
    }
  }
  return nodeModulePath.replace(fixSuffix ? /^[\s\S]+node_modules\// : '', '');
};

const resolveNpmPath = (
  args = [],
  reqSrc = '',
  prefixPath = '',
  options = {},
) => {
  if (!args.length) return;

  const {
    module = false,
    debug = false,
  } = options;
  let {
    nodeModulePath,
  } = options;
  reqSrc = replaceSlash(reqSrc);
  prefixPath = replaceSlash(prefixPath);
  const firstArgsValue = args[0].value;
  let moduleName = fixWavy(replaceSlash(firstArgsValue));
  const isModuleCall = npmPrefixRe.test(moduleName);
  const cachProps = {
    module,
    isModuleCall,
    nodeModulePath,
  };

  if (isModuleCall) {
    const relativeSrcPath = getRelativeFilePath(reqSrc, prefixPath);
    const prefix = getPathBack(relativeSrcPath);
    nodeModulePath = copyCachModule(moduleName, cachProps);
    const sliceIndex = nodeModulePath.indexOf(moduleName) + moduleName.length;
    const relativeFilePath = nodeModulePath.slice(sliceIndex);
    return `${prefix || './'}${module ? '' : 'npm/'}${moduleName}${relativeFilePath}`;
  } else if (!jsRe.test(moduleName)) {
    let indexPath;
    try {
      const npmStat = statS(path.resolve(reqSrc, '../', moduleName));
      if (npmStat.isDirectory()) {
        indexPath = `${moduleName}/index.js`;
      }
    } catch (err) {
      indexPath = `${moduleName}.js`;
    } finally {
      if (nodeModulePath) {
        nodeModulePath = copyCachModule(indexPath || firstArgsValue, cachProps);
      }
      return indexPath;
    }
  } else if (module) {
    nodeModulePath = copyCachModule(firstArgsValue, cachProps);
  }
  return firstArgsValue;
};

const wxTraverse = (
  ast,
  src,
  prefixPath = absoluteSrcPath,
  options = {},
) => {
  const { nodeModulePath, module } = options;
  babelTraverse(ast, {
    CallExpression({ node }) {
      if (node) {
        const { callee = {} } = node;
        const nodeArgs = node.arguments || [];
        const { loc = {} } = callee;
        const { identifierName = '' } = loc;
        if (identifierName === 'require') {
          nodeArgs[0].value = resolveNpmPath(nodeArgs, src, prefixPath, options)
            || nodeArgs[0].value;
        }
      }
    },

    VariableDeclarator({ node }) {
      if (node) {
        let { init = {} } = node;
        init = init || {};
        const { callee = {} } = init;
        const initArgs = init.arguments || [];
        if (callee.name === 'require') {
          initArgs[0].value = resolveNpmPath(initArgs, src, prefixPath, options)
            || initArgs[0].value;
        }
      }
    },
  });
  const { code } = babelGenerator(ast);
  if (module) {
    write(src, isProd() ? uglify(code) : code);
  }
  return code;
};

const compileCompressFile = (
  filePath,
  destPath,
  options = {},
) => {
  const {
    hooks = {},
    compress = true,
    dest = DEST,
    encoding = 'utf8',
    input = '',
    src,
  } = options;
  const destFile = path.join(__dirname, `../${dest}${destPath}`);
  if (typeof filePath === 'string') {
    try {
      ensureRunFunc(hooks.start);
      ensureRunFunc(hooks.willCompress, filePath, destPath);
      const file = compressFile(input || readS(filePath), compress);
      const hookArgs = [file, filePath, destFile, src];
      ensureRunFunc(hooks.didCompress, ...hookArgs);
      ensureRunFunc(hooks.willCopy, ...hookArgs);
      copy(filePath, destFile, catchError(() => {
        ensureRunFunc(hooks.didCopy, ...hookArgs);
        const lastResult = ensureRunFunc(hooks.willRewrite, ...hookArgs);
        write(destFile, lastResult || file, { encoding });
        ensureRunFunc(hooks.didRewrite, ...hookArgs);
        ensureRunFunc(hooks.end);
      }));
    } catch (err) {
      console.log(color.red(err));
    }
  }
};

const compileCompressFiles = (
  re,
  hooks = {},
) => (
  compress = true,
  src = absoluteSrcPath,
  dest =absoluteDestPath,
) => {
  const entry = searchFiles(re, src);
  const end = hooks.end;
  ensureRunFunc(hooks.start, entry, src);
  delete hooks.start;
  delete hooks.end;
  keys(entry, key => compileCompressFile(entry[key], key, { compress, hooks, src }));
  ensureRunFunc(end, src);
};

const compileJsonFiles = compileCompressFiles(/\.(?:json)$/, {
  start(json) {
    this.time = Date.now();
    logStart('compile-json');
    Cach.init('json', json);
  },
  didCopy(file, filePath) {
    if (/app\.json$/.test(filePath)) {
      Cach.set('wxml', filePath, file);
    }
  },
  willRewrite(file, ...args) {
    try {
      const json = JSON.parse(file);
      const { usingComponents } = json;
      const [ filePath, destFile, src ] = args;
      if (usingComponents) {
        keys(usingComponents, (compKey) => {
          let compPath = usingComponents[compKey];
          if (npmPrefixRe.test(compPath)) {
            compPath = fixWavy(compPath);
            const relativeSrcPath = getRelativeFilePath(filePath, src);
            const prefix = getPathBack(relativeSrcPath);
            compPath = copyCachModule(compPath, {
              isModuleCall: true,
              fixSuffix: true,
            });
            usingComponents[compKey] = `${prefix || './'}npm/${compPath}`;
          }
        });
        return JSON.stringify(json);
      }
    } catch (err) {
      console.log(color.red(`json file format error`));
    }
  },
  end() {
    logEnd('compile-json', this.time);
  },
});

const compileWxmlFiles = compileCompressFiles(/\.(?:wxml)$/, {
  start() {
    this.time = Date.now();
    logStart('compile-wxml');
    Cach.init('wxml', {});
  },
  didRewrite(file, filePath) {
    Cach.set('wxml', filePath, file);
  },
  end() {
    logEnd('compile-wxml', this.time);
  },
});

const webpackWxssFiles = (
  entry = {},
  options = {},
) => {
  const {
    callback = null,
    webpackFlag = true,
    hooks = {},
  } = options;
  const cssConfig = getWebpackCssConfig(entry, options);
  const time = Date.now();

  if (ensureRunFunc(hooks.start) === false) {
    logStart('compile-wxss');
  }

  if (webpackFlag) {
    webpack(cssConfig, catchError(() => {
      if (ensureRunFunc(hooks.end) === false) {
        logEnd('compile-wxss', time);
      }
      ensureRunFunc(callback);
    }));
  }
  return cssConfig;
};

const compileWxssFiles = async (options = {}) => {
  const {
    src = absoluteSrcPath,
    dest = absoluteDestPath,
  } = options;
  const entry = searchFiles(/\.(?:wxss)$/, src);
  Cach.init('wxss', entry);
  return webpackWxssFiles(entry, options);
};

const removeUnusedImages = (
  dest = absoluteDestPath,
  options = {},
) => {
  const {
    imgRe = /.*\/(img\/.+)/g,
    showDetail = true,
  } = options;
  if (isProd()) {
    const time = Date.now();
    logStart('remove-unused-image');
    const imagePathArray = keys(Cach.get('image'));
    for (let index = 0; index < imagePathArray.length; index += 1) {
      const imageKey = imagePathArray[index];
      const imagePath = imageKey.replace(imgRe, '$1');
      const wxmlKeyArray = keys(Cach.get('wxml'));
      let isUsed = false;

      for (let innerIndex = 0; innerIndex < wxmlKeyArray.length; innerIndex += 1) {
        const wxmlKey = wxmlKeyArray[innerIndex];
        const wxmlContent = Cach.get('wxml', wxmlKey);
        if (wxmlContent.indexOf(imagePath) > -1) {
          isUsed = true;
          break;
        }
      }

      if (!isUsed) {
        removeS(path.join(dest, imageKey));
        if (showDetail) {
          console.log(color.green(`remove unused ${imageKey} SUCCESS`));
        }
      }
    }
    logEnd('remove-unused-image', time);
  }
};

const compileJsFile = (
  src,
  dest,
  options = {},
) => {
  const {
    hooks = {},
    showDetail = true,
  } = options;
  if (typeof src === 'string') {
    ensureRunFunc(hooks.start, src);
    let { code, ast, error } = babelTransform(readS(src));
    code = wxTraverse(ast, src);

    if (isProd()) {
      code = uglify(code);
    } else if (showDetail) {
      console.log(color.green(` copy ${dest} SUCCESS...`));
    }

    compileCompressFile(src, dest, {
      compress: false,
      input: code,
    });
    ensureRunFunc(hooks.end, code, src, ast);
  }
};

const compileJsFiles = (options = {}) => {
  const {
    src = absoluteSrcPath,
    dest = absoluteDestPath,
  } = options;
  const entry = searchFiles(/\.(?:js)$/, src);
  const time = Date.now();
  Cach.init('js', entry);
  logStart('compile-js');
  keys(entry, (key) => {
    compileJsFile(entry[key], key);
  }, {
    // => test length
    // start: 0,
    // end: 1,
  });
  logEnd('compile-js', time);
};

const minImageFiles = async (
  options = {},
) => {
  const {
    quality = '65-80',
    src = absoluteSrcPath,
    dest = absoluteDestPath,
    clearDest = true,
    hooks = {},
  } = options;
  const time = Date.now();

  if (clearDest) {
    removeS(dest);
  }

  ensureRunFunc(hooks.start);
  logStart('compile-image');
  Cach.init('image', searchFiles(/\.(?:jpe?g|png|gif)$/, src));
  const dirArray = keys(Cach.get('image', DIR));
  for (let index = 0; index < dirArray.length; index += 1) {
    const dir = dirArray[index];
    await minImage(`${src}${dir}`, `${dest}${dir}`, options);
    if (isDev()) {
      console.log(color.green(`copy images in ${dir} SUCCESS...`));
    }
  }
  logEnd('compile-image', time);
  ensureRunFunc(hooks.end);
};

const runWatcher = async (
  src = absoluteSrcPath,
  dest = absoluteDestPath,
  srcfix = SRC,
  destfix = DEST,
) => {
  if (isProd()) {
    return;
  }
  await clearConsole();

  const unlinkFunc = (path) => {
    if (initial) {
      const time = Date.now();
      const suffix = getSuffix(path);
      const shortPath = path.replace(src, '');
      logStart(`[-] ${suffix} ${shortPath}`);
      path = path.replace(srcfix, destfix);
      removeS(path);
      logEnd(`[-] ${suffix} ${shortPath}`, time);
    }
  };

  const modifyFunc = (action = '[*]') => async (path, stat) => {
    const pathKey = path.replace(src, '');
    const suffix = getSuffix(pathKey);
    const time = Date.now();
    const destPath = `${dest}${pathKey}`.replace(fileNameRe, '');
    const hooks = {
      start() {
        logStart(`${action} ${suffix} ${pathKey}`);
      },
      end() {
        logEnd(`${action} ${suffix} ${pathKey}`, time);
      },
    };
    if (initial && suffix) {
      switch (suffix) {
        case 'js':
          compileJsFile(path, pathKey, { hooks, showDetail: false });
          break;
        case 'wxml':
        case 'json':
          compileCompressFile(path, pathKey, { hooks });
          break;
        case 'wxss':
          webpackWxssFiles({ [pathKey]: path }, { hooks });
          break;
        case 'jpeg':
        case 'jpg':
        case 'png':
        case 'gif':
          await minImage(path, destPath, { hooks });
          break;
      }
    }
  };

  const watcher = chokidar.watch(src, { ignored: /(^|[\/\\])\../ });
  watcher
    .on('unlinkDir', unlinkFunc)
    .on('unlink', unlinkFunc)
    .on('add', modifyFunc('[+]'))
    .on('change', modifyFunc())
    .on('addDir', (path) => {});
};

const compileFinish = async () => {
  if (isDev()) {
    await clearConsole();
    console.log(color.magenta('watching file changes...'));
  }
  initial = true;
};

module.exports = async (options = {}) => {
  const {
    src = absoluteSrcPath,
    dest = absoluteDestPath,
    hooks = {},
  } = options;
  ensureRunFunc(hooks.start);
  runWatcher(src, dest);

  // remove dest fold
  ensureRunFunc(hooks.willClearDest);
  removeS(dest);
  ensureRunFunc(hooks.didClearDest);

  // wxml
  ensureRunFunc(hooks.willCompileWxml);
  compileWxmlFiles(true, src, dest);
  ensureRunFunc(hooks.didCompileWxml);

  // json
  ensureRunFunc(hooks.willCompileJson);
  compileJsonFiles(isProd(), src, dest);
  ensureRunFunc(hooks.didCompileJson);

  // image
  ensureRunFunc(hooks.willCompileImage);
  await minImageFiles({ src, dest });
  ensureRunFunc(hooks.didCompileImage);

  // js
  ensureRunFunc(hooks.willCompileJs);
  compileJsFiles({ src, dest });
  ensureRunFunc(hooks.didCompileJs);

  // wxss
  ensureRunFunc(hooks.willCompileWxss);
  compileWxssFiles({
    src,
    dest,
    callback: async () => {
      ensureRunFunc(hooks.didCompileWxss);
      ensureRunFunc(hooks.willDeleteImage);
      removeUnusedImages(dest, { showDetail: false });
      ensureRunFunc(hooks.didDeleteImage);
      await compileFinish();
    },
  });
};
