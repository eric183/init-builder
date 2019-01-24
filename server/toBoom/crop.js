let child_process = require('child_process');
var request = require('request');


module.exports = Crop;

function Crop() {}

Crop.prototype.trimTransparency = (url, callback) => {
    child_process.exec(`magick convert -trim +repage -alpha Background ${url} -`, {
        encoding: 'binary',
        maxBuffer: 500 * 1024
    }, (err, stdout) => {

        if (err) {
            callback && callback(err, null);

        } else {
            callback && callback(null, stdout);
        }

    })
}
