import { noop } from '../utils';

const __console = ('console' in global) ? console : {};
const __log = ('log' in __console) ? __console.log.bind(__console) : noop;

const devConsole = {
    trace: 'trace' in __console ? __console.trace.bind(__console) : __log,
    debug: __log,
    info: 'info' in __console ? __console.info.bind(__console) : __log,
    warn: 'warn' in __console ? __console.warn.bind(__console) : __log,
    error: 'error' in __console ? __console.error.bind(__console) : __log,
};

export default devConsole;
