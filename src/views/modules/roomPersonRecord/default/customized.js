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
export {bookingType, genderType, isBooked, download};
