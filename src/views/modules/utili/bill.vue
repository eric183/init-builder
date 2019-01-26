<template>
    <div class="mod-user">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" size="small">
            <el-form-item> <el-input placeholder="企业名称" v-model="dataForm.companyName" clearable></el-input> </el-form-item>
            <el-form-item label="缴费状态:" class="ml10">
                <el-select v-model="dataForm.status"> <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value"></el-option> </el-select>
            </el-form-item>
            <el-form-item label="账单时间" class="ml10">
                <el-date-picker v-model="dataForm.billDate" format="yyyy-MM" value-format="yyyy-MM" type="month" placeholder="选择月"> </el-date-picker>
            </el-form-item>
            <el-form-item> <el-button type="primary" @click="getDataList()">查询</el-button> </el-form-item>
        </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
            <el-table-column type="index" header-align="center" align="center" width="50" label="序号"> </el-table-column>
            <el-table-column prop="companyName" header-align="center" align="center" min-width="180" label="企业名称"> </el-table-column>
            <el-table-column prop="doorplate" header-align="center" align="center" label="楼层门牌"> </el-table-column>
            <el-table-column :formatter="propertyFee" header-align="center" align="center" label="物业费(元)"> </el-table-column>
            <el-table-column prop="billDate" header-align="center" align="center" label="账单时间"> </el-table-column>
            <el-table-column :formatter="status" header-align="center" align="center" label="缴费状态"> </el-table-column>
            <el-table-column header-align="center" align="center" width="160" label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" plain size="mini" @click="billDeteil(scope.row.billId)">详情</el-button>
                    <el-popover placement="top-start" width="220" trigger="hover">
                        <el-button type="primary" plain size="mini" @click="pdf(scope.row.billId)">导出pdf</el-button>
                        <el-button type="success" plain size="mini" @click="excel(scope.row.billId)">导出excel</el-button>
                        <el-button slot="reference" type="success" plain size="mini">导出</el-button>
                    </el-popover>
                    <el-button type="success" v-if="scope.row.status == 1" plain size="mini" @click="pay(scope.row.billId)">缴费</el-button>
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
    </div>
</template>

<script>
import commonFunc from '@/assets/common.js';
import {download} from '../customized/customized';
export default {
    data() {
        return {
            dataForm: {
                companyName: '',
                status: null,
                billDate: '',
            },
            // 表格数据展示
            dataList: [],
            pageNum: 1,
            pageSize: 10,
            totalPage: 0,
            dataListLoading: false,
            statusList: [{value: null, label: '全部'}, {value: 1, label: '未缴费'}, {value: 2, label: '已缴费'}],
        };
    },
    activated() {
        this.getDataList();
    },
    methods: {
        // 获取数据列表
        getDataList() {
            this.dataListLoading = true;
            this.$http({
                url: this.$http.adornUrl('/v2/pm/property/bills'),
                method: 'get',
                params: this.$http.adornParams({
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    companyName: this.dataForm.companyName,
                    status: this.dataForm.status,
                    billDate: this.dataForm.billDate,
                }),
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.dataList = data.data.list;
                    this.totalPage = data.data.total;
                    //console.log(typeof(this.dataList[0].isRentedFee))
                } else {
                    this.dataList = [];
                    this.totalPage = 0;
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
        //   缴费
        pay(billId) {
            this.$http({
                url: this.$http.adornUrl(`/v2/pm/property/bills/` + billId),
                method: 'put',
                data: this.$http.adornData({
                    status: 2,
                }),
            }).then(({data}) => {
                if (data && data.code === 201) {
                    this.$message({
                        message: '操作成功',
                        type: 'success',
                        duration: 1500,
                        onClose: () => {
                            this.getDataList();
                        },
                    });
                }
            });
        },
        // 导出账单
        pdf(billId) {
            this.$http({
                url: this.$http.adornUrl('/v2/pm/property/bills/' + billId + '/pdf'),
                method: 'get',
                responseType: 'blob',
            })
                .then(response => {
                    download(response.data, '账单pdf.pdf');
                })
                .catch(err => {
                    console.log(err);
                });
        },
        // 导出excel
        excel(billId) {
            this.$http({
                url: this.$http.adornUrl('/v2/pm/property/bills/' + billId + '/excels'),
                method: 'get',
                responseType: 'blob',
            })
                .then(response => {
                    download(response.data, '账单excel.xls');
                })
                .catch(err => {
                    console.log(err);
                });
        },
        // 物业费--查看账单详情
        billDeteil(billId) {
            this.$router.push({path: '/billdetail', query: {billId: billId}});
        },
        // 账单金额-转换成元
        rentedFee(item) {
            return item.rentedFee / 100;
        },
        propertyFee(item) {
            return item.propertyFee / 100;
        },
        totalFee(item) {
            return item.totalFee / 100;
        },
        status(item) {
            if (item.status == 2) {
                return '已缴费';
            }
            if (item.status == 1) {
                return '未缴费';
            }
        },
    },
};
</script>
