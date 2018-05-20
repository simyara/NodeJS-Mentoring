import config from './config/conf.json';
import {User, Product} from './models/models';
import DirWatcher from './modules/dirwatcher';
import Importer from './modules/importer';

function getValue(flag) {
    const index = process.argv.indexOf(flag);
    return (index > -1) ? process.argv[index + 1] : null;
}

const path = __dirname + (getValue('-dir')|| ('/data/'));
const delay = 2*1000;
const syncImport = JSON.parse(getValue('-si')) || false;

const isForFixedCount = false;
const countFiles = 10;


console.log(`The name of application is '${config.name}'`);

const user = new User();
const product = new Product();

const dirwatcher = new DirWatcher(path, delay);
const importer = new Importer(path, dirwatcher, syncImport);

