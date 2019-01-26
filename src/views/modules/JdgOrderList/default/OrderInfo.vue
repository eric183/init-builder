<template>
    <el-row>
        <el-row class="content_box order_info">
            <ul>
                <li class="title">订单信息</li>
                <li class="content_li order_title">
                    <span>京东订单编号</span> <span>平台订单编号</span> <span>下单时间</span> <span>付款时间</span> <span>收件人</span> <span>收件人电话</span> <span>快递费/元</span>
                    <span>订单状态</span> <span>支付方式</span> <span>订单总额/元</span>
                </li>
                <li class="content_li order_num">
                    <span>{{ orderInfo.jdOrderChild }}</span> <span>{{ orderInfo.orderSn }}</span> <span>{{ orderInfo.orderTime | timeFormate }}</span>
                    <span>{{ orderInfo.payTime | timeFormate }}</span> <span>{{ orderInfo.receiverName }}</span> <span>{{ orderInfo.receiverContact }}</span>
                    <span>￥{{ orderInfo.deliveryFee | newPrice }}</span> <span>{{ orderInfo.status | orderStatus }}</span> <span>{{ orderInfo.payType | payType }}</span>
                    <span>￥{{ orderInfo.totalAmount | newPrice }}</span>
                </li>
            </ul>
            <ul>
                <li class="title">商品信息</li>
                <li class="content_li shop_title"><span>商品编码</span> <span class="shop_name">商品名称</span> <span>购买数量</span> <span>单价</span> <span>单价合计</span></li>
                <li class="content_li shop_num" v-for="(item, index) in orderInfo.goods" :key="index">
                    <span>{{ item.skuId }}</span> <span class="shop_name">{{ item.goodsName }}</span> <span>{{ item.goodsNum }}</span> <span>￥{{ item.salePrice | newPrice }}</span>
                    <span>￥{{ (item.goodsNum * item.salePrice) | newPrice }}</span>
                </li>
            </ul>
            <ul>
                <li class="title">用户信息</li>
                <li class="content_li user_title"><span>用户ID</span> <span>用户姓名</span> <span>收货人姓名</span> <span>收货人电话</span> <span class="user_location">收货地址</span></li>
                <li class="content_li user_num">
                    <span>{{ orderInfo.userId }}</span> <span>{{ orderInfo.userName }}</span> <span>{{ orderInfo.receiverName }}</span> <span>{{ orderInfo.receiverContact }}</span>
                    <span class="user_location">{{ orderInfo.receiverAddress }}</span>
                </li>
            </ul>
        </el-row>
    </el-row>
</template>
<script>
export default {
    data() {
        return {
            orderInfo: {},
        };
    },
    activated() {
        this.getOrderInfo();
    },
    methods: {
        getOrderInfo() {
            this.$http({
                url: this.$http.adornUrl5('/v1/tra/order/' + this.$route.query.id),
                method: 'get',
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.orderInfo = data.data;
                }
            });
        },
    },
};
</script>
<style lang="scss" scoped>
ul {
    padding-left: 0;
    margin-top: 0;
}
.content_box {
    .title {
        padding: 15px 20px;
        background: #e4e4e4;
        color: #000;
        font-weight: 700;
    }
    .content_li {
        display: flex;
        justify-content: space-between;
        text-align: center;
        padding: 15px 0;
    }
    .order_title {
        background: #f2f2f2;
        span {
            width: 10%;
        }
    }
    .shop_title {
        background: #f2f2f2;
        span {
            width: 15%;
        }
        .shop_name {
            width: 40%;
        }
    }
    .user_title {
        background: #f2f2f2;
        span {
            width: 15%;
        }
        .user_location {
            width: 40%;
        }
    }
    .order_num {
        border: 1px solid #c9c9c9;
        span {
            width: 11.1%;
        }
    }
    .shop_num {
        border: 1px solid #c9c9c9;
        span {
            width: 15%;
        }
        .shop_name {
            width: 40%;
        }
    }
    .user_num {
        border: 1px solid #c9c9c9;
        span {
            width: 15%;
        }
        .user_location {
            width: 40%;
        }
    }
}
</style>
