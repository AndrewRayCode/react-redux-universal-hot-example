console.log('require');
const client = require('webpack-hot-middleware/client');

console.log('suball');
client.subscribeAll(function subALl( message ) {
  console.log('got message', message);
  return 'wtf';
});
