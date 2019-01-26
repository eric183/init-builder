<template>
    <div class="order">
        <!-- 订单列表 -->
        <div class="order-list">
            <el-form :inline="true" class="demo-form-inline" size="small">
                <el-form-item label="店铺:" v-if="!isShopkeeper" class="shopDiv">
                    <el-select v-model="orderSearch.shopId" @change="shopSearch(orderSearch.shopId)" clearable>
                        <el-option v-for="item in shopList" :key="item.shopId" :label="item.shopName" :value="item.shopId"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item> <el-input placeholder="请输入订单编号" v-model="orderSearch.orderSn" clearable></el-input> </el-form-item>
                <el-form-item> <el-input placeholder="请输入手机号" v-model="orderSearch.userAccount" clearable></el-input> </el-form-item>
                <!-- <el-form-item label="付款方式:">
                <el-select placeholder="全部" v-model="orderSearch.payType">
                    <el-option
                        v-for="item in payType"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item> -->
                <el-form-item>
                    <el-date-picker
                        v-model="searchDate"
                        type="daterange"
                        value-format="yyyy-MM-dd"
                        unlink-panels
                        range-separator="-"
                        start-placeholder="开始"
                        end-placeholder="结束"
                        @change="getTime"
                        clearable
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-if="isAuth('transaction:orders:getOrderList')" @click="searchInfo">查询</el-button>
                    <el-button type="success" v-if="isShopkeeper" @click="pdf(1)">导出当前页</el-button>
                    <el-button type="success" v-if="isShopkeeper" @click="pdf(0)">导出全部</el-button>
                    <el-button type="success" v-if="!isShopkeeper" @click="pdfOperate(1)">导出当前页</el-button>
                    <el-button type="success" v-if="!isShopkeeper" @click="pdfOperate(0)">导出全部</el-button>
                    <el-button type="success" v-if="!isShopkeeper" @click="pdfPay">导出已支付</el-button>
                    <el-button type="success" v-if="!isShopkeeper" @click="pdfRefund">导出已退款</el-button>
                </el-form-item>
            </el-form>
            <div class="list-info">
                <el-tabs type="card" @tab-click="toggle">
                    <!-- :label="item.label+orderNumber($index,item.total)" -->
                    <el-tab-pane v-for="(item, $index) of orderStatus" :key="$index" :label="item.label"> </el-tab-pane>
                    <el-table :data="tableData" center="all" border style="width: 100%">
                        <el-table-column align="center" type="index" label="序号" width="50"> </el-table-column>
                        <el-table-column align="center" prop="orderSn" label="订单编号">
                            <template slot-scope="scope">
                                <span class="color_name" @click="showDeail(scope.row)">{{ scope.row.orderSn }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="orderTime" :formatter="orderTime" label="下单时间"> </el-table-column>
                        <el-table-column align="center" prop="receiverName" label="收货人"> </el-table-column>
                        <el-table-column align="center" prop="receiverContact" label="收货人联系方式"> </el-table-column>
                        <el-table-column align="center" prop="payAmount" label="订单金额(元)">
                            <template slot-scope="scope">
                                <span>{{ scope.row.payAmount / 100 }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="payType" :formatter="payText" label="付款方式"> </el-table-column>
                        <el-table-column align="center" prop="orderStatus" :formatter="statusText" label="订单状态"> </el-table-column>
                        <el-table-column align="center" width="270" label="操作">
                            <template slot-scope="scope">
                                <!-- v-if="isShopkeeper" -->
                                <el-button v-if="isAuth('transaction:orders:getOrderDetails')" type="primary" plain size="mini" @click="showDeail(scope.row)">详情</el-button>
                                <el-button type="success" plain size="mini" @click="advertEdit(scope.row, 1)" v-show="btnShow(scope.row) && isAuth('transaction:orders:updateOrder')">
                                    {{ btnTxtBtn(scope.row) }}
                                </el-button>
                                <el-button type="danger" plain size="mini" @click="advertEdit(scope.row, 2)" v-show="btnShowInfo(scope.row) && isAuth('transaction:orders:updateOrder')">
                                    {{ btnTxt(scope.row) }}
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tabs>
            </div>
            <div class="pagin">
                <el-pagination
                    layout="total, sizes, prev, pager, next, jumper"
                    @size-change="sizeChangeHandle"
                    @current-change="currentchange"
                    :current-page="orderSearch.pageNum"
                    :total="total"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="orderSearch.pageSize"
                >
                </el-pagination>
            </div>
        </div>
        <el-dialog title="原因" :visible.sync="dialogVisible" :close-on-click-modal="false" @close="closeFun" width="30%">
            <el-form label-width="100px">
                <div class="dialogbox">
                    <el-form-item label="原因"> <el-input type="textarea" v-model="textarea" :autosize="{minRows: 2, maxRows: 4}" placeholder="请输入内容"> </el-input> </el-form-item>
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="refund">确 定</el-button>
            </span>
        </el-dialog>
        <!-- <close-reason v-show="dialogVisible"></close-reason> -->
        <!-- 订单发货的弹出框 -->
        <sendGoods ref="sendGoods" @refreshDataList="searchOrder"></sendGoods>
        <!--导出已支付、已退款的弹出框 -->
        <orderPayOrRefund ref="orderPayOrRefund"></orderPayOrRefund>
    </div>
</template>

<script>
import sendGoods from './sendGoods';
import orderPayOrRefund from './order-pay-or-refund';
import {download ,commonFunc,commonFunc2} from '@/utils/resources/index.js';
export default {
    components: {
        sendGoods,
        orderPayOrRefund,
    },
    data() {
        return {
            shopList: [], //店铺下拉列表
            searchDate: [new Date(), new Date()], //日期查询
            order: {},
            orderSearch: {
                shopId: null,
                pageNum: 1,
                pageSize: 10,
                payType: null,
                minTime: null,
                maxTime: null,
                orderSn: '',
                orderStatus: null,
                userAccount: '',
            },
            total: null,
            pages: 0,
            page: {
                //广告列表
                name: '',
                pageNum: 1,
                pageSize: 8,
                status: 1,
                type: '',
            },
            tableData: [],
            payType: [
                {
                    value: '',
                    label: '全部',
                },
                {
                    //支付方式
                    value: 10,
                    label: '微信APP',
                },
                {
                    value: 11,
                    label: '微信公众号',
                },
                {
                    value: 12,
                    label: '微信H5',
                },
                {
                    value: 20,
                    label: '支付宝APP',
                },
            ],
            orderStatus: [
                {
                    value: null,
                    label: '全部',
                    total: null,
                },
                {
                    value: 1,
                    label: '待付款',
                    total: null,
                },
                {
                    value: 2,
                    label: '待接单',
                    total: null,
                },
                {
                    value: 3,
                    label: '待发货',
                    total: null,
                },
                {
                    value: 4,
                    label: '待收货',
                    total: null,
                },
                {
                    value: 5,
                    label: '已完成',
                    total: null,
                },
                {
                    value: 6,
                    label: '已关闭',
                    total: null,
                },
            ],
            shops: [], //本地存储取出来的登录的角色（身份）的，数组为0则为运营，否则为店主的角色
            isShopkeeper: false, //对订单的按钮（发货等）操作的
            active: '',
            orderType: {
                type: '',
                reason: null,
            },
            newOrder: null,
            dialogVisible: false,
            textarea: '',
            orderIsNum: null, //退款等按钮的点击的状态--用来打开原因的弹框的
        };
    },
    activated() {
        this.getShopInfo();
        this.searchOrder();
        //this.data();
        //  this.orderTotal();
    },
    mounted() {
        this.data();
    },
    methods: {
        //  初始化时间
        data() {
            const end = new Date();
            this.searchDate = [end, end];
            this.orderSearch.minTime = commonFunc2(end.getTime());
            this.orderSearch.maxTime = commonFunc2(end.getTime());
        },
        // 从本地存储取出店铺id和角色信息
        getShopInfo() {
            this.shops = JSON.parse(sessionStorage.getItem('shops') || '[]');
            // 店主的角色
            if (this.shops.length > 0) {
                this.isShopkeeper = true;
                this.orderSearch.shopId = this.shops[0].shopId;
                //this.orderTotal();
            } else {
                this.isShopkeeper = false;
                this.getShopList(); //运营的身份
                //this.orderTotal();
            }
            this.getShopList();
        },
        // 查看店铺下拉列表
        getShopList() {
            this.$http
                .get(this.$http.adornUrl2('/v1/merchant/shops/options'))
                .then(res => {
                    //console.log(res.data.data.options)
                    if (res.data.code === 200) {
                        this.shopList = res.data.data.options;
                    }
                })
                .catch(err => {
                    //console.log(err)
                });
        },
        // 每页数
        sizeChangeHandle(val) {
            this.orderSearch.pageSize = val;
            this.orderSearch.pageNum = 1;
            this.searchOrder();
        },
        // 分页
        currentchange(value) {
            this.orderSearch.pageNum = value;
            this.searchOrder();
        },
        // 店铺下拉选择
        shopSearch(shopId) {
            this.orderSearch.shopId = shopId;
            //console.log(shopId)
            this.orderSearch.pageNum = 1;
            this.searchOrder();
        },
        //查看详情
        btnTxtBtn(items) {
            const orderStatus = items.orderStatus;
            if (orderStatus === 2) {
                return '立即接单';
            } else if (orderStatus === 3) {
                return '订单发货';
            } else if (orderStatus === 5) {
                return '退款处理';
            }
        },
        btnTxt(items) {
            const orderStatus = items.orderStatus;
            if (orderStatus === 2) {
                return '拒绝接单';
            } else if (orderStatus === 3) {
                return '取消订单';
            } else {
                return '123';
            }
        },
        btnShow(items) {
            const orderStatus = items.orderStatus;
            if (orderStatus == 2) {
                return true;
            } else if (orderStatus == 3) {
                return true;
            } else if (orderStatus == 5) {
                return true;
            }
            return false;
        },
        btnShowInfo(items) {
            const orderStatus = items.orderStatus;
            if (orderStatus == 2) {
                return true;
            } else if (orderStatus == 3) {
                return true;
            }
            // return false;
        },
        //查看详情
        showDeail(item) {
            //console.log(item)
            const orderId = item.orderId;
            this.$router.push({path: '/orderinfo', query: {orderId: orderId}});
        },
        //下单时间
        orderTime(item) {
            return commonFunc(item.orderTime);
        },
        //订单金额
        payMoney(item) {
            return item.payAmount / 100;
        },
        //付款方式
        payText(item) {
            if (item.payType === 10) {
                return '微信APP';
            }
            if (item.payType === 11) {
                return '微信公众号';
            }
            if (item.payType === 12) {
                return '微信H5';
            }
            if (item.payType === 20) {
                return '支付宝APP';
            } else {
                return '';
            }
        },
        //订单状态
        statusText(item) {
            const status = item.orderStatus;
            switch (status) {
                case 1:
                    return '待付款';
                    break;
                case 2:
                    return '待接单';
                    break;
                case 3:
                    return '待发货';
                    break;
                case 4:
                    return '待收货';
                    break;
                case 5:
                    return '已完成';
                    break;
                case 6:
                    return '已关闭';
                    break;
                default:
                    return '';
                    break;
            }
        },
        //获取查询时间
        getTime(val) {
            console.log(val);
            if (val) {
                for (let i = 0; i < val.length; i++) {
                    this.orderSearch.minTime = val[0];
                    this.orderSearch.maxTime = val[1];
                }
            } else {
                (this.orderSearch.minTime = ''), (this.orderSearch.maxTime = '');
            }
        },
        //分类查询
        searchInfo() {
            //console.log(this.orderSearch)
            this.orderSearch.pageNum = 1;
            this.searchOrder();
        },
        //查询订单
        searchOrder() {
            //console.log(this.searchDate)
            const that = this;
            this.$http.get(this.$http.adornUrl2('/v1/transaction/orders'), {params: that.orderSearch}).then(res => {
                //  console.log(res.data)
                if (res.data.code === 200) {
                    that.tableData = res.data.data.list;
                    that.total = res.data.data.total;
                }
            });
        },
        //订单统计--单独的接口 放在统计模块那边 暂时没有
        orderTotal() {
            const that = this;
            //console.log(that.orderSearch.shopId)
            this.$http.get(this.$http.adornUrl2('/v1/transaction/orders'), {params: {shopId: that.orderSearch.shopId}}).then(res => {
                //console.log(res.data)
                if (res.data.code === 200) {
                    const list = res.data.data;
                    for (let i = 0; i < list.length; i++) {
                        that.orderStatus[i + 1].total = list[i].total;
                        // console.log(that.orderStatus[i+1].total)
                    }
                }
            });
        },
        //订单统计数量
        orderNumber(index, item) {
            //  console.log(index,item)
            if (index == 0 || index == 5 || index == 6) {
                return '';
            }
            return '(' + item + ')';
        },
        toggle(tab) {
            //console.log(tab)
            //console.log()
            if (Number(tab.paneName) == 0) {
                this.orderSearch.orderStatus = null;
            } else {
                this.orderSearch.orderStatus = Number(tab.paneName);
            }
            this.searchOrder();
        },
        //订单处理
        orderDispose(item, type) {
            const that = this;
            that.$http.put(this.$http.adornUrl2('/v1/transaction/orders/' + item), type).then(res => {
                //console.log(res.data)
                if (res.data.code == 201) {
                    that.searchOrder();
                    that.dialogVisible = false;
                }
            });
        },
        //立即接单
        advertEdit(item, type) {
            const that = this;
            //console.log(item)
            that.newOrder = item.orderId;
            const orderId = item.orderId;
            //console.log(that.newOrder)
            //console.log('订单状态'+type)  //type：1---(立即接单,订单发货，退款处理)
            // const orderType = {type:null}
            if (type === 1) {
                if (item.orderStatus === 2) {
                    that.orderType.type = 1;
                    //console.log('--立即接单--')
                    that.orderDispose(orderId, that.orderType);
                } else if (item.orderStatus === 3) {
                    //console.log('--订单发货--')
                    that.orderType.type = 4;
                    that.$refs.sendGoods.init(orderId);
                    //that.orderDispose(orderId,that.orderType)
                } else {
                    this.orderIsNum = 5;
                    that.dialogVisible = true;
                }
            } else {
                if (item.orderStatus === 2) {
                    //console.log('--拒绝接单--')
                    that.orderType.type = 2;
                    this.orderIsNum = 2;
                    this.dialogVisible = true;
                } else if (item.orderStatus === 3) {
                    //console.log('--取消订单--')
                    that.orderType.type = 3;
                    this.orderIsNum = 3;
                    this.dialogVisible = true;
                }
            }
        },
        // 导出
        pdf(value) {
            let pageInfo = {};
            if (value) {
                // 当前页
                pageInfo.pageNum = this.orderSearch.pageNum;
                pageInfo.pageSize = this.orderSearch.pageSize;
            } else {
                // 全部
                pageInfo.pageNum = 1;
                pageInfo.pageSize = this.orderSearch.total;
            }
            this.$http({
                url: this.$http.adornUrl2('/v1/transaction/orders/excels'),
                method: 'get',
                responseType: 'blob',
                params: this.$http.adornParams(
                    Object.assign(pageInfo, {
                        shopId: this.orderSearch.shopId,
                        minTime: this.orderSearch.minTime,
                        maxTime: this.orderSearch.maxTime,
                        orderStatus: this.orderSearch.orderStatus,
                        payStatus: this.orderSearch.payStatus,
                    })
                ),
            })
                .then(response => {
                    download(response.data, '订单.xls');
                })
                .catch(err => {
                    console.log(err);
                });
        },
        // 运营看的 --接口v2
        pdfOperate(value) {
            let pageInfo = {};
            if (value) {
                // 当前页
                pageInfo.pageNum = this.orderSearch.pageNum;
                pageInfo.pageSize = this.orderSearch.pageSize;
            } else {
                // 全部
                pageInfo.pageNum = 1;
                pageInfo.pageSize = this.total;
            }
            this.$http({
                url: this.$http.adornUrl2('/v2/transaction/orders/excels'),
                method: 'get',
                responseType: 'blob',
                params: this.$http.adornParams(
                    Object.assign(pageInfo, {
                        shopId: this.orderSearch.shopId,
                        minTime: this.orderSearch.minTime,
                        maxTime: this.orderSearch.maxTime,
                        orderStatus: this.orderSearch.orderStatus,
                        payStatus: this.orderSearch.payStatus,
                    })
                ),
            })
                .then(response => {
                    download(response.data, '订单.xls');
                })
                .catch(err => {
                    console.log(err);
                });
        },
        // 导出已支付
        pdfPay() {
            this.$refs.orderPayOrRefund.init(2);
        },
        // 导出已退款
        pdfRefund() {
            this.$refs.orderPayOrRefund.init(3);
        },
        //退款处理
        refund() {
            //console.log('--退款处理--')
            this.orderType.type = 5;
            //console.log(this.orderType);
            //console.log(this.newOrder)
            if (this.orderIsNum == 5) {
                this.orderType.type = 5;
            }
            if (this.orderIsNum == 3) {
                this.orderType.type = 3;
            }
            if (this.orderIsNum == 2) {
                this.orderType.type = 2;
            }
            if (this.textarea.length == 0) {
                this.$message({
                    type: 'error',
                    message: '请输入原因!',
                });
                return false;
            } else {
                this.orderType.reason = this.textarea;
                this.orderDispose(this.newOrder, this.orderType);
            }
        },
        // 退款等原因的弹框关闭的回调事件--情况弹框
        closeFun() {
            this.textarea = '';
            this.orderType.reason = null;
        },
    },
};
</script>
<style lang="scss" scoped>
.el-date-editor--daterange {
    width: 244px;
}
.shopDiv {
    padding-left: 0 !important;
}
</style>
