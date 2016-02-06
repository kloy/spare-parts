import sl from '../sl';
import SimpleMap from '../simple-map';

const config = new SimpleMap();

sl.value('config', config);

export default sl.proxy('config', [
    'set',
    'get',
    'has',
    'clear',
    'delete'
]);
