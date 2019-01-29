import Vue from "vue";
import App from "@/App";
import router from "@/config/index"; // api: https://github.com/vuejs/vue-router
// import router from "@/router"; // api: https://github.com/vuejs/vue-router
import store from "@/store"; // api: https://github.com/vuejs/vuex
import VueCookie from "vue-cookie"; // api: https://github.com/alfhen/vue-cookie

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// import "@/element-ui"; // api: https://github.com/ElemeFE/element
import "@/icons"; // api: http://www.iconfont.cn/
// import "@/element-ui-theme";
import "@/assets/scss/index.scss";
import httpRequest from "@/utils/httpRequest"; // api: https://github.com/axios/axios
import { isAuth } from "@/utils";
import cloneDeep from "lodash/cloneDeep";
import "@/assets/css/iconfont.css";
import "@/assets/css/global.css";
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

// 非生产环境, 适配mockjs模拟数据                 // api: https://github.com/nuysoft/Mock
// if (process.env.NODE_ENV !== 'production') {
//   require('@/mock')
// }


Object.keys(filters).forEach(key => {
	Vue.filter(key, filters[key]);
});

// 挂载全局
Vue.prototype.$http = httpRequest; // ajax请求方法
Vue.prototype.isAuth = isAuth; // 权限方法

// 保存整站vuex本地储存初始状态

// window.SITE_CONFIG["storeState"] = cloneDeep(store.state);

/* eslint-disable no-new */
new Vue({
	// el: "",
	router,
	// store,
	components: { App }
}).$mount('#app')
