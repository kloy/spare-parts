/* eslint-env node */
/* eslint strict:0 */
'use strict';

const path = require('path');

const pathBuild = path.resolve(__dirname, '../../build');
const pathRoot = path.resolve(__dirname, '../..');
const pathWebui = path.resolve(__dirname, '../../..');

module.exports = {
    build: pathBuild,
    root: pathRoot,
    lib: path.resolve(pathRoot, 'lib'),
    js_main: path.resolve(pathRoot, 'lib/index.js'),
    js_dest: pathBuild,
};
