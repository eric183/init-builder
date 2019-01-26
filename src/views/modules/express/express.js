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

export {status, payType, orderType};
