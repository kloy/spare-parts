/* eslint-env node */
/* eslint strict:0 */
'use strict';

const paths = require('../paths');
const plugins = require('./plugins');
const loaders = require('./loaders');

module.exports = function (options) {
    const env = process.env.NODE_ENV;
    let isProduction = false;
    let isTest = false;
    let isDev = false;
    const sourcemapConfig = process.env.npm_package_config_sourcemap;
    const hotreload = (options || {}).hotreload || false;

    switch (env) {
        case 'production':
            isProduction = true;
            break;
        case 'test':
            isTest = true;
            break;
        default:
            isDev = true;
            break;
    }

    let devtool = false;

    if (isProduction) {
        devtool = 'hidden-source-map';
    } else if (isDev) {
        devtool = sourcemapConfig;
    }

    return {
        entry: {
            'spare-parts': hotreload ? ['webpack-hot-middleware/client', paths.js_main] : paths.js_main,
        },
        // output configures bundle output, sourcemap output and chunking files
        output: {
            path: paths.js_dest,
            filename: 'spare-parts.js',
            sourceMapFilename: isTest ? false : '[file].map',
            publicPath: '/build/',
        },
        bail: isProduction,
        profile: true,
        cache: !isProduction,
        devtool: devtool === 'off' ? false : devtool,
        plugins: plugins(),
        module: {
            loaders: loaders,
        },
    };
};
