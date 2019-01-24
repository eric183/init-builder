require('babel-core/register');
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
    if (/\//.test(ctx.url)) {
        ctx.body = fs.readFileSync(path.join(__dirname, '../pages/index.html'), 'utf8');
    }
    // next();
});
// app.use(async ctx => {
//     ctx.body = 'Hello World';
// });
// app.use(koaBody({ strict: false }));
// app.use(async(ctx, next) => {

//     if (/multipart/.test(ctx.request.headers['content-type'])) {
//         var form = new multiparty.Form();
//         var formData = {};
//         await new Promise((resolve, reject) => {
//             form.on('reject', reject);
//             // form.on('close', resolve);
//             form.on('field', (part, data) => {
//                 formData[part] = data
//                     // debugger;
//             })

//             form.on('file', (name, file) => {
//                 // debugger;
//                 // console.log(file);
//                 formData.file = {
//                     value: fs.createReadStream(file.path),
//                     options: {
//                         filename: file.originalFilename
//                     }
//                 }


//             });
//             form.on('close', () => {

//                 request.post({ url: buildInfo.pathname + ctx.url, formData: formData }, (err, response, body) => {
//                     ctx.body = body;
//                     resolve();
//                 });
//             })
//             form.parse(ctx.req);
//         })
//     } else {
//         await new Promise((resolve, reject) => {
//             request({
//                 method: ctx.method,
//                 url: buildInfo.pathname + ctx.url,
//                 headers: {
//                     contentType: 'application/x-www-form-urlencoded',
//                 },
//                 form: ctx.request.body && qs.stringify(qs.parse(ctx.request.body)),
//                 responseType: 'json'
//             }, (err, response, body) => {
//                 ctx.body = body;
//                 resolve();
//             })
//         })
//     }
// });

app.listen(3298, (data) => {
    // open('http://localhost:3000');
    console.log("Page is served at http://localhost:3298");
});