require('babel-core/register');
// const webpack = require('webpack');
// const webpackConfig = require('./builder/webpack.config');

const { spawn } = require('child_process');
const process = require('process');
var hasBuild = false;

// const api = spawn('node', ['server/api.js']);
// const application = spawn('node', ['server/application.js']);
const application = spawn('node', ['server/application.js']);

application.stdout.on('data', (data) => {
    console.log(`${data}`);
});

application.stderr.on('data', (data) => {
    console.log('error: ' + data);
});

application.on('close', (code) => {
    console.log(code)
});

// application.stdout.on('data', (data) => {
//     console.log(`${data}`);
// });

// application.stderr.on('data', (data) => {
//     console.log('error: ' + data);
// });

// application.on('close', (code) => {
//     console.log(code)
// });



// entryURl
// axios.defaults.withCredentials = true

// var devInfo = {};
// const compiled = webpack(webpackConfig(process.argv[2]));

// console.log(process.argv[2]);
// compiled.watch({}, (err, stats) => {
//     if (err) console.log(err);

//     // if (hasBuild == false) {
//         const ls = spawn('node', ['server/api.js']);
//         const ls = spawn('node', ['server/api.js']);


//         ls.stdout.on('data', (data) => {
//             console.log(`${data}`);
//         });

//         ls.stderr.on('data', (data) => {
//             console.log('error: ' + data);
//         });

//         ls.on('close', (code) => {
//             console.log(code)
//         });

//     // }


//     console.log('change: ' + stats);

//     // hasBuild = true;

// })