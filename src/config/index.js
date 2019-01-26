import Vue from 'vue';

import VueRouter from 'vue-router';
// import navJSON from '../routeMap';
// import menuList  from './util';
import routes from './component-importer';
Vue.use(VueRouter);

// import Test from '../components/test/default/index';
// let routes = []; 

// function filterRouter(menu) {
    
    
//     menu.forEach((item)=> {
        
//         if(item.url) {
//             let object = {};
//             object.path = '/' + item.url;
//             // console.log(object.path);
//             // item.url = '/' + item.url;
//             // console.log('/' + item.url);
//             // item.path = '../components/' + item.url;
//             // console.log(item.path);
//             // debugger;
//             // console.log(`../components/${item.url}`);
//             console.log(`../components/${item.url}`);
//             object.component = () => import(`@/views/base/components/${item.url}`)
//             // object.component = () => import(`../components/${item.url}.vue`); 
//             // console.log(item.path);
            

//             routes.push(object);
//         }

//         if(item.list) {
//             filterRouter(item.list);
//         }
//     })

// }

// // let topObject = [];

// function loopRouter(menu) {
    

//     // while(!!item.list) {

//     // }
//     menu.forEach((item)=> {
        
//         if(item.url) {
//             let object = {};
//             object.path = `/${item.url}`;
//             object.component = () => import(`../components/${item.url}`);
            
            

//             topObject.push(object);
//         }

//         if(item.list) {
//             loopRouter(item.list);
//         }
//     });
//     // return topObject;
// }

// // loopRouter(routeConfig.menuList);

// // console.log(topObject);
// // debugger;
// // let routes = menuList.map((menu)=> {
// //     return enu.list && menu.list.map((item)=> {
// //         let object = {}; 
// //         object.path = item.url;
// //         object.component = ()=> import(item.url);
// //         return object;
        
// //     });
// //     // menu.path
// // })
// // console.log(routes);
// // routes.map((route)=> {

// // })
// // let john = import(`../components/test/default/index.vue`);
// // let john = `/${menuList[0].list[0].url}`;
// // debugger;
// // let pathJohn = 'components' + john; 

// // console.log(pathJohn);
// // // import(john).then((data)=> {
// // //     debugger;
    
// //     console.log(`@/views/base/${pathJohn}.vue`);
// // })


// // let component = `../${pathJohn}.vue`;


// // topObject = [
// //     {
// //         path: john,
// //         component: () => import(component)
// //     }
// // ]
// let menu = menuList[0].list[0];
// // console.log(menuList[0].list[0]);
// // debugger;
// console.log(`${menu.component}`);
// routes = [
//     {
//         path: `/${menuList[0].list[0].url}`,
//         component: ()=> import(`${menu.component}`)
//     }
// ]

// // console.log('../components/'+ menuList[0].list[0].url +'.vue');

// console.log(routes);

const router = new VueRouter({
    // mode: 'history',
    // base: '/',
    routes: routes
    // routes: [
    //     {
    //         path: '/test/default/index', 
    //         // component:  () => import(`../components/test/default/index`)
    //         component: ()=>john
    //     }
    // ]
})

export default router;