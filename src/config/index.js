import Vue from "vue";

import VueRouter from "vue-router";
import http from '@/utils/httpRequest';


// import navJSON from '../routeMap';
// import menuList  from './util';

import routes from "./component-importer";
import { clearLoginInfo } from '@/utils'


Vue.use(VueRouter);

// import Test from '../components/test/default/index';
// let routes = [];
// debugger;
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
const GLOBAL_ROUTES = [
    // ()=> import(['@/views/common/vms-login'], resolve),
    {
        path: "/404",
        component: () => import("@/views/common/404"),
        name: "404",
        meta: { title: "404未找到" }
    },
    {
        path: "/login",
        component: () => import("@/views/common/login"),
        name: "login",
        meta: { title: "系统类别" }
    }, //选择系统界面
    {
        path: "/opp-login",
        component: () => import("@/views/common/opp-login"),
        name: "opp-login",
        meta: { title: "登录" }
    }, //运营管理平台
    {
        path: "/mers-login",
        component: () => import("@/views/common/mers-login"),
        name: "mers-login",
        meta: { title: "登录" }
    }, //商户管理平台
    {
        path: "/spmp-login",
        component: () => import("@/views/common/spmp-login"),
        name: "spmp-login",
        meta: { title: "登录" }
    }, //超级物管平台
    {
        path: "/sys-login",
        component: () => import("@/views/common/sys-login"),
        name: "sys-login",
        meta: { title: "登录" }
    }, //系统管理平台
    {
        path: "/vms-login",
        component: () => import("@/views/common/vms-login"),
        name: "vms-login",
        meta: { title: "登录" }
    } //访客管理系统
];

routes.unshift({ path: '/home', component: ()=> import('@/views/common/home'), name: 'home', meta: { title: '首页' }});



const MAIN_ROUTES = {
    path: "/",
    component: () => import("@/views/main"),
    name: "main",
    redirect: { name: "home" },
    meta: { title: "主入口整体布局" },
    children: routes,
    beforeEnter(to, from, next) {
        let token = Vue.cookie.get("token");
        var iden = Vue.cookie.get("iden");
        if (!token || !/\S/.test(token)) {
            clearLoginInfo();
            if (iden) {
                if (iden == "opp") {
                    next({ name: "opp-login" });
                }
                if (iden == "mers") {
                    next({ name: "mers-login" });
                }
                if (iden == "spmp") {
                    next({ name: "spmp-login" });
                }
                if (iden == "sys") {
                    next({ name: "sys-login" });
                }
                if (iden == "vms") {
                    next({ name: "vms-login" });
                }
            } else {
                next({ name: "login" });
            }
        }
        next();
    }
};

// console.log(routes);


// 权限
// 接口

const router = new VueRouter({

    routes: GLOBAL_ROUTES.concat(MAIN_ROUTES)

});

http({
    url: http.adornUrl('/v1/auth/userMenus'),
    method: 'get',
    params: http.adornParams({
        'menuId': 1,
        'roleId': Vue.cookie.get('roleId')
    })
}).then(({ data }) => {
    //console.log(data.data)
    if (data && data.code === 200) {
        // fnAddDynamicMenuRoutes(data.data.menuList)
        router.options.isAddDynamicMenuRoutes = true
        sessionStorage.setItem('menuList', JSON.stringify(data.data.menuList || '[]'))
        sessionStorage.setItem('permissions', JSON.stringify(data.data.permissions || '[]'))
        next({ ...to, replace: true })
    } else {
        sessionStorage.setItem('menuList', '[]')
        sessionStorage.setItem('permissions', '[]')
        next()
    }
}).catch((e) => {
    console.log(`%c${e} 请求菜单列表和权限失败，跳转至登录页！！`, 'color:blue')
    router.push({ name: 'login' })
})



router.beforeEach((to, from, next) => {  // 添加动态(菜单)路由
    
    
        // http({
        //     url: http.adornUrl('/v1/auth/userMenus'),
        //     method: 'get',
        //     params: http.adornParams({
        //         'menuId': 1,
        //         'roleId': Vue.cookie.get('roleId')
        //     })
        // }).then(({ data }) => {
        //     //console.log(data.data)
        //     if (data && data.code === 200) {
        //         // fnAddDynamicMenuRoutes(data.data.menuList)
        //         router.options.isAddDynamicMenuRoutes = true
        //         sessionStorage.setItem('menuList', JSON.stringify(data.data.menuList || '[]'))
        //         sessionStorage.setItem('permissions', JSON.stringify(data.data.permissions || '[]'))
        //         next({ ...to, replace: true })
        //     } else {
        //         sessionStorage.setItem('menuList', '[]')
        //         sessionStorage.setItem('permissions', '[]')
        //         next()
        //     }
        // }).catch((e) => {
        //     console.log(`%c${e} 请求菜单列表和权限失败，跳转至登录页！！`, 'color:blue')
        //     router.push({ name: 'login' })
        // })
    
    
    
    // 1. 已经添加 or 全局路由, 直接访问
    // 2. 获取菜单列表, 添加并保存本地存储
    // if (router.options.isAddDynamicMenuRoutes || fnCurrentRouteType(to, globalRoutes) === 'global') {
    //     next()
    // } else {
    //     http({
    //         url: http.adornUrl('/v1/auth/userMenus'),
    //         method: 'get',
    //         params: http.adornParams({
    //             'menuId': 1,
    //             'roleId': Vue.cookie.get('roleId')
    //         })
    //     }).then(({ data }) => {
    //         //console.log(data.data)
    //         if (data && data.code === 200) {
    //             fnAddDynamicMenuRoutes(data.data.menuList)
    //             router.options.isAddDynamicMenuRoutes = true
    //             sessionStorage.setItem('menuList', JSON.stringify(data.data.menuList || '[]'))
    //             sessionStorage.setItem('permissions', JSON.stringify(data.data.permissions || '[]'))
    //             next({ ...to, replace: true })
    //         } else {
    //             sessionStorage.setItem('menuList', '[]')
    //             sessionStorage.setItem('permissions', '[]')
    //             next()
    //         }
    //     }).catch((e) => {
    //         console.log(`%c${e} 请求菜单列表和权限失败，跳转至登录页！！`, 'color:blue')
    //         router.push({ name: 'login' })
    //     })

    // }
})



export default router;
