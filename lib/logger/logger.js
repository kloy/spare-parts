import sl from '../sl';
import __console from './console';
import { noop } from '../utils';


const __levels = {
    trace: 0,
    debug: 1,
    info: 2,
    warn: 3,
    error: 4,
};

function wrapListener(listener, level, toConsole, ...args) {
    listener(level, ...args);

    if (toConsole) {
        __console[level](...args);
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

        Object.keys(__console).forEach(function (logMethodName) {
            if (__levels[level] <= __levels[logMethodName]) {
                if (typeof listener === 'function') {
                    logger[logMethodName] = wrapListener.bind(null, listener, level, toConsole);
                } else if (toConsole === true) {
                    logger[logMethodName] = __console[logMethodName];
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
