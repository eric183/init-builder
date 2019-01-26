<template>
    <el-row>
        <el-row>
            <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataListFun()" size="small">
                <el-form-item> <el-input v-model="dataForm.deviceNo" placeholder="设备编号" clearable></el-input> </el-form-item>
                <el-form-item> <el-input v-model="dataForm.deviceName" placeholder="设备名称" clearable></el-input> </el-form-item>
                <el-form-item label="设备状态:" class="ml10">
                    <el-select v-model="dataForm.status"> <el-option v-for="item in deviceStatuList" :key="item.value" :label="item.label" :value="item.value"></el-option> </el-select>
                </el-form-item>
                <el-form-item label="联网状态:" class="ml10">
                    <el-select v-model="dataForm.netStatus"> <el-option v-for="item in netStatusList" :key="item.value" :label="item.label" :value="item.value"></el-option> </el-select>
                </el-form-item>
                <el-form-item> <el-button type="primary" @click="getDataListFun()">查询</el-button> </el-form-item>
            </el-form>
        </el-row>
        <el-table :data="dataList" border style="width: 100%;" :default-expand-all="true">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <div v-for="(item, index) in props.row.switchChannels" :key="index" class="table_expand">
                        <div class="table_box">
                            <label>通道名称：</label> <span>{{ item.name }}</span>
                        </div>
                        <div class="table_box">
                            <label>通道编号：</label> <span>{{ 'R' + (item.outlet + 1) }}</span>
                        </div>
                        <div class="table_box">
                            <label>连接设备：</label> <span>{{ item.connectDevice }}</span>
                        </div>
                        <div class="table_box">
                            <label>通道状态：</label> <span>{{ statusChange(item.status) }}</span>
                        </div>
                        <div class="table_box">
                            <label>开关状态：</label>
                            <el-switch
                                :disabled="props.row.netStatus == 2"
                                :width="30"
                                v-model="item.switchStatus"
                                @change="switchChange(item)"
                                active-text="开启"
                                :active-value="1"
                                inactive-text="关闭"
                                :inactive-value="2"
                            >
                            </el-switch>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="deviceName" header-align="center" align="center" label="设备名称"> </el-table-column>
            <el-table-column prop="deviceNo" header-align="center" align="center" label="设备编号"> </el-table-column>
            <el-table-column :formatter="status" header-align="center" align="center" label="设备状态"> </el-table-column>
            <el-table-column :formatter="netStatus" header-align="center" align="center" label="联网状态"> </el-table-column>
            <el-table-column prop="address" header-align="center" align="center" label="安装地址"> </el-table-column>
            <el-table-column prop="remark" header-align="center" align="center" label="备注"> </el-table-column>
        </el-table>
        <el-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="pageIndex"
            :page-sizes="[3, 6, 10, 20]"
            :page-size="pageSize"
            :total="totalPage"
            layout="total, sizes, prev, pager, next, jumper"
        >
        </el-pagination>
    </el-row>
</template>

<script>
export default {
    data() {
        return {
            dataList: [],
            dataForm: {
                deviceNo: '',
                deviceName: '',
                netStatus: null,
                status: null,
            },
            deviceStatuList: [{value: null, label: '全部'}, {value: 1, label: '启用'}, {value: 2, label: '停用'}, {value: 3, label: '故障'}],
            netStatusList: [{value: null, label: '全部'}, {value: 1, label: '在线'}, {value: 2, label: '离线'}, {value: 3, label: '未知'}],
            dataListLoading: false,
            pageIndex: 1,
            pageSize: 3,
            totalPage: 0,
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
                url: this.$http.adornUrl('/v1/dvc/switchDevices'),
                method: 'get',
                params: this.$http.adornParams({
                    pageNum: this.pageIndex,
                    pageSize: this.pageSize,
                    deviceNo: this.dataForm.deviceNo,
                    deviceName: this.dataForm.deviceName,
                    netStatus: this.dataForm.netStatus,
                    status: this.dataForm.status,
                }),
            }).then(({data}) => {
                this.dataList = data.data.list;
                this.totalPage = data.data.total;
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
        // 通到状态更改
        statusChange(item) {
            switch (item) {
                case 1:
                    return '启用';
                    break;
                case 2:
                    return '停用';
                    break;
                case 3:
                    return '故障';
                    break;
            }
        },
        // 智能开关状态更改
        switchChange(item) {
            var list = [];
            list.push(item.channelId);
            this.$http({
                url: this.$http.adornUrl('/v1/dvc/switchChannels/status'),
                method: 'put',
                data: this.$http.adornData({
                    channelIds: list,
                    switchStatus: item.switchStatus,
                }),
            })
                .then(({data}) => {
                    if (data && data.code === 201) {
                        this.$message({
                            message: '操作成功',
                            type: 'success',
                        });
                    }
                })
                .catch(this.getDataList());
        },
        // 格式化数据
        status(item) {
            switch (item.status) {
                case 1:
                    return '启用';
                    break;
                case 2:
                    return '停用';
                    break;
                case 3:
                    return '故障';
                    break;
            }
        },
        netStatus(item) {
            switch (item.netStatus) {
                case 1:
                    return '在线';
                    break;
                case 2:
                    return '离线';
                    break;
                case 3:
                    return '未知';
                    break;
            }
        },
    },
};
</script>
<style lang="scss" scoped>
.table_expand {
    display: flex;
    justify-content: space-around;
    .table_box {
        padding: 10px 0;
        width: 20%;
        text-align: center;
        label {
            color: #99a9bf;
        }
        span {
            margin-left: 20px;
        }
        .el-switch {
            margin-left: 20px;
        }
    }
}
</style>
