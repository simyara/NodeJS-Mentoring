const config = require('./config/conf.json');
//import config from './config/conf.json';
const models = require('./models/models');

console.log(`The name of application is '${config.name}'`);

const user = new models.User();
const product = new models.Product();

