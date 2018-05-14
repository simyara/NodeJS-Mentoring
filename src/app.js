import config from './config/conf.json';
import models from './models/models';

console.log(`The name of application is '${config.name}'`);

const user = new models.User();
const product = new models.Product();

