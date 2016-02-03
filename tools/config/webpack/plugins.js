/* eslint-env node */
/* eslint strict:0 */
'use strict';

const webpack = require('webpack');
const env = process.env.NODE_ENV;

module.exports = function() {
    const plugins = [];

    plugins.push(
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(env),
        })
    );

    if (process.env.NODE_ENV === 'development') {
        plugins.push(
            new webpack.optimize.OccurenceOrderPlugin(),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoErrorsPlugin()
        );
    }

    return plugins;
};
