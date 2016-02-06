import sl from '../sl';

function noop() {}
const __console = ('console' in global) ? console : {};
const __log = ('log' in __console) ? __console.log.bind(__console) : noop;

const __levels = {
    trace: 0,
    debug: 1,
    info: 2,
    warn: 3,
    error: 4,
};

const devConsole = {
    trace: 'trace' in __console ? __console.trace.bind(__console) : __log,
    debug: __log,
    info: 'info' in __console ? __console.info.bind(__console) : __log,
    warn: 'warn' in __console ? __console.warn.bind(__console) : __log,
    error: 'error' in __console ? __console.error.bind(__console) : __log,
};

function wrapListener(listener, level, toConsole, ...args) {
    listener(level, ...args);

    if (toConsole) {
        devConsole[level](...args);
    }
}

const logger = {
    __level: 'trace',
    __listener: null,
    __logToConsole: true,

    __setupLogger() {
        const level = logger.__level;
        const listener = logger.__listener;
        const toConsole = logger.__logToConsole;

        Object.keys(devConsole).forEach(function (logMethodName) {
            if (__levels[level] <= __levels[logMethodName]) {
                if (typeof listener === 'function') {
                    logger[logMethodName] = wrapListener.bind(null, listener, level, toConsole);
                } else if (toConsole === true) {
                    logger[logMethodName] = devConsole[logMethodName];
                } else {
                    logger[logMethodName] = noop;
                }
            } else {
                logger[logMethodName] = noop;
            }
        });
    },

    set logToConsole(shouldOutput) {
        logger.__logToConsole = shouldOutput;
        logger.__setupLogger();
    },

    set level(__level) {
        logger.__level = __level;
        logger.__setupLogger();
    },

    setListener(listener) {
        logger.__listener = listener;
        logger.__setupLogger();
    }
};

logger.logToConsole = true;
logger.level = 'trace';

sl.value('logger', logger);

export default sl.proxy('logger', [
    'logToConsole',
    'setListener',
    'level',
    'trace',
    'debug',
    'info',
    'warn',
    'error'
]);
