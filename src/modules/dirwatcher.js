import EventEmitter from 'events';
import fs from 'fs';
import crypto from 'crypto';

export default class DirWatcher extends EventEmitter {
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

    findDeletedFiles(savedListOfNames, currentListOfNames) {
        return this.difference(savedListOfNames, currentListOfNames);
    };

    findAddedFiles(savedListOfNames, currentListOfNames) {
        return this.difference(currentListOfNames, savedListOfNames);
    }

    findUpdatedFiles(savedListOfNames, currentListOfNames){
        var tempList = currentListOfNames.filter(e => savedListOfNames.includes(e));
        var wasChanged = [];
        tempList.forEach((e) => {
            var hash = this.createHash(this.path + e);
            var dirwatcherFile = this.files.find((el) => (el.name == e));
            if (dirwatcherFile.hash != hash) {
                wasChanged.push({
                    name: e,
                    hash: hash
                });
                dirwatcherFile.hash = hash;
            }
        });
        wasChanged = wasChanged.map((e) => {
            return e.name
        });

        return wasChanged;
    }

    watch() {
        fs.readdir(this.path, (err, items) => {
            var isChanged = false;
            var dirwatcherListOfName = this.files.map((e) => {
                return e.name
            });

            if (err) {
                throw err;
            }

            var deletedFilesList = this.findDeletedFiles(dirwatcherListOfName, items);
            if (deletedFilesList.length > 0) {
                console.log(`Was deteled ${deletedFilesList.length} files: ${deletedFilesList}`);
                this.files = this.files.filter(e => items.includes(e.name));
            }

            var wasChanged = this.findUpdatedFiles(dirwatcherListOfName, items);
            if (wasChanged.length > 0) {
                console.log(`Was changed ${wasChanged.length} files: ${wasChanged}`);
            }

            var addedFilesList = this.findAddedFiles(dirwatcherListOfName, items)
            if (addedFilesList.length > 0) {
                console.log(`Was added ${addedFilesList.length} files: ${addedFilesList}`);
                addedFilesList.forEach((e) => this.files.push({
                    name: e,
                    hash: this.createHash(this.path + e)
                }))
            }

            isChanged = (deletedFilesList.length || addedFilesList.length || wasChanged.length);
            if (isChanged) {
                this.emit('changed', addedFilesList.concat(wasChanged));
                this.countFiles = items.length;
            } else {
                console.log('no any changes');
            }
        });
    }
}
