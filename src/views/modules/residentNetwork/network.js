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
export {businessType, operatorType, businessStatus, download, terminalStatus};
