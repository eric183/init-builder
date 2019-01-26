<template>
    <div class="order">
        <!-- 通达顺能看的 ， 订单列表 -->
        <div class="order-list">
            <el-form :inline="true" class="demo-form-inline" size="small">
                <el-form-item label="店铺:" class="shopDiv">
                    <el-select v-model="orderSearch.shopId" clearable> <el-option v-for="item in shopList" :key="item.shopId" :label="item.shopName" :value="item.shopId"> </el-option> </el-select>
                </el-form-item>
                <el-form-item> <el-input placeholder="请输入订单编号" v-model="orderSearch.orderSn" clearable></el-input> </el-form-item>
                <el-form-item> <el-input placeholder="请输入手机号" v-model="orderSearch.userAccount" clearable></el-input> </el-form-item>
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
                    <el-button type="primary" @click="searchInfoFun()">查询</el-button>
                    <el-button type="success" @click="pdf(1)">导出当前页</el-button>
                    <el-button type="success" @click="pdf(0)">导出全部</el-button>
                </el-form-item>
            </el-form>
            <div class="list-info">
                <el-tabs type="card" @tab-click="toggle">
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
                        <el-table-column align="center" width="120" label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" plain size="mini" @click="showDeail(scope.row)">详情</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tabs>
            </div>
            <div class="pagin"><el-pagination background layout="total,prev, pager, next" @current-change="currentchange" :total="total" :page-size="orderSearch.pageSize"> </el-pagination></div>
        </div>
    </div>
</template>

<script>
import commonFunc from '@/assets/common.js';
import {download} from '../customized/customized';
export default {
    data() {
        return {
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
                orderStatus: 4,
                userAccount: '',
            },
            shopList: [], //店铺下拉列表
            total: null,
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
                    value: 4,
                    label: '待收货',
                    total: null,
                },
                {
                    value: 5,
                    label: '已完成',
                    total: null,
                },
            ],
        };
    },
    activated() {
        this.searchOrder();
        this.getShopList();
    },
    mounted() {
        this.data();
    },
    methods: {
        //  初始化时间
        data() {
            const end = new Date();
            this.searchDate = [end, end];
            this.orderSearch.minTime = commonFunc.commonFunc2(end.getTime());
            this.orderSearch.maxTime = commonFunc.commonFunc2(end.getTime());
        },
        // 查看店铺下拉列表
        getShopList() {
            this.$http.get(this.$http.adornUrl2('/v1/merchant/shops/options')).then(res => {
                if (res.data.code === 200) {
                    this.shopList = res.data.data.options;
                    this.orderSearch.shopId = this.shopList[0].shopId;
                }
            });
        },
        //查看详情
        showDeail(item) {
            const orderId = item.orderId;
            this.$router.push({path: '/orderinfo', query: {orderId: orderId}});
        },
        //下单时间
        orderTime(item) {
            return commonFunc.commonFunc(item.orderTime);
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
        searchInfoFun() {
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
        // 分页
        currentchange(value) {
            this.orderSearch.pageNum = value;
            this.searchOrder();
        },
        toggle(tab) {
            if (Number(tab.paneName) == 0) {
                this.orderSearch.orderStatus = 4; //待收货
            } else {
                this.orderSearch.orderStatus = 5; //已完成
            }
            this.searchOrder();
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
                pageInfo.pageSize = this.total;
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
