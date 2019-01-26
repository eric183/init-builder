<template>
    <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px" size="small">
            <div class="elformDiv">
                <el-form-item label="所在楼栋" prop="buildingId">
                    <el-select placeholder="请选择楼栋" v-model="dataForm.buildingId" @change="buildChange">
                        <el-option v-for="item in buildlist" :key="item.buildingId" :label="item.name" :value="item.buildingId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所在楼层" prop="floorId">
                    <el-select placeholder="请选择楼层" v-model="dataForm.floorId">
                        <el-option v-for="item in floorlist" :key="item.floorId" :label="item.name" :value="item.floorId"></el-option>
                    </el-select>
                </el-form-item>
            </div>
            <div class="elformDiv">
                <el-form-item label="设备类型">
                    <el-select v-model="dataForm.type" placeholder="请选择类型">
                        <el-option v-for="item in deviceTypelist" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="设备状态:">
                    <el-select v-model="dataForm.status" placeholder="请选择状态">
                        <el-option v-for="item in statusTypelist" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </div>
            <el-form-item label="设备渠道" class="width100">
                <el-select v-model="dataForm.channel" placeholder="请选择渠道">
                    <el-option v-for="item in channellist" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="设备名称" prop="name"> <el-input v-model="dataForm.name" placeholder="设备名称"></el-input> </el-form-item>
            <el-form-item label="设备序列号" prop="deviceSn"> <el-input v-model="dataForm.deviceSn" placeholder="设备序列号"></el-input> </el-form-item>
            <el-form-item label="设备版本号" prop="version"> <el-input v-model="dataForm.version" placeholder="设备版本号"></el-input> </el-form-item>
            <el-form-item label="设备放置地址" prop="address"> <el-input v-model="dataForm.address" placeholder="设备放置地址"></el-input> </el-form-item>
            <el-form-item label="设备说明" prop="remark"> <el-input type="textarea" :autosize="true" v-model="dataForm.remark" placeholder="设备说明"></el-input> </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="visible = false">取消</el-button>
            <el-button size="small" type="primary" @click="dataFormSubmit()">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    data() {
        return {
            foorlist: [],
            visible: false,
            buildingId: 0,
            buildlist: [],
            floorlist: [],
            roleList: [],
            dataForm: {
                id: 0,
                buildingId: '',
                floorId: '',
                deviceType: '',
                deviceName: '',
                deviceSn: '',
                version: '',
                address: '',
                introduce: '',
                type: '',
                status: '',
            },
            // 设备类型
            deviceTypelist: [{value: 1, label: '二维码设备'}, {value: 2, label: '人脸识别设备'}],
            // 设备状态
            statusTypelist: [{value: 1, label: '停用'}, {value: 2, label: '启用'}, {value: 3, label: '故障'}],
            // 渠道
            channellist: [{value: 1, label: '道闸'}, {value: 2, label: '普通电梯'}, {value: 3, label: 'VIP电梯'}, {value: 4, label: '私有办公室'}],
            dataRule: {
                buildingId: [{required: true, message: '请选择楼栋', trigger: 'blur'}],
                floorId: [{required: true, message: '请选择楼栋', trigger: 'blur'}],
                name: [{required: true, message: '请填写设备名称', trigger: 'blur'}],
                deviceSn: [{required: true, message: '请填写设备序列号', trigger: 'blur'}],
            },
        };
    },
    methods: {
        getFloorList() {
            this.$http({
                url: this.$http.adornUrl('/v1/building/floors'),
                method: 'get',
                params: this.$http.adornParams({
                    buildingId: this.dataForm.buildingId,
                    pageNum: 1,
                    pageSize: 9999,
                }),
            }).then(({data}) => {
                this.floorlist = data && data.code === 200 ? data.data.list : [];
            });
        },
        // 改变楼栋
        buildChange() {
            this.getFloorList();
        },
        init(id) {
            this.dataForm.id = id || 0;
            this.$http({
                url: this.$http.adornUrl('/v1/building/buildings'),
                method: 'get',
                params: this.$http.adornParams({
                    pageNum: 1,
                    pageSize: 9999,
                }),
            })
                .then(({data}) => {
                    this.buildlist = data && data.code === 200 ? data.data.list : [];
                })
                .then(() => {
                    this.visible = true;
                    this.$nextTick(() => {
                        this.$refs['dataForm'].resetFields();
                    });
                })
                .then(() => {
                    if (this.dataForm.id) {
                        this.$http({
                            url: this.$http.adornUrl(`/v1/access/devices/${this.dataForm.id}`),
                            method: 'get',
                            params: this.$http.adornParams(),
                        }).then(({data}) => {
                            if (data && data.code === 200) {
                                this.dataForm.buildingId = data.data.buildingId;
                                this.dataForm.name = data.data.name;
                                this.dataForm.deviceSn = data.data.deviceSn;
                                this.dataForm.version = data.data.version;
                                this.dataForm.address = data.data.address;
                                this.dataForm.remark = data.data.remark;
                                this.dataForm.floorId = data.data.floorId;
                                this.dataForm.channel = data.data.channel;
                                this.dataForm.type = data.data.type;
                                this.dataForm.status = data.data.status;
                                this.getFloorList();
                            }
                        });
                    }
                });
        },
        // 表单提交
        dataFormSubmit() {
            this.$refs['dataForm'].validate(valid => {
                if (valid) {
                    this.$http({
                        url: this.$http.adornUrl(`/v1/access/devices`),
                        method: this.dataForm.id == 0 ? 'post' : 'put',
                        data: this.$http.adornData({
                            deviceId: this.dataForm.id || undefined,
                            buildingId: this.dataForm.buildingId,
                            floorId: this.dataForm.floorId,
                            name: this.dataForm.name,
                            deviceSn: this.dataForm.deviceSn,
                            version: this.dataForm.version,
                            address: this.dataForm.address,
                            remark: this.dataForm.remark,
                            status: this.dataForm.status,
                        }),
                    }).then(({data}) => {
                        if (data && data.code === 201) {
                            this.$message({
                                message: '操作成功',
                                type: 'success',
                                duration: 1500,
                                onClose: () => {
                                    this.visible = false;
                                    this.$emit('refreshDataList');
                                },
                            });
                        }
                    });
                }
            });
        },
    },
};
</script>
<style lang="scss" scoped>
.elformDiv {
    display: flex;
}
.elformDiv  .el-form-item {
    width: 50%;
}
.width100 .el-select {
    width: 100%;
}
</style>
