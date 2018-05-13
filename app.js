const config = require('./config/conf.json');
const models = require('./models/models');
const DirWatcher = require('./modules/dirwatcher').default;
const Importer = require('./modules/importer').default;

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

const user = new models.User();
const product = new models.Product();

const dirwatcher = new DirWatcher(path, delay);
const importer = new Importer(path, dirwatcher, syncImport);

