const compose = require('lodash/fp/compose');

const mode = require('./components/mode');
const scripts = require('./components/scripts');
const forkTsChecker = require('./components/fork-ts-checker');
const styles = require('./components/styles');
const statsPlugin = require('./components/stats-plugin');
const lint = require('./components/lint');
const clean = require('./components/clean');
const fonts = require('./components/fonts');
const hot = require('./components/hot');
const images = require('./components/images');
const target = require('./components/target');
const performance = require('./components/performance');

const components = [
  clean,
  mode,
  forkTsChecker,
  scripts,
  styles,
  statsPlugin,
  lint,
  fonts,
  hot,
  images,
  target,
  performance,
];

module.exports = (opts) => (config) => compose(components.map(comp => (comp(opts))))(config);
