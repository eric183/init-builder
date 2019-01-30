import Vue from 'vue';
import axios from 'axios';
import router from '@/router';
import qs from 'qs';
import merge from 'lodash/merge';
import { clearLoginInfo } from '@/utils';

const http = axios.create({
	timeout: 1000 * 30,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json; charset=utf-8'
	}
});

/**
 * 请求拦截
 */
http.interceptors.request.use(
	config => {
		if(Vue.cookie.get('token')) {
			config.headers['token'] = Vue.cookie.get('token'); // 请求头带上token
		}

		if(Vue.cookie.get('log') === 'web') {
			config.headers['ws-client'] = 'web';
		} else {
			config.headers['ws-client'] = 'vm';
		}
		// console.log(config.headers)
		return config;
	},
	error => {
		return Promise.reject(error);
	}
);

/**
 * 响应拦截
 */
http.interceptors.response.use(
	response => {
		return response;
	},
	error => {
		if(error.response === undefined) {
			Vue.prototype.$message.error('网络异常或服务器异常');
			return error;
		}
		if(error.response.status === 401) {
			Vue.prototype.$message.error('' + error.response.data.code + '   ' + error.response.data.message);
			clearLoginInfo();
			if(Vue.cookie.get('iden') === 'opp') {
				router.push({ name: 'opp-login' });
			}
			if(Vue.cookie.get('iden') === 'spmp') {
				router.push({ name: 'spmp-login' });
			}
			if(Vue.cookie.get('iden') === 'mers') {
				router.push({ name: 'mers-login' });
			}
			if(Vue.cookie.get('iden') === 'sys') {
				router.push({ name: 'sys-login' });
			}
			if(Vue.cookie.get('iden') === 'vms') {
				router.push({ name: 'vms-login' });
			}
			if(!Vue.cookie.get('iden')) {
				router.push({ name: 'login' });
			}
			throw error.response.data;
		} else {
			if(error.response.data.code){
				Vue.prototype.$message.error('' + error.response.data.code + '   ' + error.response.data.message)
			  }else{
				if(error.response.status == 406){
				  Vue.prototype.$message.error('' + error.response.status + '   ' + '权限不通过,请检查')
				}
				
			  }  
		}
		return error.response;
	}
);

/**
 * 请求地址处理
 * @param {*} actionName action方法名称
 */
// business 接口
http.adornUrl = actionName => {
	// 非生产环境 && 开启代理, 接口前缀统一使用[/proxyApi/]前缀做代理拦截!
	// debugger;
	return true;
	return (process.env.NODE_ENV !== 'production' && process.env.OPEN_PROXY ? '/proxyApi/' : window.SITE_CONFIG.baseUrl) + actionName;
};
// ec 接口
http.adornUrl2 = actionName => {
	// 非生产环境 && 开启代理, 接口前缀统一使用[/proxyApi/]前缀做代理拦截!
	return (process.env.NODE_ENV !== 'production' && process.env.OPEN_PROXY ? '/ecProxyApi/' : window.SITE_CONFIG.baseUrl2) + actionName;
};
// mock文档接口
http.adornUrl3 = actionName => {
	// 非生产环境 && 开启代理, 接口前缀统一使用[/proxyApi/]前缀做代理拦截!
	return (process.env.NODE_ENV !== 'production' && process.env.OPEN_PROXY ? '/mockProxyApi/' : window.SITE_CONFIG.baseUrl3) + actionName;
};
// 人脸接口
http.adornUrl4 = actionName => {
	// 非生产环境 && 开启代理, 接口前缀统一使用[/proxyApi/]前缀做代理拦截!
	return (process.env.NODE_ENV !== 'production' && process.env.OPEN_PROXY ? '/faceProxyApi/' : window.SITE_CONFIG.baseUrl4) + actionName;
};
// 京东购后台的接口服务
http.adornUrl5 = actionName => {
	// 非生产环境 && 开启代理, 接口前缀统一使用[/proxyApi/]前缀做代理拦截!
	return (process.env.NODE_ENV !== 'production' && process.env.OPEN_PROXY ? '/api/' : window.SITE_CONFIG.baseUrl5) + actionName;
};
/**
 * get请求参数处理
 * @param {*} params 参数对象
 * @param {*} openDefultParams 是否开启默认参数?
 */
http.adornParams = (params = {}, openDefultParams = true) => {
	var defaults = {
		t: new Date().getTime()
	};
	return openDefultParams ? merge(defaults, params) : params;
};

/**
 * post请求数据处理
 * @param {*} data 数据对象
 * @param {*} openDefultdata 是否开启默认数据?
 * @param {*} contentType 数据格式
 *  json: 'application/json; charset=utf-8'
 *  form: 'application/x-www-form-urlencoded; charset=utf-8'
 */
http.adornData = (data = {}, openDefultdata = true, contentType = 'json') => {
	var defaults = {
		t: new Date().getTime()
	};
	data = openDefultdata ? merge(defaults, data) : data;
	return contentType === 'json' ? JSON.stringify(data) : qs.stringify(data);
};

export default http;
