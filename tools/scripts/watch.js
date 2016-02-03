#!/usr/bin/env node
/* eslint-env node */
/* eslint strict:0 no-console:0 */
'use strict';

const handlebars = require('../tasks/handlebars');
const less = require('../tasks/less');
const chalk = require('chalk');
const chokidar = require('chokidar');
const path = require('path');

console.log(chalk.gray('watch: start'));

function runHandlebars() {
    try {
        handlebars.compile();
        console.log(chalk.green('handlebars: success'));
    } catch (err) {
        console.log(chalk.red('handlebars: fail'));
        console.log(chalk.red(err));
    }
}

function runLess() {
    console.log(chalk.green('less: start'));

    less.compile().then(
        function() {
            console.log(chalk.green('less: success'));
        },
        function(err) {
            console.log(chalk.red('less: fail'));
            console.log(chalk.red(err));
        }
    );
}

const watcher = chokidar.watch(
    [
        'less/{,**/}*.less',
        'templates/{,**/*.hbs}',
    ],
    {
        ignoreInitial: true,
    }
);

function handler(filepath) {
    const ext = path.extname(filepath);

    console.log(chalk.dim(`Changed: ${filepath}`));

    if (ext === '.hbs') {
        runHandlebars();
    }

    if (ext === '.less') {
        runLess();
    }
}

watcher.
    on('ready', () => console.log('Watch ready for changes')).
    on('error', error => console.log(chalk.red(error))).
    on('add', handler).
    on('change', handler).
    on('unlink', handler);
