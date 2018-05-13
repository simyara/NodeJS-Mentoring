'use strict';

var _conf = require('./config/conf.json');

var _conf2 = _interopRequireDefault(_conf);

var _models = require('./models/models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//const config = require('./config/conf.json');
console.log('The name of application is \'' + _conf2.default.name + '\'');
//const models = require('./models/models');


var user = new _models2.default.User();
var product = new _models2.default.Product();