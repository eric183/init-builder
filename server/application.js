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
const router = require('koa-router')();


app.use(mount('/assets', serveStatic(path.resolve(__dirname, '../assets'))));


router.get('/admin', (ctx, next)=> {
    // console.log('test');
    ctx.body = fs.readFileSync(path.join(__dirname, '../pages/index.html'), 'utf8');
    next();
})


router.get('/toBoom', (ctx, next)=> {
    // console.log('test');
    ctx.body = fs.readFileSync(path.join(__dirname, '../pages/toBoom.html'), 'utf8');
    next();
})

router.get('/ts', (ctx, next)=> {
    // console.log('test');
    ctx.body = fs.readFileSync(path.join(__dirname, '../pages/ts.html'), 'utf8');
    next();
})

router.get('/base', (ctx, next)=> {
    // console.log('test');
    ctx.body = fs.readFileSync(path.join(__dirname, '../pages/base.html'), 'utf8');
    next();
})



app.use(router.routes()).use(router.allowedMethods());



app.listen(3290, (data) => {
    // open('http://localhost:3000');
    console.log("Page is served at http://localhost:3290");
});