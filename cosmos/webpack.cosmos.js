const createWebpack = require('../webpack/create-webpack');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const BUILD_DIR = path.resolve(ROOT_DIR, 'dist');
const WEB_ROOT = path.resolve(BUILD_DIR, 'public');
const ASSET_DIR = path.resolve(WEB_ROOT, 'assets');

module.exports = () => {
  const config = createWebpack({
    buildDir: BUILD_DIR,
    rootDir: ROOT_DIR,
    webRoot: WEB_ROOT,
    outputDir: ASSET_DIR,
    htmlTemplate: path.join(ROOT_DIR, 'cosmos/index.html'),
    production: false,
    tsconfigPath: path.resolve(__dirname, '../tsconfig.json'),
  })({
    entry: path.resolve(ROOT_DIR, 'entry.tsx'),
    output: {
      path: WEB_ROOT,
      filename: 'assets/bundle.js',
    },
  });

  return config;
};

