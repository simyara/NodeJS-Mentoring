const EventEmitter = require ('events');
const fs = require('fs');

class DirWatcher  extends EventEmitter {
    constructor(path, delay) {
        super();

        this.path = path;
        this.delay = delay;
        const oneSecond = 1000;
        this.countFiles = 0;

        // let isOdd = true;
        // this.interval = setInterval( () => {
        //     this.emit(isOdd ? 'tick' : 'tock');
        //     isOdd = !isOdd;
        // }, this.delay);

        this.interval1 = setInterval( () => {
            console.log('watch');
            this.watch();
        }, this.delay + 1000)
    }

    watch() {
        var dirwatcher = this;
        fs.readdir(this.path, function(err, items) {
            if (err) {throw err;}
            console.log(items.length);

            if (dirwatcher.countFiles !== items.length) {
                dirwatcher.emit('changed');
                dirwatcher.countFiles = items.length;
            }

            for (var i=0; i<items.length; i++) {
                console.log(items[i]);
            }

        });
    }

    watch1() {
        var obj = this;
        fs.watch(this.path, {persistent: true}, function(event, filename) {

            if (event == 'change'){
                obj.emit('changed');
            }
        });
    }


}

const path = __dirname+'/data/';
const delay = 2*1000;
const dirwatcher = new DirWatcher (path, delay);

//console.log('count:' + dirwatcher.read());
dirwatcher.on('tick', () => {
    console.log('tick');
});

dirwatcher.on('changed', () => {
    console.log('!!!changed');
});