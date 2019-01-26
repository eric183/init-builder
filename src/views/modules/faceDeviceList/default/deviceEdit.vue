<template>
    <el-dialog :title="pageTitle" :close-on-click-modal="false" :visible.sync="dialogVisible">
        <el-form :model="dataForm" ref="dataForm" label-width="80px" size="small">
            <el-form-item label="名称"> <el-input v-model="dataForm.name" placeholder="名称" /> </el-form-item>
            <el-form-item label="类型">
                <el-select v-model="dataForm.type"> <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" /> </el-select>
            </el-form-item>
            <el-form-item label="IP"> <el-input v-model="dataForm.ip" placeholder="IP" /> </el-form-item>
            <el-form-item label="版本号"> <el-input v-model="dataForm.version" placeholder="版本号" /> </el-form-item>
            <el-form-item label="联网状态">
                <el-radio-group v-model="dataForm.netStatus">
                    <el-radio v-for="item in netStatusOptions" :label="item.value" :key="item.value">{{ item.label }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="设备状态">
                <el-radio-group v-model="dataForm.status">
                    <el-radio v-for="item in deviceStatusOptions" :label="item.value" :key="item.value">{{ item.label }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="活体检测">
                <el-radio-group v-model="dataForm.livenessEnable">
                    <el-radio v-for="item in livenessEnableOptions" :label="item.value" :key="item.value">{{ item.label }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="人脸阀值"> <el-input-number v-model="dataForm.threshold" :precision="1" :step="0.1" :max="100"></el-input-number> </el-form-item>
            <el-form-item label="屏幕亮度"> <el-input-number v-model="dataForm.brightness" :precision="0" :step="1" :max="100"></el-input-number> </el-form-item>
            <el-form-item label="声音大小"> <el-input-number v-model="dataForm.voice" :precision="0" :step="1" :max="100"></el-input-number> </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submmit()">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    data() {
        return {
            typeOptions: [{label: '闸机', value: 1}, {label: '其它', value: 2}],
            netStatusOptions: [
                {
                    label: '在线',
                    value: 1,
                },
                {
                    label: '不在线',
                    value: 2,
                },
            ],
            deviceStatusOptions: [
                {
                    label: '启用',
                    value: 1,
                },
                {
                    label: '禁用',
                    value: 2,
                },
            ],
            livenessEnableOptions: [
                {
                    label: '启用',
                    value: 1,
                },
                {
                    label: '禁用',
                    value: 0,
                },
            ],
            pageTitle: '新增',
            dialogVisible: false,
            dataForm: {
                name: '',
                type: 1,
                ip: '',
                version: '',
                netStatus: 1,
                status: 1,
                livenessEnable: 1,
                threshold: 75,
                brightness: 80,
                voice: 80,
            },
        };
    },
    methods: {
        init() {
            this.dialogVisible = true;
            this.dataForm = {
                name: '',
                type: 1,
                ip: '',
                version: '',
                netStatus: 1,
                status: 1,
                livenessEnable: 1,
                threshold: 75,
                brightness: 80,
                voice: 80,
            };
        },
        submmit() {
            let that = this;
            let method = null;
            if (that.dataForm.deviceId) {
                method = 'PUT';
            } else {
                method = 'POST';
            }
            this.$http({
                url: this.$http.adornUrl4('/v1/face/devices'),
                method: method,
                data: this.$http.adornData(that.dataForm),
            }).then(data => {
                if (data && data.data.code === 201) {
                    that.$refs['dataForm'].resetFields();
                    that.dialogVisible = false;
                }
            });
        },
        selectById(deviceId) {
            let that = this;
            this.dialogVisible = true;
            this.$http({
                url: this.$http.adornUrl4('/v1/face/devices/' + deviceId),
                method: 'GET',
            }).then(data => {
                if (data && data.data.code === 200) {
                    let device = data.data.data;
                    that.dataForm = device;
                    that.pageTitle = '修改';
                }
            });
        },
    },
};
</script>

<style scoped></style>
