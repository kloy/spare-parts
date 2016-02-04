import sl from '../sl';

const localConsole = ('console' in global) ? console : {};
function noop() {}

const levels = {
    trace: 0,
    debug: 1,
    info: 2,
    warn: 3,
    error: 4,
};

const logger = {
    useEvents: false, // Disables nice console logging in favor of events. Meant for production remote logging.

    __level: 0,

    set level(value) {
        this.__level = levels[value];
    },

    // __logEvent(type, ...args) {
    //
    // },

    get trace() {
        if (logger.__level > 0) {
            return noop;
        }

        if ('trace' in localConsole) {
            return localConsole.trace.bind(localConsole);
        }

        return logger.debug;
    },

    get debug() {
        if (logger.__level > 1) {
            return noop;
        }

        if ('log' in localConsole) {
            return localConsole.log.bind(localConsole);
        }

        return noop;
    },

    get info() {
        if (logger.__level > 2) {
            return noop;
        }

        if ('info' in localConsole) {
            return localConsole.info.bind(localConsole);
        }

        return logger.debug;
    },

    get warn() {
        if (logger.__level > 3) {
            return noop;
        }

        if ('warn' in localConsole) {
            return localConsole.warn.bind(localConsole);
        }

        return logger.debug;
    },

    get error() {
        if ('error' in localConsole) {
            return localConsole.error.bind(localConsole);
        }

        return logger.debug;
    },
};

sl.value('logger', logger);

export default sl.proxy('logger', [
    'useEvents',
    'level',
    'trace',
    'debug',
    'info',
    'warn',
    'error',
]);
