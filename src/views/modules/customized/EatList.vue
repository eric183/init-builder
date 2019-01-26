<template>
    <el-row>
        <!-- 就餐列表 -->
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataListFun()" size="small">
            <el-form-item label="用餐类型:" class="ml10">
                <el-select v-model="dataForm.bookingType" clearable> <el-option v-for="item in bookingTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option> </el-select>
            </el-form-item>
            <el-form-item label="姓名："> <el-input v-model="dataForm.realname" placeholder="请输入姓名" clearable></el-input> </el-form-item>
            <el-form-item label="是否预约:" class="ml10">
                <el-select v-model="dataForm.isBooked" clearable> <el-option v-for="item in isBookedList" :key="item.value" :label="item.label" :value="item.value"></el-option> </el-select>
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
        <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
            <el-table-column type="index" header-align="center" align="center" width="50" label="序号"></el-table-column>
            <el-table-column :formatter="recordTime" header-align="center" align="center" label="刷卡时间"></el-table-column>
            <el-table-column :formatter="bookingType" header-align="center" align="center" label="用餐类型"></el-table-column>
            <el-table-column prop="realname" header-align="center" align="center" label="姓名"></el-table-column>
            <el-table-column prop="departmentName" header-align="center" align="center" label="部门"></el-table-column>
            <el-table-column prop="employeeNo" header-align="center" align="center" label="工号"></el-table-column>
            <el-table-column :formatter="isBooked" header-align="center" align="center" label="是否预约"></el-table-column>
        </el-table>
        <div class="bock">
            <el-pagination
                class="page"
                @size-change="sizeChangeHandle"
                @current-change="currentChangeHandle"
                :current-page="pageNum"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="pageSize"
                :total="total"
                layout="total, sizes, prev, pager, next, jumper"
            ></el-pagination>
            <span class="demonstration">就餐记录</span>
        </div>
    </el-row>
</template>
<script>
import {commonFunc , commonFunc2 , bookingType, isBooked, download} from '@/utils/resources/index.js';
export default {
    data() {
        return {
            dataForm: {
                bookingType: 0,
                isBooked: null,
                realname: '',
                startTime: '',
                endTime: '',
            },
            searchDate: [],
            dataListLoading: false,
            dataList: [],
            bookingTypeList: [{value: 0, label: '全部'}, {value: 1, label: '早餐'}, {value: 2, label: '午餐'}, {value: 3, label: '晚餐'}],
            isBookedList: [{value: null, label: '全部'}, {value: 1, label: '已预约'}, {value: 0, label: '未预约'}],
            pageNum: 1,
            pageSize: 10,
            total: 0,
        };
    },
    methods: {
        // 初始化时间
        initTime() {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            this.searchDate = [start, end];
            this.dataForm.startTime = commonFunc2(start.getTime());
            this.dataForm.endTime = commonFunc2(end.getTime());
        },
        getDataListFun() {
            this.pageNum = 1;
            this.getDataList();
        },
        getDataList() {
            this.dataListLoading = true;
            this.$http({
                url: this.$http.adornUrl('/v1/customized/payRecords'),
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
                url: this.$http.adornUrl('/v1/customized/payRecords/excels'),
                method: 'get',
                responseType: 'blob',
                params: this.$http.adornParams(Object.assign(pageInfo, this.dataForm)),
            })
                .then(response => {
                    download(response.data, '就餐.xls');
                })
                .catch(err => {
                    console.log(err);
                });
        },
        bookingType(item) {
            return bookingType(item.bookingType);
        },
        recordTime(item) {
            return commonFunc(item.recordTime);
        },
        isBooked(item) {
            return isBooked(item.isBooked);
        },
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            // vm.initTime()
            vm.getDataListFun();
        });
    },
};
</script>
<style lang="scss" scoped>
.bock {
    .demonstration {
        float: right;
        margin-top: 18px;
        height: 28px;
        line-height: 28px;
        font-weight: bold;
    }
    .page {
        float: right;
    }
}
</style>
