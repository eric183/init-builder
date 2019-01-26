// 价格，金钱  除以100-----价格格式化
let newPrice = value=>{
    if(value){
        return value/100
    }else{
        return 0
    }
}

// 时间  时间戳 -->> 时间
let timeFormate = time=>{
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
        time = timeInfo;
        return time
    }
}

// 订单-状态
let orderStatus = value=>{
    if(value){
        switch(value){
            case 1:
                return "待付款"
            break;
            case 2:
                return "待发货"
            break;
            case 3:
                return "待收货"
            break;
            case 4:
                return "已完成"
            break;
            case 5:
                return "已关闭"
            break;
        }
    }
}

// 支付-状态
let payType = value=>{
    switch(value){
        case 10:
            return "微信APP"
        break;
        case 11:
            return "微信公众号"
        break;
        case 12:
            return "微信H5"
        break;
        case 20:
            return "支付宝APP"
        break;
        default:
            return "暂未支付"
        break;
    }
}

// 上下架-状态
let upperState = value=>{
    switch(value){
        case 1:
            return "上架"
        break;
        case 0:
            return "下架"
        break;
    }
}

// 是否-状态
let enableState = value=>{
    switch(value){
        case 1:
            return "是"
        break;
        case 0:
            return "否"
        break;
    }
}

// 上下架-状态
let stockState = value=>{
    switch(value){
        case 33:
            return "有货 现货-下单立即发货"
        break;
        case 39:
            return "有货 在途-正在内部配货，预计2~6天到达本仓库"
        break;
        case 40:
            return "有货 可配货-下单后从有货仓库配货 "
        break;
        case 36:
            return "预订"
        break;
        case 34:
            return "无货"
        break;
    }
}
// 设备类型 ---物管平台的工单 ----暂时废弃
let deviceTypeFormate = value=>{
    switch(value){
        case 1:
            return "道闸"
        break;
        case 2:
            return "门禁"
        break;
        case 3:
            return "电表"
        break;
        case 4:
            return "水表"
        break;
        case 5:
            return "冷量表"
        break;
        case 6:
            return "电梯"
        break;
        case 7:
            return "照明控制系统"
        break;
        case 8:
            return "监控摄像头"
        break;
        case 9:
            return "高低压电柜"
        break;
        case 10:
            return "变压器"
        break;
        case 11:
            return "送排风机"
        break;
        case 12:
            return "集水井"
        break;
        case 13:
            return "水箱"
        break;
        case 14:
            return "空气处理机组"
        break;
        case 15:
            return "新风机"
        break;
        case 16:
            return "盘管机"
        break;
        case 17:
            return "中央空调群控"
        break;
    }
}
// 工单类型 ---物管平台的工单
let orderStateFormate = value=>{
    switch(value){
        case 1:
            return "待接收"
        break;
        case 2:
            return "待处理"
        break;
        case 3:
            return "处理中"
        break;
        case 4:
            return "处理完成"
        break;
        case 5:
            return "暂停中"
        break;
        case 6:
            return "已验收"
        break;
        case 7:
            return "已关闭"
        break;
    }
}
export {newPrice , orderStatus , payType , timeFormate , upperState , enableState , stockState , deviceTypeFormate , orderStateFormate}
