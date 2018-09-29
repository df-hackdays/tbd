require.extensions['.svg'] = function(){ return null; }
require.extensions['.css'] = function(){ return null; }

require('babel-polyfill')
require('babel-register')

var enzyme = require('enzyme');
var Adapter = require('enzyme-adapter-react-16');

enzyme.configure({ adapter: new Adapter() });