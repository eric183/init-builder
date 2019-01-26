// 1.时间戳转换
function commonFunc(time) {
    //时间戳转换
    if(time==null){
        return ''
    }else{
        const date = new Date(time);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        var minute = date.getMinutes();
        var second = date.getSeconds();
        minute = minute < 10 ? ('0' + minute) : minute;
        second = second < 10 ? ('0' + second) : second;
        const timeInfo = y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
        // const timeInfo = y + '-' + m + '-' + d;
        time = timeInfo;
        return time
    }
}
function commonFunc2(time) {
    //时间戳转换            年月日
    if(time==null){
        return ''
    }else{
        const date = new Date(time);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        const timeInfo = y + '-' + m + '-' + d;
        time = timeInfo;
        return time
    }
}

// 2.图片的路径
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

var roomImguRL='/business/meet/room/'+yyyyMMdd+'/'                          //会议室新增的封面图
var advertisements='/business/mkt/advertisements/'+yyyyMMdd+'/'             //广告页
var discoveries='/business/info/discoveries/'+yyyyMMdd+'/'                  //资讯管理封面图,内容图
var act_infos='/business/act/infos/'+yyyyMMdd+'/'                           //活动管理封面图
var act_interactives='/business/act/interactives/'+yyyyMMdd+'/'             //活动管理内容图
var tickets='/business/pm/tickets/'+yyyyMMdd+'/'                            //工单上传图片
var shops='/ec/merchant/shops/'+yyyyMMdd+'/'                                //店铺封面图片,店铺logo图片
var goods='/ec/product/goods/'+yyyyMMdd+'/'                                 //商品上传图片
var galleries='/business/info/galleries/'+yyyyMMdd+'/'                      //相册封面
var photos='/business/info/photos/'+yyyyMMdd+'/'                            //相片上传（相册模块）
var visitor='/business/visitor/advertisements/'+yyyyMMdd+'/'                //轮播图（访客机）,全屏图（访客机）
var superdevices='/business/super/devices/'+yyyyMMdd+'/'                    //超级设备管理图片
var fixDevice='/business/super/fixDevice/'+yyyyMMdd+'/'                     //维修工单管理图片
var fixDevice_feedback='/business/super/fixDevice_feedback/'+yyyyMMdd+'/'   //维修工单管理反馈图片
var workerOrder='/business/super/workerOrder/'+yyyyMMdd+'/'                 //常规工单管理反馈图片
var faceurlMkdir='/face/'+yyyyMMdd+'/'                                      //人脸数据
var visitorFaceMkdir='/visitorFace/'+yyyyMMdd+'/'                           //访客人脸数据
var blacklistFaceMkdir='/blacklistFace/'+yyyyMMdd+'/'                       //访客人脸数据
var jdgouAdvertisements='/business/mkt/advertisements/'+yyyyMMdd+'/'        //京东购---广告页

// 转换
// 下载文件
function download(data, name) {
    if (!data) {
        return;
    }
    let url = window.URL.createObjectURL(new Blob([data]));
    let link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.setAttribute('download', name);
    document.body.appendChild(link);
    link.click();
}
// 用餐类型
function bookingType(type) {
    switch (type) {
        case 1:
            return '早餐';
            break;
        case 2:
            return '午餐';
            break;
        case 3:
            return '晚餐';
            break;
    }
}
// 男女性别
function genderType(type) {
    switch (type) {
        case 1:
            return '男';
            break;
        case 2:
            return '女';
            break;
        default:
            return '未填';
            break;
    }
}
// 是否预约
function isBooked(type) {
    switch (type) {
        case 0:
            return '未预约';
            break;
        case 1:
            return '已预约';
            break;
    }
}
// 业务类型
function businessType(type) {
    switch (type) {
        case 1:
            return 'ADSL';
            break;
        case 2:
            return '数据';
            break;
        case 3:
            return '语音';
            break;
    }
}
// 运营商
function operatorType(type) {
    switch (type) {
        case 1:
            return '移动';
            break;
        case 2:
            return '联通';
            break;
        case 3:
            return '电信';
            break;
    }
}
// 业务状态
function businessStatus(type) {
    switch (type) {
        case 1:
            return '在用';
            break;
        case 2:
            return '停用';
            break;
    }
}
// 端子状态
function terminalStatus(type) {
    switch (type) {
        case 1:
            return '在用';
            break;
        case 2:
            return '停用';
            break;
        case 3:
            return '空闲';
            break;
    }
}
// 快递订单状态
function status(status) {
    switch (status) {
        case 1:
            return '待取件';
            break;
        case 2:
            return '已发出';
            break;
        case 3:
            return '已签收';
            break;
        case 4:
            return '已取消';
            break;
    }
}

// 支付方式
function payType(payType) {
    switch (payType) {
        case 10:
            return '微信APP';
            break;
        case 11:
            return '微信公众号';
            break;
        case 12:
            return '微信H5';
            break;
        case 20:
            return '支付宝APP';
            break;
    }
}

// 订单类型转换
function orderType(orderType) {
    switch (orderType) {
        case 1:
            return '寄件';
            break;
    }
}

// 工单类型
function type(type) {
    switch (type) {
        case 1:
            return "咨询求助"
            break;
        case 2:
            return "报修"
            break;
        case 3:
            return "投诉建议"
            break;
    }
}
// 设备计划状态
function devicestatus(status) {
    switch (status) {
        case 1:
            return "新建"
            break;
        case 2:
            return "执行中"
            break;
        case 3:
            return "暂停中"
            break;
        case 4:
            return "终止"
            break;
    }
}
// 设备计划规则
function rule(rule) {
    switch (rule) {
        case 1:
            return "单次"
            break;
        case 2:
            return "循环"
            break;
    }
}
// 设备计划工作类型
function devicetype(type) {
    switch (type) {
        case 1:
            return "巡检"
            break;
        case 2:
            return "保养"
            break;
    }
}
// 设备任务状态
function taskstatus(status) {
    switch (status) {
        case 1:
            return "响应超时"
            break;
        case 2:
            return "待接收"
            break;
        case 3:
            return "处理中"
            break;
        case 4:
            return "任务完成"
            break;
        case 5:
            return "正常结束"
            break;
        case 6:
            return "任务超时"
            break;
        case 7:
            return "异常结束"
            break;
    }
}
// 工单严重程度
function importance(importance) {
    switch (importance) {
        case 2:
            return "建议"
            break;
        case 4:
            return "提示"
            break;
        case 6:
            return "一般"
            break;
        case 8:
            return "严重"
            break;
        case 10:
            return "致命"
            break;
    }
}
// 识别json格式字符串
function isJSON(str) {
    if (typeof str == 'string') {
        try {
            var obj = JSON.parse(str);
            if (str.indexOf('{') > -1) {
                return true;
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }
    }
    return false;
}
// 工单优先级
function priority(priority) {
    switch (priority) {
        case 1:
            return "无关紧要"
            break;
        case 3:
            return "低"
            break;
        case 5:
            return "中"
            break;
        case 7:
            return "高"
            break;
        case 9:
            return "紧急"
            break;
    }
}
const prioritys = ['全部','不紧急', '不严重', '一般紧急', '一般严重', '比较紧急', '比较严重', '很紧急', '很严重', '特别紧急', '特别严重'];
const order_origin = ['全部','手动创建', '用户App', '物业App'];
const fix_status = ['全部','待接收', '待处理', '处理中', '处理完成','暂停中','已验收','已关闭'];
const order_type = ['全部','投诉建议', '咨询求助', '环境保洁','公共区域报修','企业报修'];
export {
    commonFunc,
    commonFunc2,
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
    jdgouAdvertisements,
    bookingType, 
    genderType, 
    isBooked, 
    download,
    businessType, 
    operatorType, 
    businessStatus,
    terminalStatus,
    status,  
    payType, 
    orderType,
    prioritys,
    order_origin,
    fix_status,
    order_type,
    devicetype, 
    taskstatus ,
    isJSON,
    rule,
    importance,
    devicestatus,
    priority,
    type
}