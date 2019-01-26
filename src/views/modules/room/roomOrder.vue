<template>
    <!-- 会议室/预约订单 -->
    <div class="mod-user">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataListFun()" size="small">
            <el-form-item label="会议室"> <el-input v-model="dataForm.roomName" placeholder="请输入会议室名称" clearable></el-input> </el-form-item>
            <el-form-item label="账号" class="ml10"> <el-input v-model="dataForm.userAccount" placeholder="请输入用户账号" clearable></el-input> </el-form-item>
            <el-form-item label="日期" class="ml10"> <el-date-picker v-model="dataForm.bookDate" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"> </el-date-picker> </el-form-item>
            <el-form-item>
                <el-button v-if="isAuth('meeting:order:getOrderList')" type="primary" @click="getDataListFun()">查询</el-button>
                <el-button type="success" class="btn-advert" @click="pdf(1)">导出部分</el-button>
                <el-button type="success" class="btn-advert" @click="pdf(0)">导出所有</el-button>
            </el-form-item>
        </el-form>
        <el-tabs type="card" @tab-click="toggle">
            <el-tab-pane label="全部"></el-tab-pane>
            <el-tab-pane label="待支付"></el-tab-pane>
            <el-tab-pane label="已付款"></el-tab-pane>
            <el-tab-pane label="已退款"></el-tab-pane>
        </el-tabs>
        <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
            <el-table-column type="index" header-align="center" align="center" width="50" label="序号"> </el-table-column>
            <el-table-column prop="userAccount" header-align="center" align="center" label="用户账号"> </el-table-column>
            <el-table-column prop="roomName" header-align="center" align="center" :show-overflow-tooltip="true" label="会议室名称"> </el-table-column>
            <el-table-column :formatter="bookDate" header-align="center" align="center" :show-overflow-tooltip="true" label="预订日期"> </el-table-column>
            <el-table-column :formatter="bookTime" header-align="center" align="center" :show-overflow-tooltip="true" label="预订时间"> </el-table-column>
            <el-table-column :formatter="payAmount" header-align="center" align="center" label="订单金额(元)"> </el-table-column>
            <el-table-column :formatter="payTime" header-align="center" align="center" label="下单时间"> </el-table-column>
            <el-table-column :formatter="payStatus" header-align="center" align="center" label="支付状态"> </el-table-column>
            <el-table-column header-align="center" align="center" width="100" label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" plain size="mini" @click="detail(scope.row)">详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="pageNum"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            :total="totalPage"
            layout="total, sizes, prev, pager, next, jumper"
        >
        </el-pagination>
        <detail v-if="roomorderDetail" ref="detail" @refreshDataList="getDataList"></detail>
    </div>
</template>

<script>
import commonFunc from '@/assets/common.js';
import detail from './orderDetail';
import {download} from '../customized/customized';
export default {
    data() {
        return {
            dataForm: {
                payStatus: null,
                roomName: '',
                bookDate: '',
                userAccount: '',
            },
            pageSize: 10,
            pageNum: 1,
            totalPage: 0,
            roomorderDetail: false,
            // 表格数据展示
            dataList: [],
            dataListLoading: false,
        };
    },
    activated() {
        this.initTime();
        this.getDataList();
    },
    components: {
        detail,
    },
    methods: {
        // 初始化时间
        initTime() {
            const start = new Date();
            this.dataForm.bookDate = commonFunc.commonFunc2(start.getTime());
        },
        getDataListFun() {
            this.pageNum = 1;
            this.getDataList();
        },
        // 获取数据列表
        getDataList() {
            this.dataListLoading = true;
            this.$http({
                url: this.$http.adornUrl('/v1/meet/orders'),
                method: 'get',
                params: this.$http.adornParams({
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    userAccount: this.dataForm.userAccount,
                    roomName: this.dataForm.roomName,
                    bookDate: this.dataForm.bookDate,
                    payStatus: this.dataForm.payStatus,
                }),
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.dataList = data.data.list;
                    this.totalPage = data.data.total;
                } else {
                    this.dataList = [];
                }
                this.dataListLoading = false;
            });
        },
        // tab选项切换
        toggle(tab) {
            if (tab.index == 0) {
                this.dataForm.payStatus = null;
            } else {
                this.dataForm.payStatus = tab.index * 1; //(tab.index 是点击待认证列表这几个选项的下标)
            }
            this.getDataList();
        },
        // 每页数
        sizeChangeHandle(val) {
            this.pageSize = val;
            this.pageNum = 1;
            this.getDataList();
        },
        // 当前页
        currentChangeHandle(val) {
            this.pageNum = val;
            this.getDataList();
        },
        // 弹框关闭
        closeDialog() {},
        // 导出
        pdf(value) {
            let pageInfo = {};
            if (value) {
                // 当前页
                pageInfo.pageNum = this.pageNum;
                pageInfo.pageSize = this.pageSize;
            } else {
                // 全部
                pageInfo.pageNum = 1;
                pageInfo.pageSize = this.totalPage;
            }
            this.$http({
                url: this.$http.adornUrl('/v1/meet/orders/excels'),
                method: 'get',
                responseType: 'blob',
                params: this.$http.adornParams(Object.assign(pageInfo, this.dataForm)),
            })
                .then(response => {
                    download(response.data, '预约订单.xls');
                })
                .catch(err => {
                    console.log(err);
                });
        },
        detail(obj) {
            //this.$router.push({path:'/orderDetail',query: obj});
            this.roomorderDetail = true;
            this.$nextTick(() => {
                this.$refs.detail.init(obj);
            });
        },
        // 后端返回的数字，转换成中文
        bookDate(item) {
            return commonFunc.commonFunc2(item.bookDate);
        },
        payTime(item) {
            return commonFunc.commonFunc(item.payTime);
        },
        bookTime(item) {
            return item.startAt + ':00' + '  至  ' + item.endAt + ':00';
        },
        payAmount(item) {
            return item.payAmount / 100;
        },
        payStatus(row, column) {
            switch (row.payStatus) {
                case 1:
                    return '待支付';
                    break;
                case 2:
                    return '已支付';
                    break;
                case 3:
                    return '已退款';
                    break;
            }
        },
    },
};
</script>
