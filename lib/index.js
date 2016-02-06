'use strict';

import sl from './sl';
import logger from './logger';

sl.singleton('foo', () => 'my bar');
logger.logToConsole = false;
logger.debug(sl.get('foo'));

logger.debug('foo bar from logger');
logger.warn('a warning');
logger.error('an error');

logger.setListener(function (level, ...args) {
    console.info('listen', level, args[0], ...args);
});

logger.warn('another warning');

if (process.env.NODE_ENV === 'development' && module.hot) {
    module.hot.accept();
}
