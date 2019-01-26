/**
 * 全站路由配置
 *
 * 建议:
 * 1. 代码中路由统一使用name属性跳转(不使用path属性)
 */
import Vue from 'vue'
import Router from 'vue-router'
import http from '@/utils/httpRequest'
import { isURL } from '@/utils/validate'
import { clearLoginInfo } from '@/utils'

Vue.use(Router)

// 开发环境不使用懒加载, 因为懒加载页面太多的话会造成webpack热更新太慢, 所以只有开发环境使用懒加载
const _import = require('./import-' + process.env.NODE_ENV)

// 全局路由(无需嵌套上左右整体布局)
const globalRoutes = [
  // resolve => require(['@/views/common/vms-login'], resolve),
  { path: '/404', component: resolve => require(['@/views/common/404'], resolve), name: '404', meta: { title: '404未找到' } },
  { path: '/login', component: resolve => require(['@/views/common/login'], resolve), name: 'login', meta: { title: '系统类别' } },                         //选择系统界面    
  { path: '/opp-login', component: resolve => require(['@/views/common/opp-login'], resolve), name: 'opp-login', meta: { title: '登录' } },                 //运营管理平台
  { path: '/mers-login', component: resolve => require(['@/views/common/mers-login'], resolve), name: 'mers-login', meta: { title: '登录' } },              //商户管理平台
  { path: '/spmp-login', component: resolve => require(['@/views/common/spmp-login'], resolve), name: 'spmp-login', meta: { title: '登录' } },              //超级物管平台
  { path: '/sys-login', component: resolve => require(['@/views/common/sys-login'], resolve), name: 'sys-login', meta: { title: '登录' } },                 //系统管理平台
  { path: '/vms-login', component: resolve => require(['@/views/common/vms-login'], resolve), name: 'vms-login', meta: { title: '登录' } },                  //访客管理系统
]
// 主入口路由(需嵌套上左右整体布局)
const mainRoutes = {
  path: '/',
  component: resolve => require(['@/views/main'], resolve),
  name: 'main',
  redirect: { name: 'home' },
  meta: { title: '主入口整体布局' },
  children: [
    // 通过meta对象设置路由展示方式
    // 1. isTab: 是否通过tab展示内容, true: 是, false: 否
    // 2. iframeUrl: 是否通过iframe嵌套展示内容, '以http[s]://开头': 是, '': 否
    { path: '/home', component: _import('common/home'), name: 'home', meta: { title: '首页' } },
    { path: '/info-detail', component: resolve => require(['@/views/modules/adv/info-detail'], resolve), name: 'info-detail', meta: { title: '资讯详情' } },    //资讯管理下的资讯详情
    { path: '/billdetail', component: resolve => require(['@/views/modules/utili/billdetail'], resolve), name: 'billdetail', meta: { title: '物业费账单详情' } },
    { path: '/express-orderinfo', component: resolve => require(['@/views/modules/express/orderinfo'], resolve), name: 'express-orderinfo', meta: { title: '快递订单详情' } },
    { path: '/crossProducts', component: resolve => require(['@/views/modules/ind/crossProducts'], resolve), name: 'crossProducts', meta: { title: '关联商品' } },    //首页关联商品进去的--关联商品页面
    { path: '/IndexShop', component: resolve => require(['@/views/modules/ind/IndexShop'], resolve), name: 'IndexShop', meta: { title: '专题详情' } },                //首页专题名称进去的-关联商品列表
    { path: '/storeShop', component: resolve => require(['@/views/modules/ind/storeShop'], resolve), name: 'storeShop', meta: { title: '店铺排序' } },                //首页专题名称进去的-店铺排序
    { path: '/goodsdetail', component: resolve => require(['@/views/modules/goods/goodsdetail'], resolve), name: 'goodsdetail', meta: { title: '商品详情' } },        //商品模块的商品详情
    { path: '/goods-add', component: resolve => require(['@/views/modules/goods/goods-add'], resolve), name: 'goods-add', meta: { title: '商品新增' } },              //商品模块的商品新增
    { path: '/orderinfo', component: resolve => require(['@/views/modules/order/orderinfo'], resolve), name: 'orderinfo', meta: { title: '订单详情' } },              //订单模块的订单详情
    { path: '/sto-stoinfo', component: resolve => require(['@/views/modules/sto/stoinfo'], resolve), name: 'sto-stoinfo', meta: { title: '店铺详情' } },
    { path: '/superdev-groupinfo', component: resolve => require(['@/views/modules/superdev/groupinfo'], resolve), name: 'superdev-groupinfo', meta: { title: '超级设备管理详情' } },     //超级设备管理详情
    { path: '/group-add-or-update', component: resolve => require(['@/views/modules/superdev/group-add-or-update'], resolve), name: 'groupoperation' },              //超级设备管理新增-编辑
    { path: '/plain-add', component: resolve => require(['@/views/modules/superdev/plain-add'], resolve), name: 'plain-add' },              //超级设备管理 计划的新增
    { path: '/plain-update', component: resolve => require(['@/views/modules/superdev/plain-update'], resolve), name: 'plain-update' },              //超级设备管理 计划的新增
    { path: '/plain-info', component: resolve => require(['@/views/modules/superdev/plain-info'], resolve), name: 'plain-info' },              //超级设备管理 计划的详情页面
    { path: '/device-select', component: resolve => require(['@/views/modules/superdev/device-select'], resolve), name: 'device-select' },              //超级设备管理 选择设备的设备列表
    { path: '/task-info', component: resolve => require(['@/views/modules/superdev/task-info'], resolve), name: 'task-info' },              //超级设备管理 任务的详情页面
    { path: '/feedback', component: resolve => require(['@/views/modules/superdev/feedback'], resolve), name: 'feedback' },              //超级设备管理 任务的反馈内容页面
    { path: '/propertyService-detail', component: resolve => require(['@/views/modules/propertyService/propertyService-detail'], resolve), name: 'propertyService-detail' },              //物业服务 的详情页面
    { path: '/fixDevice-add', component: resolve => require(['@/views/modules/superdev/fixDevice-add'], resolve), name: 'fixDevice-add' },
    { path: '/fixDevice-detail', component: resolve => require(['@/views/modules/superdev/fixDevice-detail'], resolve), name: 'fixDevice_detail' },
    { path: '/workerOrder_add', component: resolve => require(['@/views/modules/workerOrder/workerOrder_add'], resolve), name: 'workerOrder_add' },
    { path: '/workerOrder_detail', component: resolve => require(['@/views/modules/workerOrder/workerOrder_detail'], resolve), name: 'workerOrder_detail' },
    { path: '/s-record', component: resolve => require(['@/views/modules/SuperTube/EnergyManagement/record'], resolve), name: 's-record' },        //超级物管--能耗管理--抄表记录
    { path: '/adv-message', component: resolve => require(['@/views/modules/adv/MessageAdd'], resolve), name: 'adv-message' },             //运营平台--内容运营--消息推送--推送
    { path: '/Special-shopList', component: resolve => require(['@/views/modules/Jdgo/Special/SpecialShopList'], resolve), name: 'Special-shopList' },             //运营平台--京东购后台--专题列表下的商品列表
    { path: '/Order-OrderInfo', component: resolve => require(['@/views/modules/Jdgo/Order/OrderInfo'], resolve), name: 'Order-OrderInfo' },             //运营平台--京东购后台--订单详情
    { path: '/Shop-GoodsDetail', component: resolve => require(['@/views/modules/Jdgo/Shop/GoodsDetail'], resolve), name: 'Shop-GoodsDetail' },             //运营平台--京东购后台--商品详情
    { path: '/Special-SpecialAdv', component: resolve => require(['@/views/modules/Jdgo/Special/SpecialAdv'], resolve), name: 'Special-SpecialAdv' },             //运营平台--京东购后台--新增广告
    { path: '/res-terminals', component: resolve => require(['@/views/modules/residentNetwork/terminals'], resolve), name: 'res-terminals' },         //运营平台--驻地网--端子列表
    { path: '/tem-business', component: resolve => require(['@/views/modules/residentNetwork/tem-business'], resolve), name: 'tem-business' },         //运营平台--驻地网--端子列表对应的业务详情
    { path: '/cab-segments', component: resolve => require(['@/views/modules/residentNetwork/cab-segments'], resolve), name: 'cab-segments' }         //运营平台--驻地网--光缆列表对应的光缆段列表
  ],
  beforeEnter(to, from, next) {
    let token = Vue.cookie.get('token')
    var iden = Vue.cookie.get('iden')
    if (!token || !/\S/.test(token)) {
      clearLoginInfo()
      if (iden) {
        if (iden == 'opp') {
          next({ name: 'opp-login' })
        }
        if (iden == 'mers') {
          next({ name: 'mers-login' })
        }
        if (iden == 'spmp') {
          next({ name: 'spmp-login' })
        }
        if (iden == 'sys') {
          next({ name: 'sys-login' })
        }
        if (iden == 'vms') {
          next({ name: 'vms-login' })
        }
      } else {
        next({ name: 'login' })
      }
    }
    next()
  }
}


const router = new Router({
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  isAddDynamicMenuRoutes: false, // 是否已经添加动态(菜单)路由
  routes: globalRoutes.concat(mainRoutes)
})

router.beforeEach((to, from, next) => {  // 添加动态(菜单)路由
  // 1. 已经添加 or 全局路由, 直接访问
  // 2. 获取菜单列表, 添加并保存本地存储
  if (router.options.isAddDynamicMenuRoutes || fnCurrentRouteType(to,globalRoutes) === 'global') {
    next()
  } else {
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
        fnAddDynamicMenuRoutes(data.data.menuList)
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

  }
})

/**
 * 判断当前路由类型, global: 全局路由, main: 主入口路由
 * @param {*} route 当前路由
 */
function fnCurrentRouteType(route,globalRoutes = []) {
  var temp = []
  for (var i = 0; i < globalRoutes.length; i++) {
    if (route.path === globalRoutes[i].path) {
      return 'global'
    } else if (globalRoutes[i].children && globalRoutes[i].children.length >= 1) {
      temp = temp.concat(globalRoutes[i].children)
    }
  }
  return temp.length >= 1 ? fnCurrentRouteType(route, temp) : 'main'
}

/**
 * 添加动态(菜单)路由
 * @param {*} menuList 菜单列表
 * @param {*} routes 递归创建的动态(菜单)路由
 */
function fnAddDynamicMenuRoutes(menuList = [], routes = []) {
  //console.log(menuList)
  var temp = []
  for (var i = 0; i < menuList.length; i++) {
    if (menuList[i].list && menuList[i].list.length >= 1) {
      temp = temp.concat(menuList[i].list)
    } else if (menuList[i].url && /\S/.test(menuList[i].url)) {
      if (menuList[i].url) {
        menuList[i].url = menuList[i].url.replace(/^\//, '');
        menuList[i].url = menuList[i].url.replace(/^modules\//, '')
        menuList[i].url = menuList[i].url.replace(/\.html$/, '')
        var route = {
          path: menuList[i].url.replace('/', '-'),
          component: null,
          name: menuList[i].url.replace('/', '-'),
          meta: {
            menuId: menuList[i].menuId,
            title: menuList[i].name,
            isDynamic: true,
            isTab: true,
            iframeUrl: ''
          }
        }
      }

      var route = {
        path: menuList[i].url ? menuList[i].url.replace('/', '-') : '',
        component: null,
        name: menuList[i].url ? menuList[i].url.replace('/', '-') : '',
        meta: {
          menuId: menuList[i].menuId,
          title: menuList[i].name,
          isDynamic: true,
          isTab: true,
          iframeUrl: ''
        }
      }
      // url以http[s]://开头, 通过iframe展示
      if (isURL(menuList[i].url)) {
        route['path'] = `i-${menuList[i].menuId}`
        route['name'] = `i-${menuList[i].menuId}`
        route['meta']['iframeUrl'] = menuList[i].url
      } else {
        try {
          route['component'] = _import(`modules/${menuList[i].url}`) || null
        } catch (e) { }
      }
      routes.push(route)
    }
  }
  if (temp.length >= 1) {
    fnAddDynamicMenuRoutes(temp, routes)
  } else {
    mainRoutes.name = 'main-dynamic'
    mainRoutes.children = routes
    router.addRoutes([
      mainRoutes,
      { path: '*', redirect: { name: '404' } }
    ])
    sessionStorage.setItem('dynamicMenuRoutes', JSON.stringify(mainRoutes.children || '[]'))
    //console.log('\n%c!<-------------------- 动态(菜单)路由 s -------------------->', 'color:blue')
    //console.log(mainRoutes.children)
    //console.log('%c!<-------------------- 动态(菜单)路由 e -------------------->\n\n', 'color:blue')
  }
}


export default router

