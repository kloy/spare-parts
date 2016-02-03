#!/usr/bin/env node
/* eslint strict:0,no-console:0 */
'use strict';

const server = require('http').createServer();
const express = require('express');
const webpack = require('webpack');
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('../config/webpack/make-webpack-config')({hotreload: true});
const port = 9000;
const app = express();
const compiler = webpack(webpackConfig);
const paths = require('../config/paths');
const argv = require('yargs').argv;


app.use(devMiddleware(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
}));

app.use(hotMiddleware(compiler));

app.use('/', express.static(paths.lib));

server.on('request', app);
server.listen(port, () => {
    console.log('Listening on ' + server.address().port);
});
