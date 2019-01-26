/**
 * 验收环境--预发布
 */
;
(function() {
	window.SITE_CONFIG = {};
	// 代码统计 百度 TODO VINCENT 2018.09.03 --- 
	var _hmt = _hmt || [];
	(function() {
		console.log("enter");
		var hm = document.createElement("script");
		hm.src = "https://hm.baidu.com/hm.js?5d036e479669c61ed17f34fc2b1dec47";
		var s = document.getElementsByTagName("script")[0];
		s.parentNode.insertBefore(hm, s);
	})();
	// api接口请求地址 
	window.SITE_CONFIG['baseUrl'] = 'https://chuneng.louzm.cn/business';
	window.SITE_CONFIG['baseUrl2'] = 'https://chuneng.louzm.cn/ec'; 		 //店铺等这块儿的接口
	window.SITE_CONFIG['baseUrl5'] = 'https://chuneng.louzm.cn/jdgou-ws';           //京东购后台的接口服务   https://jdgou.louzm.cn

	// cdn地址 = 域名 + 版本号
	window.SITE_CONFIG['domain'] = './'; // 域名
	window.SITE_CONFIG['version'] = ''; // 版本号(年月日时分)
	window.SITE_CONFIG['cdnUrl'] = window.SITE_CONFIG.domain + window.SITE_CONFIG.version
})();