<template>
    <div>
        <!-- 账单明细列表 -->
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" size="small">
            <el-form-item> <el-input placeholder="企业名称" v-model="dataForm.companyName" clearable></el-input> </el-form-item>
            <el-form-item label="账单时间" class="ml10">
                <el-date-picker v-model="dataForm.billDate" format="yyyy-MM" value-format="yyyy-MM" type="month" placeholder="选择月"> </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getDataList()">查询</el-button>
                <el-button type="success" @click="addOrUpdateHandle()">新增</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
            <el-table-column type="index" header-align="center" align="center" width="50" label="序号"> </el-table-column>
            <el-table-column prop="name" header-align="center" align="center" width="120" label="项目名称"> </el-table-column>
            <el-table-column prop="companyName" header-align="center" align="center" width="200" label="企业"> </el-table-column>
            <el-table-column prop="billDate" header-align="center" align="center" label="账单日期"> </el-table-column>
            <el-table-column prop="previousValue" header-align="center" align="center" label="上月读数"> </el-table-column>
            <el-table-column prop="currentValue" header-align="center" align="center" label="本月读数"> </el-table-column>
            <el-table-column prop="usedValue" header-align="center" align="center" label="本月用量"> </el-table-column>
            <el-table-column prop="unitPrice" header-align="center" align="center" label="标准单价">
                <template slot-scope="scope">
                    <span>{{ scope.row.unitPrice / 100 }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="currentFee" header-align="center" align="center" label="本月费用">
                <template slot-scope="scope">
                    <span>{{ scope.row.currentFee / 100 }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="formerArrearage" header-align="center" align="center" label="往月欠缴">
                <template slot-scope="scope">
                    <span>{{ scope.row.formerArrearage / 100 }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="delayCharge" header-align="center" align="center" label="滞纳金">
                <template slot-scope="scope">
                    <span>{{ scope.row.delayCharge / 100 }}</span>
                </template>
            </el-table-column>
            <el-table-column header-align="center" align="center" width="160" label="操作">
                <template slot-scope="scope">
                    <el-button type="success" plain size="mini" @click="addOrUpdateHandle(scope.row.detailId)">编辑</el-button>
                    <el-button type="danger" plain size="mini" @click="deletebill(scope.row.detailId)">删除</el-button>
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
        <!-- 弹窗, 新增 / 修改 -->
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    </div>
</template>

<script>
import commonFunc from '@/assets/common.js';
import AddOrUpdate from './billlist-add-or-update';
export default {
    data() {
        return {
            dataForm: {
                companyName: '',
                billDate: '',
            },
            // 表格数据展示
            dataList: [],
            pageNum: 1,
            pageSize: 10,
            totalPage: 0,
            dataListLoading: false,
            statusList: [{value: null, label: '全部'}, {value: 1, label: '未缴费'}, {value: 2, label: '已缴费'}],
            addOrUpdateVisible: false,
        };
    },
    components: {
        AddOrUpdate,
    },
    activated() {
        this.getDataList();
    },
    methods: {
        // 获取数据列表
        getDataList() {
            this.dataListLoading = true;
            this.$http({
                url: this.$http.adornUrl('/v2/pm/property/details'),
                method: 'get',
                params: this.$http.adornParams({
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    companyName: this.dataForm.companyName,
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
        // 账单明细详情
        detail(detailId) {
            // this.$router.push({path:'/billdetail',query: {detailId: detailId}});
        },
        // 新增 / 修改
        addOrUpdateHandle(id) {
            this.addOrUpdateVisible = true;
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init(id);
            });
        },
        // 删除
        deletebill(detailId) {
            this.$confirm(`确定进行删除操作?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    this.$http({
                        url: this.$http.adornUrl('/v2/pm/property/details/' + detailId),
                        method: 'delete',
                    }).then(({data}) => {
                        this.getDataList();
                    });
                })
                .catch(() => {});
        },
    },
};
</script>
