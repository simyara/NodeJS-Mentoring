const EventEmitter = require('events');
const fs = require('fs');
const crypto = require('crypto');

class DirWatcher extends EventEmitter {
    constructor(path, delay) {
        super();

        this.path = path;
        this.delay = delay;
        this.countFiles = 0;
        this.files = [];

        this.interval = setInterval(() => {
            console.log('WATCH: ' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''));
            this.watch();
        }, this.delay)
    }

    difference(arr1, arr2) {
        var result = arr1.filter(e => !arr2.includes(e));
        return result;
    }

    createHash(filename) {
        const hash = crypto.createHash('sha256');

        const fileContent = fs.readFileSync(filename);
        hash.update(fileContent);
        const result = hash.digest('hex');
        return result;
    }

    watch() {
        var dirwatcher = this;
        fs.readdir(this.path, function(err, items) {
            var isChanged = false;
            if (err) {
                throw err;
            }

            var wasDeleted = dirwatcher.difference(dirwatcher.files.map((e) => {
                return e.name
            }), items);
            if (wasDeleted.length > 0) {
                console.log(`Was deteled ${wasDeleted.length} files: ${wasDeleted}`);
                dirwatcher.files = dirwatcher.files.filter(e => items.includes(e.name));
            }

            var tempList = items.filter(e => dirwatcher.files.map((el) => {
                return el.name
            }).includes(e));
            var wasChanged = [];
            tempList.forEach((e) => {
                var hash = dirwatcher.createHash(dirwatcher.path + e);
                var dirwatcherFile = dirwatcher.files.find((el) => (el.name == e));
                if (dirwatcherFile.hash != hash) {
                    wasChanged.push({
                        name: e,
                        hash: hash
                    });
                    dirwatcherFile.hash = hash;
                }
            });
            if (wasChanged.length > 0) {
                wasChanged = wasChanged.map((e) => {
                    return e.name
                });
                console.log(`Was changed ${wasChanged.length} files: ${wasChanged}`);
            }

            var wasAdded = dirwatcher.difference(items, dirwatcher.files.map((e) => {
                return e.name
            }));
            if (wasAdded.length > 0) {
                console.log(`Was added ${wasAdded.length} files: ${wasAdded}`);
                wasAdded.forEach((e) => dirwatcher.files.push({
                    name: e,
                    hash: dirwatcher.createHash(dirwatcher.path + e)
                }))
            }

            isChanged = (wasDeleted.length > 0 || wasAdded.length > 0 || wasChanged.length > 0) ? true : isChanged;
            if (isChanged) {
                dirwatcher.emit('changed', wasAdded.concat(wasChanged));
                dirwatcher.countFiles = items.length;
            } else {
                console.log('no any changes');
            }
        });
    }
}

exports.default = DirWatcher;
