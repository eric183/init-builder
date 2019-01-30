import Vue from 'vue';
import App from './app';
import router from '@/config/index';
import store from "@/store"; // api: https://github.com/vuejs/vuex
// console.log(SERVICE_URL);
// console.log(ENV);
// console.log(process.env.NODE_ENV + 'dasfadsfadsdfsadfdas');

import VueCookie from "vue-cookie"; 


import ElementUI from 'element-ui';

import "@/element-ui"; // api: https://github.com/ElemeFE/element
import "@/element-ui-theme";
import 'element-ui/lib/theme-chalk/index.css';


import "@/icons"; // api: http://www.iconfont.cn/

import "@/assets/scss/index.scss";
import "@/assets/css/global.css";


import httpRequest from "@/utils/httpRequest"; // api: https://github.com/axios/axios
import { isAuth } from "@/utils";
import cloneDeep from "lodash/cloneDeep";
// import "@/assets/css/iconfont.css";
window.SITE_CONFIG = {};
console.log(process.env.NODE_ENV);

import "@/components/dynamic-form";

import lrz from "lrz"; //图片压缩
import math from "mathjs"; //mathjs库--处理js精度确实的问题
// 过滤器
import * as filters from "@/assets/js/filter.js";

Date.prototype.Format = function (fmt) {
	// author: meizz
	var o = {
		"M+": this.getMonth() + 1, // 月份
		"d+": this.getDate(), // 日
		"h+": this.getHours(), // 小时
		"m+": this.getMinutes(), // 分
		"s+": this.getSeconds(), // 秒
		"q+": Math.floor((this.getMonth() + 3) / 3), // 季度
		S: this.getMilliseconds() // 毫秒
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(
			RegExp.$1,
			(this.getFullYear() + "").substr(4 - RegExp.$1.length)
		);
	for (var k in o) {
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(
				RegExp.$1,
				RegExp.$1.length == 1
					? o[k]
					: ("00" + o[k]).substr(("" + o[k]).length)
			);
	}
	return fmt;
};


Vue.use(VueCookie);
Vue.use(ElementUI);
Vue.config.productionTip = false;

Vue.prototype.$math = math;



Object.keys(filters).forEach(key => {
	Vue.filter(key, filters[key]);
});

// 挂载全局
Vue.prototype.$http = httpRequest; // ajax请求方法
Vue.prototype.isAuth = isAuth; // 权限方法


window.SITE_CONFIG["storeState"] = cloneDeep(store.state);


new Vue({
	router,
	store,
    template: "<App />",
    components: { App }
}).$mount('#app')