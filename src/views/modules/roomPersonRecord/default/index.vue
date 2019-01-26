<template>
    <el-row>
        <!-- 食堂人员刷卡记录 -->
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataListFun()" size="small">
            <el-form-item label="姓名:"> <el-input v-model="dataForm.realname" placeholder="请输入姓名" clearable></el-input> </el-form-item>
            <el-form-item label="手机号:"> <el-input v-model="dataForm.phone" placeholder="请输入手机号" clearable></el-input> </el-form-item>
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
            <el-table-column prop="realname" header-align="center" align="center" label="姓名"></el-table-column>
            <el-table-column :formatter="genderType" header-align="center" align="center" label="性别"></el-table-column>
            <el-table-column prop="phone" header-align="center" align="center" label="手机号"></el-table-column>
            <el-table-column prop="departmentName" header-align="center" align="center" label="部门"></el-table-column>
            <el-table-column prop="employeeNo" header-align="center" align="center" label="工号"></el-table-column>
        </el-table>
        <el-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="pageNum"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
    </el-row>
</template>
<script>
import {genderType, download,commonFunc} from '@/utils/resources/index.js';
export default {
    data() {
        return {
            dataForm: {
                phone: '',
                realname: '',
                startTime: '',
                endTime: '',
            },
            searchDate: [],
            dataListLoading: false,
            dataList: [],
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
                url: this.$http.adornUrl('/v1/customized/signRecords'),
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
                url: this.$http.adornUrl('/v1/customized/signRecords/excels'),
                method: 'get',
                responseType: 'blob',
                params: this.$http.adornParams(Object.assign(pageInfo, this.dataForm)),
            })
                .then(response => {
                    download(response.data, '刷卡记录.xls');
                })
                .catch(err => {
                    console.log(err);
                });
        },
        genderType(item) {
            return genderType(item.gender);
        },
        recordTime(item) {
            return commonFunc.commonFunc(item.recordTime);
        },
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.getDataListFun();
        });
    },
};
</script>
