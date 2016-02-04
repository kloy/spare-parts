/* eslint-env node */
/* eslint strict:0 */
'use strict';

const loaders = [
    {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel', // 'babel-loader' is also a legal name to reference
        query: {
            presets: ['react', 'es2015']
        }
    }
];

module.exports = loaders;
