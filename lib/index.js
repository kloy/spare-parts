'use strict';

import sl from './sl';
import logger from './logger';
import starter from './starter';

sl.singleton('foo', () => 'my bar');
logger.logToConsole = false;
logger.debug(sl.get('foo'));

logger.debug('foo bar from logger');
logger.warn('a warning');
logger.error('an error');

logger.warn('another warning');

starter.
    task('Task one', () => {
        logger.debug('Running task one');
    }).
    asyncTask('Task two', done => {
        logger.debug('Running async task two');
        done();
        // const error = new Error('Async task two failed');
        // done(error);
    }).
    task('Task three', () => {
        logger.debug('Running task three');
        // throw new Error('task 3 boom');
    }).
    asyncTask('Task four', done => {
        logger.debug('Running async task four');
        done();
    }).
    start((error, lastMessage) => {
        if (error) {
            logger.error(error, lastMessage);
        }

        logger.debug('Starter complete');
    });

if (process.env.NODE_ENV === 'development' && module.hot) {
    module.hot.accept();
}
