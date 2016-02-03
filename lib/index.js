const sl = require('./sl');
console.log('hello world!');

if (process.env.NODE_ENV === 'development' && module.hot) {
    module.hot.accept();
}
