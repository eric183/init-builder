<template>
    <div class="mod-user">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataListFun()" size="small">
            <el-form-item> <el-input v-model="dataForm.deviceSn" placeholder="设备编号" clearable></el-input> </el-form-item>
            <el-form-item> <el-input v-model="dataForm.floorName" placeholder="安装楼层" clearable></el-input> </el-form-item>
            <el-form-item label="状态:">
                <el-select v-model="dataForm.status" placeholder="状态"> <el-option v-for="item in statuslist" :key="item.value" :label="item.label" :value="item.value"></el-option> </el-select>
            </el-form-item>
            <el-form-item label="类别:">
                <el-select v-model="dataForm.list" placeholder="类别" multiple @change="changeType">
                    <el-option v-for="item in typelist" :key="item.type" :label="item.typeDesc" :value="item.type"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button size="small" type="primary" @click="getDataListFun()">查询</el-button>
                <el-button size="small" type="success" @click="add()">新增</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
            <el-table-column type="index" header-align="center" align="center" width="50" label="序号"> </el-table-column>
            <el-table-column prop="name" header-align="center" align="center" :show-overflow-tooltip="true" label="名称"> </el-table-column>
            <el-table-column prop="deviceSn" header-align="center" align="center" label="设备编号"> </el-table-column>
            <el-table-column prop="typeDesc" header-align="center" align="center" label="设备类型"> </el-table-column>
            <el-table-column header-align="center" align="center" label="设备图片">
                <template slot-scope="scope">
                    <el-popover v-if="scope.row.image" placement="right" trigger="click">
                        <img :src="scope.row.image" style="max-width:720px;max-height:600px;" /> <img slot="reference" :src="scope.row.image" style="width:50px;height:50px;" />
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column prop="floorName" header-align="center" align="center" label="安装楼层"> </el-table-column>
            <el-table-column prop="status" header-align="center" align="center" label="设备状态">
                <template slot-scope="scope">
                    <span class="success" v-if="scope.row.status == 1" key="success">正常</span> <span class="warning" v-if="scope.row.status == 2" key="warning">故障</span>
                    <span class="info" v-if="scope.row.status == 3" key="info">停用</span> <span class="danger" v-if="scope.row.status == 4" key="danger">预警</span>
                </template>
            </el-table-column>
            <el-table-column prop="installationTime" :formatter="installationTime" header-align="center" align="center" label="安装日期"> </el-table-column>
            <el-table-column header-align="center" align="center" width="150" label="操作">
                <template slot-scope="scope">
                    <el-button type="danger" plain size="mini" @click="defoinfo(scope.row.deviceId)">详情</el-button>
                    <el-button type="success" plain size="mini" @click="edit(scope.row.deviceId)">修改</el-button>
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
export default {
    data() {
        return {
            dataForm: {
                deviceSn: '',
                floorName: '',
                status: null,
                type: '',
                list: [],
            },
            dataList: [],
            pageIndex: 1, //页面进来列表数据展示分页
            pageSize: 10,
            totalPage: 0,
            dataListLoading: false,
            addOrUpdateVisible: false,
            statuslist: [{value: null, label: '全部'}, {value: 1, label: '正常'}, {value: 2, label: '故障'}, {value: 3, label: '停用'}, {value: 4, label: '预警'}],
            typelist: [],
        };
    },
    components: {
        AddOrUpdate,
    },
    activated() {
        this.getDataList();
        this.getDeviceOptions();
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
                url: this.$http.adornUrl('/v1/pm/devices'),
                method: 'get',
                params: this.$http.adornParams({
                    pageNum: this.pageIndex,
                    pageSize: this.pageSize,
                    deviceSn: this.dataForm.deviceSn,
                    floorName: this.dataForm.floorName,
                    status: this.dataForm.status,
                    type: this.dataForm.type,
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
        // 设备类型下拉列表
        getDeviceOptions() {
            this.$http({
                url: this.$http.adornUrl('/v1/pm/devices/typeOptions'),
                method: 'get',
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.typelist = data.data.types;
                }
            });
        },
        // 设备类型下拉的change事件
        changeType(value) {
            this.dataForm.type = value.join(',');
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
            this.$router.push({name: 'groupoperation'});
        },
        // 编辑
        edit(deviceId) {
            this.$router.push({name: 'groupoperation', query: {deviceId: deviceId}});
        },
        // 详情
        defoinfo(deviceId) {
            this.$router.push({name: 'superdev-groupinfo', query: {id: deviceId}});
        },
        installationTime(item) {
            return commonFunc.commonFunc(item.installationTime);
        },
    },
};
</script>
