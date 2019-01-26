/**
 * 生产环境--正式环境
 */
;
(function() {
	window.SITE_CONFIG = {};

	// 代码统计 百度 TODO VINCENT 2018.09.03 --- 
	var _hmt = _hmt || [];
	(function() {
		var hm = document.createElement("script");
		hm.src = "https://hm.baidu.com/hm.js?f1db24787f5e1711bdd6c611e14b4b42";
		var s = document.getElementsByTagName("script")[0];
		s.parentNode.insertBefore(hm, s);
	})();

	// api接口请求地址
	window.SITE_CONFIG['baseUrl'] = 'https://chuneng.louzm.com/business';
	window.SITE_CONFIG['baseUrl2'] = 'https://chuneng.louzm.com/ec'; //店铺等这块儿的接口
	window.SITE_CONFIG['baseUrl5'] = 'https://chuneng.louzm.com/jdgou-ws';           //京东购后台的接口服务   https://jdgou.louzm.com

	// cdn地址 = 域名 + 版本号
	window.SITE_CONFIG['domain'] = './'; // 域名
	window.SITE_CONFIG['version'] = ''; // 版本号(年月日时分)
	window.SITE_CONFIG['cdnUrl'] = window.SITE_CONFIG.domain + window.SITE_CONFIG.version
})();