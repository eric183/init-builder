const fs = require("fs");

const process = require("process");

const path = require("path");

console.log(path.join(__dirname, '..', 'src', 'views'));


const PROJECT_DIR = path.join(__dirname, '..', 'src', 'views');

// const PROJECT_DIR = path.resolve(__dirname, "..", "views", ROUTE_MAP.name);
// const JSON_OBJECT = require(path.join(__dirname, "projectsInfo.json"));

const ROUTE_MAP = require(path.join(PROJECT_DIR, "modules.json"));




let formatRoute = (array) => {
    return array.map((foo)=> {
        return (`{
            path: "/${foo.path}", 
            component: () => import("../views/modules/${foo.path}")
        }`)
    })
};


let routes = `export default [${formatRoute(ROUTE_MAP.modules)}]`


fs.writeFile(path.join(PROJECT_DIR, '..', 'config/component-importer.js'), routes, (err) => {
    if (err) throw err;
    console.log('设置成功');
});