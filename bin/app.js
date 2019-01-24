require('babel-core/register');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');

const { spawn } = require('child_process');
const process = require('process');
var hasBuild = false;
// entryURl
// axios.defaults.withCredentials = true

var devInfo = {};
const compiled = webpack(webpackConfig(process.argv[2]));

// compiled.run((err, stat) => {
//     if (err) console.log(err);
//     console.log(stat);
//     devInfo.flag = true
// })
// console.log(process.argv[2]);
compiled.watch({}, (err, stats) => {

    if (err) console.log(err);

    if (hasBuild == false) {
        // const ls = spawn('node', ['server/apis.js']);


        ls.stdout.on('data', (data) => {
            console.log(`${data}`);
        });

        ls.stderr.on('data', (data) => {
            console.log('error: ' + data);
        });

        ls.on('close', (code) => {
            console.log(code)
        });

    }


    console.log('change: ' + stats);

    hasBuild = true;

})



// child_process.exec('node server/apis.js', {}, function(error, stdout, stderr) {
//     if (error) {
//         console.error(`报错!!!!: ${error}`);
//         return;
//     };
//     console.log(`stdout: ${stdout}`);
//     console.log(`stderr: ${stderr}`);
//     console.log('前端build完成.....................................');
//     // if (user_os(process.platform) == 'mac') {
//     //     child_process.execSync('./gradlew front bootRun', options);
//     // } else {
//     //     child_process.execSync('gradlew front bootRun', options);
//     // }
// });