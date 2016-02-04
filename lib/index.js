'use strict';

import sl from './sl';
import logger from './logger';

sl.singleton('foo', () => 'my bar');
logger.debug(sl.get('foo'));

logger.debug('foo bar from logger');
logger.warn('a warning');
logger.error('an error');

if (process.env.NODE_ENV === 'development' && module.hot) {
    module.hot.accept();
}
