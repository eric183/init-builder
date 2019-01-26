<template>
    <el-dialog :visible.sync="visable">
        <el-form :model="dataForm" ref="dataForm" :inline="true" @keyup.enter.native="dataFormSubmit()" size="small">
            <el-form-item prop="deviceSn" class="deviceSn"> <el-input v-model="dataForm.deviceSn" placeholder="设备编号" clearable></el-input> </el-form-item>
            <el-form-item prop="floorName"> <el-input v-model="dataForm.floorName" placeholder="安装楼层" clearable></el-input> </el-form-item>
            <el-form-item size="small">
                <el-select v-model="dataForm.status" placeholder="选择状态" clearable>
                    <el-option v-for="item in statuslist" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item size="small">
                <el-select v-model="dataForm.type" placeholder="选择类别" clearable>
                    <el-option v-for="item in typelist" :key="item.type" :label="item.typeDesc" :value="item.type"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button size="mini" type="primary" @click="getDataListFun()">查询</el-button>
                <el-button size="mini" type="success" @click="visable = false">关闭</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
            <el-table-column type="index" header-align="center" align="center" width="50" label="序号"> </el-table-column>
            <el-table-column prop="name" header-align="center" align="center" :show-overflow-tooltip="true" label="名称"> </el-table-column>
            <el-table-column prop="deviceSn" header-align="center" align="center" label="编号"> </el-table-column>
            <el-table-column prop="typeDesc" header-align="center" align="center" label="设备类型"> </el-table-column>
            <el-table-column header-align="center" align="center" label="图片">
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
            <el-table-column header-align="center" align="center" width="100" label="操作">
                <template slot-scope="scope">
                    <el-button type="danger" plain size="mini" @click="add(scope.row.deviceId)">添加</el-button>
                </template>
            </el-table-column>
        </el-table>
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
    </el-dialog>
</template>

<script>
import commonFunc from '@/assets/common.js';
export default {
    data() {
        return {
            dataList: [], //设备列表的数据
            dataForm: {
                deviceSn: '',
                floorName: '',
                status: 1,
                type: null,
            },
            pageNum: 1,
            pageSize: 10,
            total: 0,
            dataListLoading: false,
            deviceIdList: [], //设备id数组，用于过滤
            visable: false,
            statuslist: [{value: 1, label: '正常'}, {value: 2, label: '故障'}, {value: 3, label: '停用'}, {value: 4, label: '预警'}],
            typelist: [],
        };
    },
    methods: {
        init(data) {
            this.visable = true;
            this.deviceIdList = data; //设备信息列表传到设备弹出框页面
            this.getDataList();
            this.getDeviceOptions();
        },
        getDataListFun() {
            this.pageNum = 1;
            this.getDataList();
        },
        getDataList() {
            var str = '';
            str = '[' + this.deviceIdList.join(',') + ']';
            this.dataListLoading = true;
            this.$http({
                url: this.$http.adornUrl('/v1/pm/devices'),
                method: 'get',
                params: this.$http.adornParams({
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    deviceSn: this.dataForm.deviceSn,
                    floorName: this.dataForm.floorName,
                    status: this.dataForm.status,
                    type: this.dataForm.type,
                    exclusiveDeviceIds: this.deviceIdList.length == 0 ? undefined : str,
                }),
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.dataList = data.data.list;
                    this.total = data.data.total;
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
        // 添加
        add(deviceId) {
            this.$emit('id', deviceId);
            this.$message({
                message: '操作成功',
                type: 'success',
            });
            this.visable = false;
        },
        installationTime(item) {
            return commonFunc.commonFunc(item.installationTime);
        },
    },
};
</script>
<style lang="scss" scoped>
.el-input,
.el-select {
    width: 110px;
}
.deviceSn {
    .el-input {
        width: 140px;
    }
}
</style>
