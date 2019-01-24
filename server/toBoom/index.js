const fs = require('fs');
const Koa = require('koa');

const cors = require('@koa/cors');
const Crop = require('./crop');

const app = new Koa();
const axios = require('axios');
const API_URL = 'http://service.wow-trend.test';


crop = new Crop();

// crop.trimTransparency(url, callback);

// response
app.use(cors());
// token = 
app.use(async ctx => {
    axios.defaults.headers.common['Authorization'] = ctx.request.header.authorization;
                // ctx.body = "dsaf";
    let john = await axios.get(API_URL + ctx.request.url);
    console.log(john);
    ctx.body = john.data
});




let host = app.listen(3000);



// axios.defaults.headers.common['Authorization'] = ctx.request.header.authorization;





 // return data.data = data.data.map((item, itemIndex)=> {
 //     item.back_image.forEach((object, urlIndex)=> {
 //         crop.trimTransparency(object.url, (err, data)=> {
 //             // console.log(data);

 //             if(err) console.log(err);
 //             console.log(typeof data);
 //             object.url = new Buffer(fs.readFileSync(data)).toString('base64')
 //         });
 //     });
 //     item.src.forEach((object, urlIndex) => {
 //         crop.trimTransparency(object.value, (err, data) => {
 //             if(err) console.log(err);
 //             object.value = new Buffer(fs.readFileSync(data)).toString('base64')
 //         });
 //     });


 // })