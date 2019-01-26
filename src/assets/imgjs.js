var timeStamp=(new Date()).getTime();
//获取当前时间
var date = new Date();
var year = date.getFullYear();
var month = date.getMonth() + 1;
var day = date.getDate();
if (month < 10) {
    month = "0" + month;
}
if (day < 10) {
    day = "0" + day;
}
var yyyyMMdd = year + month + day;

var roomImguRL='/business/meet/room/'+yyyyMMdd+'/'                        //会议室新增的封面图
var advertisements='/business/mkt/advertisements/'+yyyyMMdd+'/'              //广告页
var discoveries='/business/info/discoveries/'+yyyyMMdd+'/'              //资讯管理封面图,内容图
var act_infos='/business/act/infos/'+yyyyMMdd+'/'                       //活动管理封面图
var act_interactives='/business/act/interactives/'+yyyyMMdd+'/'         //活动管理内容图
var tickets='/business/pm/tickets/'+yyyyMMdd+'/'                        //工单上传图片
var shops='/ec/merchant/shops/'+yyyyMMdd+'/'                        //店铺封面图片,店铺logo图片
var goods='/ec/product/goods/'+yyyyMMdd+'/'                             //商品上传图片
var galleries='/business/info/galleries/'+yyyyMMdd+'/'                        //相册封面
var photos='/business/info/photos/'+yyyyMMdd+'/'                        //相片上传（相册模块）
var visitor='/business/visitor/advertisements/'+yyyyMMdd+'/'                        //轮播图（访客机）,全屏图（访客机）
var superdevices='/business/super/devices/'+yyyyMMdd+'/'                        //超级设备管理图片
var fixDevice='/business/super/fixDevice/'+yyyyMMdd+'/'                        //维修工单管理图片
var fixDevice_feedback='/business/super/fixDevice_feedback/'+yyyyMMdd+'/'                        //维修工单管理反馈图片
var workerOrder='/business/super/workerOrder/'+yyyyMMdd+'/'                        //常规工单管理反馈图片
var faceurlMkdir='/face/'+yyyyMMdd+'/'                        //人脸数据
var visitorFaceMkdir='/visitorFace/'+yyyyMMdd+'/'                        //访客人脸数据
var blacklistFaceMkdir='/blacklistFace/'+yyyyMMdd+'/'                        //访客人脸数据
var jdgouAdvertisements='/business/mkt/advertisements/'+yyyyMMdd+'/'              //京东购---广告页

export {
    roomImguRL,
    advertisements,
    discoveries,
    act_infos,
    act_interactives,
    tickets,shops,
    goods,
    galleries,
    photos,
    visitor,
    superdevices,
    fixDevice,
    fixDevice_feedback,
    workerOrder, 
    faceurlMkdir, 
    visitorFaceMkdir, 
    blacklistFaceMkdir , 
    jdgouAdvertisements
}
