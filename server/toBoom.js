// require('babel-core/register');
// const buildInfo = require('../build.json');


const path = require('path');
const qs = require('qs');
const fs = require('fs');
const util = require('util');


const Koa = require('koa');
const cors = require('@koa/cors');
const app = new Koa();
const serveStatic = require('koa-static');
const koaBody = require('koa-body');
const mount = require('koa-mount');

// app.use(mount('/assets', serveStatic('../assets')));
// const FormData = require('form-data');
// const request = require('request');
// const multiparty = require('multiparty');
// const open = require('open');
// app.use(cors());
// app.use(serveStatic(path.resolve(__dirname, '../pages')));
app.use(mount('/assets', serveStatic(path.resolve(__dirname, '../assets'))));

app.use(ctx => {
    // console.log(ctx);
    if (ctx.url == '/') {
        ctx.body = fs.readFileSync(path.join(__dirname, '../pages/bottom.html'), 'utf8');
    }
    // next();
})

app.listen(3290, (data) => {
    // open('http://localhost:3000');
    console.log("Page is served at http://localhost:3290");
});