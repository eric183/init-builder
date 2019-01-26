/**
 * 开发环境
 */
;(function () {
  window.SITE_CONFIG = {};

  // api接口请求地址
  window.SITE_CONFIG['baseUrl'] = 'http://bro.f3322.org:7000/business';
   window.SITE_CONFIG['baseUrl2'] = 'http://bro.f3322.org:7000/ec';           //店铺等这块儿的接口
   window.SITE_CONFIG['baseUrl4'] = 'http://bro.f3322.org:7000/face-service';    //人脸接口
   window.SITE_CONFIG['baseUrl3'] = 'http://rap2.helloio.cn:8887/app/mock/22';     //mock数据接口
   window.SITE_CONFIG['baseUrl5'] = 'http://bro.f3322.org:7000/jdgou-ws';           //京东购后台的接口服务

  // cdn地址 = 域名 + 版本号
  window.SITE_CONFIG['domain']  = './'; // 域名
  window.SITE_CONFIG['version'] = '';   // 版本号(年月日时分)
  window.SITE_CONFIG['cdnUrl']  = window.SITE_CONFIG.domain + window.SITE_CONFIG.version
})();
