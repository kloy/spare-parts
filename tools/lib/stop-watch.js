/* eslint-env node */
/* eslint strict:0 no-console:0 */
'use strict';

const chalk = require('chalk');

module.exports = function stopWatch() {
    const hrstart = process.hrtime();

    return {
        stop(message) {
            const hrend = process.hrtime(hrstart);
            console.log(chalk.gray(message + ' %ds %dms'), hrend[0], hrend[1] / 1000000);
        }
    };
};
