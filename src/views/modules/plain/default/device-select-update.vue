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
                <el-button size="mini" type="primary" @click="getDataList()">查询</el-button>
                <el-button size="mini" type="success" @click="visable = false">关闭</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="dataList" border style="width: 100%;">
            <el-table-column type="index" header-align="center" align="center" width="50" label="序号"> </el-table-column>
            <el-table-column prop="name" header-align="center" align="center" :show-overflow-tooltip="true" label="名称"> </el-table-column>
            <el-table-column prop="deviceSn" header-align="center" align="center" label="编号"> </el-table-column>
            <el-table-column prop="typeDesc" header-align="center" align="center" label="设备类型"> </el-table-column>
            <el-table-column header-align="center" align="center" label="图片">
                <template slot-scope="scope">
                    <el-popover placement="right" trigger="click">
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
    </el-dialog>
</template>

<script>
import {commonFunc} from '@/utils/resources/index.js';
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
            planId: null,
            visable: false,
            statuslist: [{value: 1, label: '正常'}, {value: 2, label: '故障'}, {value: 3, label: '停用'}, {value: 4, label: '预警'}],
            typelist: [],
        };
    },
    methods: {
        init(id) {
            this.visable = true;
            this.planId = id; //编辑id
            this.getDataList();
            this.getDeviceOptions();
        },
        getDataList() {
            this.$http({
                url: this.$http.adornUrl('/v1/pm/devices'),
                method: 'get',
                params: this.$http.adornParams({
                    pageNum: 1,
                    pageSize: 999,
                    deviceSn: this.dataForm.deviceSn,
                    floorName: this.dataForm.floorName,
                    status: this.dataForm.status,
                    type: this.dataForm.type,
                    planId: this.planId,
                }),
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.dataList = data.data.list;
                }
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
        // 添加
        add(deviceId) {
            this.$http({
                url: this.$http.adornUrl('/v1/pm/check/plans/' + this.planId + '/devices/' + deviceId),
                method: 'post',
            }).then(({data}) => {
                if (data && data.code === 201) {
                    this.$message({
                        message: '操作成功',
                        type: 'success',
                        duration: 1000,
                        onClose: () => {
                            this.visable = false;
                            this.$emit('refreshDataList');
                        },
                    });
                }
            });
        },
        installationTime(item) {
            return commonFunc(item.installationTime);
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
