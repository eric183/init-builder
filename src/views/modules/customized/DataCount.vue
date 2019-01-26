<template>
    <el-row>
        <!-- 数据统计 -->
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataListFun()" size="small">
            <el-form-item label="用餐类型:" class="ml10">
                <el-select v-model="dataForm.bookingType" clearable> <el-option v-for="item in bookingTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option> </el-select>
            </el-form-item>
            <el-form-item label="日期:" class="ml10">
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
                <el-button type="primary" @click="getDataListFun()">查询</el-button>
                <el-popover placement="right" width="290" trigger="hover">
                    <el-button type="success" @click="pdf(1)">导出当前页</el-button>
                    <el-button type="success" @click="pdf(0)">导出全部</el-button>
                    <el-button slot="reference" type="success">导出</el-button>
                </el-popover>
            </el-form-item>
        </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;" @header-click="headerClick">
            <el-table-column type="index" header-align="center" align="center" width="50" label="序号"></el-table-column>
            <el-table-column :formatter="recordTime" header-align="center" align="center" label="日期"></el-table-column>
            <el-table-column :formatter="bookingType" header-align="center" align="center" label="用餐类型"></el-table-column>
            <el-table-column prop="departmentName" header-align="center" align="center" label="部门"></el-table-column>
            <el-table-column prop="appointmentNum" header-align="center" align="center" label="预约人数"></el-table-column>
            <el-table-column prop="appointmentAndRepastNum" header-align="center" align="center" label="预约并就餐人数"></el-table-column>
            <el-table-column prop="noAppointmentButRepastNum" header-align="center" align="center" label="未预约就餐人数"></el-table-column>
            <el-table-column prop="repastNum" header-align="center" align="center" label="就餐总人数"></el-table-column>
            <el-table-column prop="effectAppointmentRate" header-align="center" align="center" label="预约有效率">
                <template slot-scope="scope">
                    <span>{{ scope.row.effectAppointmentRate + '%' }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="appointmentAndRepastRate" header-align="center" align="center" label="预约就餐率">
                <template slot-scope="scope">
                    <span>{{ scope.row.appointmentAndRepastRate + '%' }}</span>
                </template>
            </el-table-column>
        </el-table>
        <el-row class="data_count">
            <el-pagination
                @size-change="sizeChangeHandle"
                @current-change="currentChangeHandle"
                :current-page="pageNum"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="pageSize"
                :total="total"
                layout="total, sizes, prev, pager, next, jumper"
            ></el-pagination>
            <div class="data_tip"><span>!预约有效率: 预约并就餐人数/预约人数;</span> <span class="ml10">!预约有效率: 预约并就餐人数/实际就餐总人数</span></div>
        </el-row>
    </el-row>
</template>
<script>
import {commonFunc2} from '@/utils/resources/index.js';
export default {
    data() {
        return {
            dataForm: {
                bookingType: 0,
                startTime: '',
                endTime: '',
            },
            searchDate: [],
            dataListLoading: false,
            dataList: [],
            bookingTypeList: [{value: 0, label: '全部'}, {value: 1, label: '早餐'}, {value: 2, label: '午餐'}, {value: 3, label: '晚餐'}],
            pageNum: 1,
            pageSize: 10,
            total: 0,
        };
    },
    methods: {
        getDataListFun() {
            this.pageNum = 1;
            this.getDataList();
        },
        getDataList() {
            this.dataListLoading = true;
            this.$http({
                url: this.$http.adornUrl('/v1/customized/statistics/list'),
                method: 'get',
                params: this.$http.adornParams(
                    Object.assign(
                        {
                            pageNum: this.pageNum,
                            pageSize: this.pageSize,
                        },
                        this.dataForm
                    )
                ),
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.dataList = data.data.list;
                    this.total = data.data.total;
                }
                this.dataListLoading = false;
            });
        },
        getTime(value) {
            if (value) {
                this.dataForm.startTime = value[0];
                this.dataForm.endTime = value[1];
            } else {
                this.dataForm.startTime = '';
                this.dataForm.endTime = '';
            }
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
        headerClick(column, event) {
            console.log(column);
            console.log(event);
        },
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
                url: this.$http.adornUrl('/v1/customized/statistics/list/excels'),
                method: 'get',
                responseType: 'blob',
                params: this.$http.adornParams(Object.assign(pageInfo, this.dataForm)),
            })
                .then(response => {
                    download(response.data, '数据统计.xls');
                })
                .catch(err => {
                    console.log(err);
                });
        },
        recordTime(item) {
            return commonFunc2(item.recordTime);
        },
        bookingType(item) {
            return bookingType(item.bookingType);
        },
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.getDataListFun();
        });
    },
};
</script>
<style lang="scss" scoped>
.data_count {
    .data_tip {
        float: right;
        margin-right: 50px;
        color: #999;
        margin-top: 26px;
    }
    .el-pagination {
        float: right;
    }
}
</style>
