<template>
    <div class="mod-user">
        <!-- 任务列表 -->
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataListFun()" size="small">
            <el-form-item> <el-input v-model="dataForm.taskSn" placeholder="任务单号" clearable></el-input> </el-form-item>
            <el-form-item> <el-input v-model="dataForm.managerName" placeholder="责任人" clearable></el-input> </el-form-item>
            <el-form-item label="工作类别:" class="ml10">
                <el-select v-model="dataForm.type" placeholder="工作类别"> <el-option v-for="item in typelist" :key="item.value" :label="item.label" :value="item.value"></el-option> </el-select>
            </el-form-item>
            <el-form-item label="任务状态:" class="ml10">
                <el-select v-model="dataForm.status" placeholder="计划状态"> <el-option v-for="item in statuslist" :key="item.value" :label="item.label" :value="item.value"></el-option> </el-select>
            </el-form-item>
            <el-form-item> <el-button size="small" type="primary" @click="getDataListFun()">查询</el-button> </el-form-item>
        </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
            <el-table-column type="index" header-align="center" align="center" width="50" label="序号"> </el-table-column>
            <el-table-column prop="taskSn" header-align="center" align="center" label="任务单号"> </el-table-column>
            <el-table-column prop="name" header-align="center" align="center" label="计划名称"> </el-table-column>
            <el-table-column prop="type" :formatter="type" header-align="center" align="center" label="工作类别"> </el-table-column>
            <el-table-column prop="createdAt" header-align="center" align="center" :formatter="createdAt" label="任务执行开始时间"> </el-table-column>
            <el-table-column prop="managerName" header-align="center" align="center" label="责任人"> </el-table-column>
            <el-table-column prop="status" header-align="center" align="center" :formatter="status" label="任务状态"> </el-table-column>
            <el-table-column header-align="center" align="center" width="100" label="操作">
                <template slot-scope="scope">
                    <el-button type="danger" plain size="mini" @click="defoinfo(scope.row.taskId)">详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="pageIndex"
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
import {devicetype, taskstatus} from '@/assets/statue.js';
export default {
    data() {
        return {
            dataForm: {
                taskSn: '',
                managerName: '',
                status: null,
                type: null,
            },
            dataList: [],
            pageIndex: 1, //页面进来列表数据展示分页
            pageSize: 10,
            totalPage: 0,
            dataListLoading: false,
            addOrUpdateVisible: false,
            statuslist: [
                {value: null, label: '全部'},
                {value: 1, label: '响应超时'},
                {value: 2, label: '待接收'},
                {value: 3, label: '处理中'},
                {value: 4, label: '任务完成'},
                {value: 5, label: '正常结束'},
                {value: 6, label: '任务超时'},
                {value: 7, label: '异常结束'},
            ],
            typelist: [{value: null, label: '全部'}, {value: 1, label: '巡检'}, {value: 2, label: '保养'}],
        };
    },
    activated() {
        this.getDataList();
    },
    methods: {
        getDataListFun() {
            this.pageIndex = 1;
            this.getDataList();
        },
        // 获取数据列表
        getDataList() {
            this.dataListLoading = true;
            this.$http({
                url: this.$http.adornUrl('/v1/pm/check/tasks'),
                method: 'get',
                params: this.$http.adornParams({
                    pageNum: this.pageIndex,
                    pageSize: this.pageSize,
                    taskSn: this.dataForm.taskSn,
                    managerName: this.dataForm.managerName,
                    type: this.dataForm.type,
                    status: this.dataForm.status,
                }),
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.dataList = data.data.list;
                    this.totalPage = data.data.total;
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
            this.pageIndex = 1;
            this.getDataList();
        },
        // 当前页
        currentChangeHandle(val) {
            this.pageIndex = val;
            this.getDataList();
        },
        // 详情
        defoinfo(taskId) {
            this.$router.push({name: 'task-info', query: {taskId: taskId}});
        },
        createdAt(item) {
            return commonFunc.commonFunc(item.createdAt);
        },
        type(item) {
            return devicetype(item.type);
        },
        status(item) {
            return taskstatus(item.status);
        },
    },
};
</script>
