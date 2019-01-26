<template>
    <div>
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataListFun()" size="small">
            <el-form-item> <el-input style="width:225px" v-model="dataForm.keywords" placeholder="请输入车牌号/用户账号/订单编号" clearable></el-input> </el-form-item>
            <el-form-item label="缴费类型:" class="ml10">
                <el-select v-model="dataForm.type" clearable> <el-option v-for="item in payTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option> </el-select>
            </el-form-item>
            <el-form-item label="付款方式:" class="ml10">
                <el-select v-model="dataForm.payType" clearable> <el-option v-for="item in payList" :key="item.value" :label="item.label" :value="item.value"></el-option> </el-select>
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
            <el-form-item>
                <el-button type="primary" v-if="isAuth('park:carOrders:page')" @click="getDataListFun()">查询</el-button>
                <el-button type="success" class="btn-advert" @click="pdf(1)">导出部分</el-button>
                <el-button type="success" class="btn-advert" @click="pdf(0)">导出所有</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
            <el-table-column type="index" header-align="center" align="center" width="50" label="序号"> </el-table-column>
            <el-table-column prop="orderSn" header-align="center" align="center" label="订单编号"> </el-table-column>
            <el-table-column prop="carPlate" header-align="center" align="center" label="车牌号"> </el-table-column>
            <el-table-column prop="phone" header-align="center" align="center" label="用户账号"> </el-table-column>
            <el-table-column prop="payTime" :formatter="payTime" header-align="center" align="center" label="缴费时间"> </el-table-column>
            <el-table-column prop="monthNum" header-align="center" align="center" label="缴费月数"> </el-table-column>
            <el-table-column header-align="center" align="center" label="应收金额(元)">
                <template slot-scope="scope">
                    <span>{{ scope.row.receivableAmount / 100 }}</span>
                </template>
            </el-table-column>
            <el-table-column header-align="center" align="center" label="实收金额(元)">
                <template slot-scope="scope">
                    <span>{{ scope.row.payAmount / 100 }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="type" header-align="center" align="center" :formatter="type" label="缴费类型"> </el-table-column>
            <el-table-column prop="payType" :formatter="payType" header-align="center" align="center" label="付款方式"> </el-table-column>
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
        <el-dialog :title="'缴费详情'" :close-on-click-modal="false" @close="closeDialog" :visible.sync="visible">
            <el-card class="box-card">
                <div class="text item">订单编号:{{ dialogForm.orderSn }}</div>
                <div v-if="dialogForm.type == '1'" class="text item">停车时段:{{ dialogForm.times }}</div>
                <div v-if="dialogForm.type == '1'" class="text item">停车时长:{{ dialogForm.parkingTime }}分钟</div>
                <div v-if="dialogForm.type == '2'" class="text item">充值有效期:{{ dialogForm.endTime }}</div>
            </el-card>
            <span slot="footer" class="dialog-footer"> <el-button size="small" type="primary" @click="visible = false">确定</el-button> </span>
        </el-dialog>
    </div>
</template>

<script>
import commonFunc from '@/assets/common.js';
import {download} from '../customized/customized';
export default {
    data() {
        return {
            dataForm: {
                type: 0,
                payType: 0,
                keywords: '',
                startTime: '',
                endTime: '',
            },
            searchDate: [new Date(), new Date()], //日期查询
            dataList: [],
            dataListLoading: false,
            visible: false,
            pageSize: 10,
            pageNum: 1,
            totalPage: 0,
            value1: '',
            payTypeList: [{value: 0, label: '全部'}, {value: 1, label: '临时缴费'}, {value: 2, label: '月卡充值'}],
            payList: [{value: 0, label: '全部'}, {value: 10, label: '微信'}, {value: 20, label: '支付宝'}],
            dialogForm: {
                orderSn: '',
                times: '',
                parkingTime: '',
                endTime: '',
            },
        };
    },

    activated() {
        this.initData();
        this.getDataList();
    },
    methods: {
        //  初始化时间
        initData() {
            const end = new Date();
            this.searchDate = [end, end];
            this.dataForm.startTime = commonFunc.commonFunc2(end.getTime());
            this.dataForm.endTime = commonFunc.commonFunc2(end.getTime());
        },
        getDataListFun() {
            this.pageNum = 1;
            this.getDataList();
        },
        // 获取数据
        getDataList() {
            this.dataListLoading = true;
            this.$http({
                url: this.$http.adornUrl('/v2/park/carOrders'),
                method: 'get',
                params: this.$http.adornParams({
                    keywords: this.dataForm.keywords,
                    type: this.dataForm.type == 0 ? null : this.dataForm.type,
                    payType: this.dataForm.payType == 0 ? null : this.dataForm.payType,
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    startTime: this.dataForm.startTime,
                    endTime: this.dataForm.endTime,
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
        // 查看详情
        detail(obj) {
            this.dialogForm = Object.assign({}, obj); //  拷贝对象的属性值
            this.dialogForm.times = commonFunc.commonFunc(obj.startTime) + '  至  ' + commonFunc.commonFunc(obj.endTime);
            this.dialogForm.endTime = commonFunc.commonFunc(obj.startTime);
            this.visible = true; //打开弹框
        },
        payTime(item) {
            return commonFunc.commonFunc(item.payTime);
        },
        //   转换时间的
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
                url: this.$http.adornUrl('/v2/park/carOrders/excels'),
                method: 'get',
                responseType: 'blob',
                params: this.$http.adornParams(Object.assign(pageInfo, this.dataForm)),
            })
                .then(response => {
                    download(response.data, '缴费订单.xls');
                })
                .catch(err => {
                    console.log(err);
                });
        },
        // 弹框关闭
        closeDialog() {},
        type(row) {
            if (row.type == '1') {
                return '临时缴费';
            }
            if (row.type == '2') {
                return '月卡充值';
            }
        },
        payType(row) {
            if (row.payType == '10') {
                return '微信';
            }
            if (row.payType == '20') {
                return '支付宝';
            }
        },
    },
};
</script>
<style lang="scss" scoped>
div.text {
    margin: 10px 0;
}
</style>
