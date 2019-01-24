const fs = require('fs');
const process = require('process');
const path = require('path');
const argv_str = JSON.parse(process.env.npm_config_argv)['original'].pop().slice(2);

const JsonObj = require(path.join(__dirname, 'projectsInfo.json'));

for (let i in JsonObj.config.projects) {
    if (JsonObj.config.projects[i]['name'] == argv_str) {
        JsonObj.config.dev = JsonObj.config.projects[i];
    }
}


fs.writeFile(path.join(__dirname, 'projectsInfo.json'), JSON.stringify(JsonObj, null, 4), (err) => {
    if (err) throw err;
    console.log('设置成功');
});


// JsonObj.config.dev.
// console.log(JsonObj);