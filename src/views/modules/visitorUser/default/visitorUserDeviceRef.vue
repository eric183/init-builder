<template>
    <el-dialog :title="pageTitle" :close-on-click-modal="false" :visible.sync="dialogVisible">
        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column label="设备编号" align="center" prop="deviceId"> </el-table-column>
            <el-table-column prop="name" align="center" label="设备名称"> </el-table-column>
            <el-table-column prop="faceNum" label="人脸数" align="center" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="ip" label="IP" align="center" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="netStatus" label="联网状态" align="center" :formatter="netStatusFn" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="status" label="设置状态" align="center" :formatter="fmtSatus" show-overflow-tooltip> </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submmit()">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import FormTable from '@/views/compontents/FormTable';
export default {
    components: {
        FormTable,
    },
    data() {
        return {
            dialogVisible: false,
            userId: null,
            pageTitle: '',
            tableData: [],
            multipleSelection: [],
        };
    },
    methods: {
        init(userId) {
            this.userId = userId;
            this.pageTitle = '绑定设备';
            this.selectDevices();
            this.dialogVisible = true;
        },
        netStatusFn(row, column, value, index) {
            if (value === 1) {
                return '在线';
            } else if (value === 2) {
                return '不在线';
            }
            return '未知状态';
        },
        fmtSatus(row, column, value, index) {
            if (value === 1) {
                return '启用';
            } else if (value === 2) {
                return '禁用';
            }
            return '未知状态';
        },
        toggleSelection(rows) {
            if (rows) {
                rows.forEach(row => {
                    this.$refs.multipleTable.toggleRowSelection(row);
                });
            } else {
                this.$refs.multipleTable.clearSelection();
            }
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        selectDevices() {
            let obj = Object.assign({
                pageNum: 1,
                pageSize: 10000,
            });
            let that = this;
            this.$http({
                url: this.$http.adornUrl4('/v1/face/devices'),
                method: 'GET',
                params: this.$http.adornParams(obj),
            }).then(data => {
                if (data && data.data.code === 200) {
                    that.tableData = data.data.data.list;
                    that.selectCheckDevices();
                }
            });
        },
        selectCheckDevices() {
            let obj = Object.assign({
                pageNum: 1,
                pageSize: 10000,
            });
            let that = this;
            this.$http({
                url: this.$http.adornUrl4('/v1/face/visitorUsers/' + this.userId + '/devices'),
                method: 'GET',
                params: this.$http.adornParams(obj),
            }).then(data => {
                if (data && data.data.code === 200) {
                    console.info(data);
                    // that.tableData = data.data.data
                    that.selectTableRow(data.data.data);
                }
            });
        },
        selectTableRow(checkData) {
            for (let index in this.tableData) {
                for (let v in checkData) {
                    if (this.tableData[index].deviceId === checkData[v].deviceId) {
                        this.$refs.multipleTable.toggleRowSelection(this.tableData[index]);
                        break;
                    }
                }
            }
        },
        submmit() {
            if (this.multipleSelection && this.multipleSelection.length < 1) {
                this.$alert('请选择要绑定的设备', {
                    confirmButtonText: '确定',
                });
            } else {
                let that = this;
                let deviceIds = [];
                for (let index in this.multipleSelection) {
                    deviceIds.push(this.multipleSelection[index].deviceId);
                }
                console.info(deviceIds);
                this.$http({
                    url: this.$http.adornUrl4('/v1/face/visitorUserDevices'),
                    method: 'POST',
                    data: this.$http.adornData({userIds: [that.userId], deviceIds: deviceIds}),
                }).then(data => {
                    if (data && data.data.code === 201) {
                        this.$message({
                            type: 'info',
                            message: `设备绑定成功过`,
                        });
                        that.dialogVisible = false;
                    }
                });
            }
        },
    },
};
</script>

<style scoped></style>
