//此文件存组件中的公共方法

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
export default {
    commonFunc,
    commonFunc2
}
