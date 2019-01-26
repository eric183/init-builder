<template>
    <div class="mod-user">
        <!-- 计划列表页面 -->
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataListFun()" size="small">
            <el-form-item> <el-input v-model="dataForm.planSn" placeholder="计划单号:" clearable></el-input> </el-form-item>
            <el-form-item> <el-input v-model="dataForm.managerName" placeholder="责任人:" clearable></el-input> </el-form-item>
            <el-form-item label="工作类别:">
                <el-select v-model="dataForm.type" placeholder="工作类别"> <el-option v-for="item in typelist" :key="item.value" :label="item.label" :value="item.value"></el-option> </el-select>
            </el-form-item>
            <el-form-item label="计划状态:">
                <el-select v-model="dataForm.status" placeholder="计划状态"> <el-option v-for="item in statuslist" :key="item.value" :label="item.label" :value="item.value"></el-option> </el-select>
            </el-form-item>
            <el-form-item>
                <el-button size="small" type="primary" @click="getDataListFun()">查询</el-button>
                <el-button size="small" type="success" @click="add()">新增</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
            <el-table-column type="index" header-align="center" align="center" width="50" label="序号"> </el-table-column>
            <el-table-column prop="planSn" header-align="center" align="center" label="计划单号"> </el-table-column>
            <el-table-column prop="name" header-align="center" align="center" label="计划名称"> </el-table-column>
            <el-table-column prop="startTime" :formatter="startTime" header-align="center" align="center" label="开始时间"> </el-table-column>
            <el-table-column prop="type" :formatter="devicetype" header-align="center" align="center" label="工作类别"> </el-table-column>
            <el-table-column prop="rule" :formatter="rule" header-align="center" align="center" label="计划规则"> </el-table-column>
            <el-table-column prop="createdAt" :formatter="createdAt" header-align="center" align="center" label="创建时间"> </el-table-column>
            <el-table-column prop="managerName" header-align="center" align="center" label="责任人"> </el-table-column>
            <el-table-column prop="status" :formatter="devicestatus" header-align="center" align="center" label="计划状态"> </el-table-column>
            <el-table-column header-align="center" align="center" width="150" label="操作">
                <template slot-scope="scope">
                    <el-button type="danger" plain size="mini" @click="defoinfo(scope.row.planId)">详情</el-button>
                    <el-button type="success" plain size="mini" @click="edit(scope.row.planId)">编辑</el-button>
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
        <!-- 弹窗, 新增 / 修改 -->
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    </div>
</template>

<script>
import commonFunc from '@/assets/common.js';
import AddOrUpdate from './group-add-or-update';
import {rule, devicestatus, devicetype} from '@/assets/statue.js';
export default {
    data() {
        return {
            dataForm: {
                planSn: '',
                managerName: '',
                type: null,
                status: null,
            },
            dataList: [],
            pageIndex: 1, //页面进来列表数据展示分页
            pageSize: 10,
            totalPage: 0,
            dataListLoading: false,
            addOrUpdateVisible: false,
            typelist: [{value: null, label: '全部'}, {value: 1, label: '巡检'}, {value: 2, label: '保养'}],
            statuslist: [{value: null, label: '全部'}, {value: 1, label: '新建'}, {value: 2, label: '执行中'}, {value: 3, label: '暂停中'}, {value: 4, label: '已终止'}],
        };
    },
    components: {
        AddOrUpdate,
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
                url: this.$http.adornUrl('/v1/pm/check/plans'),
                method: 'get',
                params: this.$http.adornParams({
                    pageNum: this.pageIndex,
                    pageSize: this.pageSize,
                    planSn: this.dataForm.planSn,
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
        // 新增
        add() {
            this.$router.push({name: 'plain-add'});
        },
        // 编辑
        edit(planId) {
            this.$router.push({name: 'plain-update', query: {planId: planId}});
        },
        // 详情
        defoinfo(planId) {
            this.$router.push({name: 'plain-info', query: {planId: planId}});
        },
        startTime(item) {
            return commonFunc.commonFunc(item.startTime);
        },
        createdAt(item) {
            return commonFunc.commonFunc(item.createdAt);
        },
        rule(item) {
            return rule(item.rule);
        },
        devicestatus(item) {
            return devicestatus(item.status);
        },
        devicetype(item) {
            return devicetype(item.type);
        },
    },
};
</script>
