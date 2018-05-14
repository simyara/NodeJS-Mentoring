import config from './config/conf.json';
import {User, Product} from './models/models';

console.log(`The name of application is '${config.name}'`);

const user = new User();
const product = new Product();

