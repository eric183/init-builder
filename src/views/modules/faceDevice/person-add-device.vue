<template>
    <el-dialog :visible.sync="visible" title="绑定设备">
        <el-table :data="dataList" style="width: 100%">
            <el-table-column type="index" label="序号"> </el-table-column>
            <el-table-column prop="name" header-align="center" align="center" label="名称"> </el-table-column>
            <el-table-column prop="type" header-align="center" align="center" :formatter="type" label="类型"> </el-table-column>
            <el-table-column prop="ip" header-align="center" align="center" width="100" label="ip地址"> </el-table-column>
            <el-table-column prop="version" header-align="center" align="center" label="版本号"> </el-table-column>
            <el-table-column prop="status" header-align="center" :formatter="status" align="center" label="状态"> </el-table-column>
            <el-table-column prop="inout" header-align="center" :formatter="inout" align="center" label="安装位置"> </el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
                <template slot-scope="scope">
                    <el-button type="success" size="mini" @click="deleDevice(scope.row.deviceId)">绑定</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-dialog>
</template>

<script>
export default {
    data() {
        return {
            visible: false,
            dataList: [],
            userId: 0,
        };
    },
    methods: {
        init(id) {
            this.userId = id;
            this.visible = true;
            this.$http({
                url: this.$http.adornUrl4('/v1/face/users/' + this.userId + '/notDevices'),
                method: 'get',
            }).then(data => {
                data = data.data;
                if (data && data.code === 200) {
                    this.dataList = data.data;
                }
            });
        },
        // 用户绑定和设备
        deleDevice(deviceId) {
            var userIds = []; //用户数组
            var deviceIds = []; //设备数组
            userIds.push(this.userId);
            deviceIds.push(deviceId);
            this.$http({
                url: this.$http.adornUrl4(`/v1/face/users/bindingDevices`),
                method: 'post',
                data: this.$http.adornData({
                    userIds: userIds,
                    deviceIds: deviceIds,
                }),
            }).then(({data}) => {
                if (data && data.code === 201) {
                    this.$message({
                        message: '操作成功',
                        type: 'success',
                        duration: 1000,
                        onClose: () => {
                            this.visible = false;
                        },
                    });
                }
            });
        },
        type(item) {
            switch (item.type) {
                case 1:
                    return '闸机';
                    break;
            }
        },
        status(item) {
            switch (item.status) {
                case 1:
                    return '启用';
                    break;
                case 2:
                    return '停用';
                    break;
            }
        },
        inout(item) {
            switch (item.inout) {
                case 1:
                    return '进入';
                    break;
                case 2:
                    return '外出';
                    break;
                case 3:
                    return '其它';
                    break;
            }
        },
    },
};
</script>
