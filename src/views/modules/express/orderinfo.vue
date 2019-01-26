<template>
    <div>
        <div class="orderstate">
            <p>
                <label>订单类型:</label> <span class="color ml10">{{ orderType(orderObj) }}</span>
            </p>
            <p class="ml30">
                <label>当前订单状态:</label> <span class="color ml10">{{ status(orderObj) }}</span>
            </p>
            <p class="btn_box"><el-button type="success" @click="$router.push({name: 'express-oderlist'})" size="mini">返回列表</el-button></p>
        </div>
        <div class="senderperson_info color_info">
            <h4>寄件人信息:</h4>
            <ul>
                <li><span>下单账号</span> <span>寄件人姓名</span> <span>寄件人地址</span> <span>下单时间</span> <span class="last_span">付款方式</span></li>
                <li class="second_li">
                    <span>{{ orderObj.userAccount }}</span> <span>{{ orderObj.senderName }}</span> <span>{{ orderObj.senderAddress }}</span> <span>{{ orderTime(orderObj) }}</span>
                    <span class="last_span">{{ payType(orderObj) }}</span>
                </li>
            </ul>
        </div>
        <div class="sender_info color_info">
            <h4>寄件信息:</h4>
            <ul>
                <li>
                    <span>快递商</span> <span>快递单号</span> <span>物品类型</span> <span>物品重量</span> <span>订单估价(元)</span> <span>订单实价(元)</span> <span>配送员姓名</span>
                    <span class="last_span">配送员联系方式</span>
                </li>
                <li class="second_li">
                    <span>{{ orderObj.expressCompanyName }}</span> <span>{{ orderObj.expressOrderSn }}</span> <span>{{ orderObj.itemType }}</span> <span>{{ orderObj.actualWeight }}</span>
                    <span>{{ anticipatedPrice(orderObj.anticipatedPrice) }}</span> <span>{{ payAmount(orderObj.payAmount) }}</span> <span>{{ orderObj.deliverName }}</span>
                    <span class="last_span">{{ orderObj.deliverContact }}</span>
                </li>
            </ul>
        </div>
        <div class="person_info color_info">
            <h4>收货人信息:</h4>
            <ul>
                <li><span>姓名</span> <span>联系电话</span> <span class="last_span">送货地址</span></li>
                <li class="second_li">
                    <span>{{ orderObj.receiverName }}</span> <span>{{ orderObj.receiverContact }}</span> <span class="last_span">{{ orderObj.receiverAddress }}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import commonFunc from '@/assets/common.js';
import {status, orderType, payType} from './express.js';
export default {
    data() {
        return {
            orderId: null,
            orderObj: {},
        };
    },
    activated() {
        this.orderId = this.$route.query.orderId; //路由跳转拿到参数
        this.getDataList();
    },
    methods: {
        // 获取数据列表
        getDataList() {
            this.$http({
                url: this.$http.adornUrl('/v1/express/orders/' + this.orderId + '/details'),
                method: 'get',
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.orderObj = data.data;
                }
            });
        },
        //  订单类型转换
        orderType(item) {
            return orderType(item.orderType);
        },
        //   订单状态转换
        status(item) {
            return status(item.status);
        },
        //   下单时间转换
        orderTime(item) {
            return commonFunc.commonFunc(item.orderTime);
        },
        // 支付方式
        payType(item) {
            return payType(item.payType);
        },
        // 后端返回的分转换成元
        anticipatedPrice(anticipatedPrice) {
            return anticipatedPrice / 100;
        },
        payAmount(payAmount) {
            return payAmount / 100;
        },
    },
};
</script>
<style lang="scss" scoped>
.orderstate {
    display: flex;
    font-weight: 700;
    font-size: 14px;
    .btn_box {
        flex: 1;
        text-align: right;
    }
}
.color {
    color: #67c23a;
}
.color_info {
    color: #606266;
    ul {
        padding: 0;
        li {
            display: flex;
            span {
                border-top: 1px solid #ebeef5;
                border-left: 1px solid #ebeef5;
                padding: 22px 0;
                text-align: center;
            }
            span.last_span {
                border-right: 1px solid #ebeef5;
            }
        }
        .second_li {
            span {
                border-bottom: 1px solid #ebeef5;
            }
        }
    }
}
.senderperson_info {
    ul {
        li {
            span {
                width: 20%;
            }
        }
    }
}
.sender_info {
    ul {
        li {
            span {
                width: 12.5%;
            }
        }
    }
}
.person_info {
    ul {
        li {
            span {
                width: 33.3%;
            }
        }
    }
}
</style>
