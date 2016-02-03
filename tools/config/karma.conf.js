/* eslint-env node */
/* eslint strict:0 */
'use strict';

const path = require('path');
const webpackConfig = require('./webpack/make-webpack-config.js')();
const argv = require('yargs').argv;
const sourcemapFlag = argv.sourcemap;
const sourcemapConfig = JSON.parse(process.env.npm_package_config_karma_sourcemap) === true;
const withSourcemap = sourcemapFlag || sourcemapConfig;
const reporter = argv.reporter || 'minimal';
const browsers = (process.env.npm_package_config_karma_browsers || '').split(',').map(browser => browser.trim());

const preprocessors = ['webpack'];

if (withSourcemap) {
    webpackConfig.devtool = 'inline-source-map';
    preprocessors.push('sourcemap');
}

const config = {
    basePath: path.resolve(__dirname, '../..'),
    frameworks: ['qunit'],
    files: ['lib/test/index.js'],
    reporters: ['mocha'],
    preprocessors: {
        'lib/test/index.js': preprocessors,
    },
    mochaReporter: {
        output: reporter,
    },
    webpackMiddleware: {
        noInfo: false,
        quiet: false,
        stats: {
            assets: false,
            chunks: false,
            chunkModules: false,
            colors: true,
            hash: false,
            timings: false,
            version: false
        }
    },
    port: 9888,
    colors: true,
    browsers: browsers,
    reportSlowerThan: 200,
    webpack: webpackConfig
};

module.exports = function(karmaConfig) {
    karmaConfig.set(config);
};
