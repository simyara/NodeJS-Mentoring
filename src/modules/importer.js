import fs from 'fs';

export default class Importer {
    constructor(path, dirwatcher, syncImport) {
        dirwatcher.on('changed', (listToImport) => {
            if (listToImport.length > 0) {
                console.log(syncImport ? 'will be imported sync' : 'will be imported async');
            }
            listToImport.forEach((e) => {
                if (syncImport) {
                    const fileContent = this.importSync(path + e);
                    console.log('Sync imported data: ', JSON.stringify(fileContent))
                } else {
                    this.import(path + e)
                        .then(data => console.log('Imported data: ', data))
                        .catch(error => console.log('Error: ', error));
                }
            })
        });
    }

    csv2json(data) {
        var jsonObj = [];
        var bufferString = data.toString();
        var arr = bufferString.split('\n');
        var headers = arr[0].split(';');
        for (var i = 1; i < arr.length; i++) {
            var data = arr[i].split(';');
            var obj = {};
            for (var j = 0; j < data.length; j++) {
                obj[headers[j].trim()] = data[j].trim();
            }
            jsonObj.push(obj);
        }
        return jsonObj;
    }

    import (path) {
        const type = 'utf8';
        const importer = this;
        return new Promise(function(resolve, reject) {
            fs.readFile(path, type, (err, fileContent) => {
                if (err) reject(err);
                var jsonObj = importer.csv2json(fileContent);
                resolve(JSON.stringify(jsonObj));
            });
        });
    }

    importSync(path) {
        try {
            const fileContent = fs.readFileSync(path);
            var jsonObj = this.csv2json(fileContent);
            return JSON.stringify(jsonObj);
        } catch (error) {
            console.error(error);
            return false;
        }
    }
}
