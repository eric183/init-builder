<template>
    <div>
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataListFun()" size="small">
            <el-form-item>
                <el-select v-model="dataForm.expressCompanyCode" placeholder="请选择快递商">
                    <el-option v-for="item in companyList" :key="item.expressCompanyCode" :label="item.expressCompanyName" :value="item.expressCompanyCode"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="订单状态:" class="ml10">
                <el-select v-model="dataForm.status"> <el-option v-for="item in orderList" :key="item.value" :label="item.label" :value="item.value"></el-option> </el-select>
            </el-form-item>
            <el-form-item label="下单时间:" class="ml10">
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
            <el-form-item> <el-input placeholder="下单账号" v-model="dataForm.userAccount" clearable></el-input> </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getDataListFun()">查询</el-button>
                <el-popover placement="bottom" width="290" trigger="hover">
                    <el-button type="success" @click="pdf(1)">导出当前页</el-button>
                    <el-button type="success" @click="pdf(0)">导出全部</el-button>
                    <el-button slot="reference" type="success">导出</el-button>
                </el-popover>
            </el-form-item>
        </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
            <el-table-column type="index" header-align="center" align="center" width="50" label="序号"> </el-table-column>
            <el-table-column prop="userAccount" header-align="center" align="center" label="下单账号"> </el-table-column>
            <el-table-column prop="itemType" header-align="center" align="center" label="物品类别"> </el-table-column>
            <el-table-column prop="expressCompanyName" header-align="center" align="center" label="快递商"> </el-table-column>
            <el-table-column prop="expressOrderSn" header-align="center" align="center" label="快递单号"> </el-table-column>
            <el-table-column :formatter="status" header-align="center" align="center" label="订单状态"> </el-table-column>
            <el-table-column :formatter="payAmount" header-align="center" align="center" label="订单实价(元)"> </el-table-column>
            <el-table-column :formatter="payType" header-align="center" align="center" label="支付方式"> </el-table-column>
            <el-table-column header-align="center" align="center" width="80" label="操作">
                <template slot-scope="scope">
                    <el-button type="success" plain size="mini" @click="orderDeteil(scope.row.orderId)">详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="pageNum"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
        >
        </el-pagination>
    </div>
</template>

<script>
import {commonFunc2,status, payType,download} from '@/utils/resources/index.js';
export default {
    data() {
        return {
            dataForm: {
                userAccount: '',
                expressCompanyCode: '',
                status: null,
                startTime: '',
                endTime: '',
            },
            // 表格数据展示
            dataList: [],
            pageNum: 1,
            pageSize: 10,
            total: 0,
            dataListLoading: false,
            orderList: [{value: null, label: '全部'}, {value: 1, label: '待取件'}, {value: 2, label: '已发出'}, {value: 3, label: '已签收'}, {value: 4, label: '已取消'}],
            companyList: [],
            searchDate: [new Date(), new Date()], //日期查询
        };
    },
    activated() {
        this.getDataList();
        this.getCompanyOptions();
    },
    mounted() {
        this.data();
    },
    methods: {
        //  初始化时间
        data() {
            const end = new Date();
            this.searchDate = [end, end];
            this.dataForm.startTime = commonFunc2(end.getTime());
            this.dataForm.endTime = commonFunc2(end.getTime());
        },
        getDataListFun() {
            this.pageNum = 1;
            this.getDataList();
        },
        // 获取数据列表
        getDataList() {
            this.dataListLoading = true;
            this.$http({
                url: this.$http.adornUrl('/v1/express/orders'),
                method: 'get',
                params: this.$http.adornParams({
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    userAccount: this.dataForm.userAccount,
                    expressCompanyCode: this.dataForm.expressCompanyCode,
                    status: this.dataForm.status,
                    startTime: this.dataForm.startTime,
                    endTime: this.dataForm.endTime,
                }),
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.dataList = data.data.list;
                    this.total = data.data.total;
                } else {
                    this.dataList = [];
                    this.total = 0;
                }
                this.dataListLoading = false;
            });
        },
        // 每页数
        sizeChangeHandle(val) {
            this.pageSize = val;
            this.getDataList();
        },
        // 当前页
        currentChangeHandle(val) {
            this.pageNum = val;
            this.getDataList();
        },
        //   获取快递公司下拉列表
        getCompanyOptions() {
            this.$http({
                url: this.$http.adornUrl('/v1/express/companies/options'),
                method: 'get',
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.companyList = data.data.options;
                } else {
                    this.companyList = [];
                }
            });
        },
        //   时间转换
        getTime(val) {
            if (val) {
                for (let i = 0; i < val.length; i++) {
                    this.dataForm.startTime = val[0];
                    this.dataForm.endTime = val[1];
                }
            } else {
                (this.dataForm.startTime = ''), (this.dataForm.endTime = '');
            }
        },
        //   导出订单
        pdf(value) {
            let pageInfo = {};
            if (value) {
                // 当前页
                pageInfo.pageNum = this.pageNum;
                pageInfo.pageSize = this.pageSize;
            } else {
                // 全部
                pageInfo.pageNum = 1;
                pageInfo.pageSize = this.total;
            }
            this.$http({
                url: this.$http.adornUrl('/v1/express/orders/excels'),
                method: 'get',
                responseType: 'blob',
                params: this.$http.adornParams(Object.assign(pageInfo, this.dataForm)),
            })
                .then(response => {
                    download(response.data, '快递订单.xls');
                })
                .catch(err => {
                    console.log(err);
                });
        },
        // 订单--查看订单详情
        orderDeteil(orderId) {
            this.$router.push({path: '/express-orderinfo', query: {orderId: orderId}});
        },
        // 账单金额-转换成元
        rentedFee(item) {
            return item.rentedFee / 100;
        },
        // 订单实价
        payAmount(item) {
            console.log(item.payAmount);
            if (item.payAmount == null) {
                return '';
            } else {
                return item.payAmount / 100;
            }
        },
        //订单状态
        status(item) {
            return status(item.status);
        },
        // 支付方式
        payType(item) {
            return payType(item.payType);
        },
    },
};
</script>
