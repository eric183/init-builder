<template>
    <el-dialog :visible.sync="visable" title="编辑光缆段">
        <!-- 编辑光缆段的弹窗 -->
        <el-form :model="dataForm" ref="dataFormRef" label-width="100px" size="small">
            <el-form-item prop="segmentName" label="光缆段名称:"> <el-input v-model="dataForm.segmentName" disabled></el-input> </el-form-item>
            <el-form-item prop="startInstallation" label="起始设施:"> <el-input v-model="dataForm.startInstallation" disabled></el-input> </el-form-item>
            <el-form-item prop="endInstallation" label="终止设施:"> <el-input v-model="dataForm.endInstallation" disabled></el-input> </el-form-item>
            <el-form-item prop="coreLineNum" label="光缆段芯数:"> <el-input v-model="dataForm.coreLineNum" disabled></el-input> </el-form-item>
            <el-form-item prop="remark" label="备注:"> <el-input type="textarea" v-model="dataForm.remark" placeholder="备注" clearable></el-input> </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="visable = false">取消</el-button>
            <el-button size="small" type="primary" @click="dataFormSubmit()">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    data() {
        return {
            dataForm: {
                segmentName: '',
                startInstallation: '',
                endInstallation: '',
                coreLineNum: '',
                remark: '',
            },
            segmentId: 0,
            visable: false,
        };
    },
    methods: {
        init(obj) {
            this.segmentId = obj.segmentId;
            this.visable = true;
            this.dataForm.segmentName = obj.segmentName;
            this.dataForm.startInstallation = obj.startInstallation;
            this.dataForm.endInstallation = obj.endInstallation;
            this.dataForm.coreLineNum = obj.coreLineNum;
            this.dataForm.remark = obj.remark;
        },
        // 编辑
        dataFormSubmit() {
            this.$refs['dataFormRef'].validate(valid => {
                if (valid) {
                    this.$http({
                        url: this.$http.adornUrl('/v1/cpn/cables/segments/' + this.segmentId),
                        method: 'put',
                        data: this.$http.adornData(this.dataForm),
                    }).then(({data}) => {
                        if (data && data.code === 201) {
                            this.visable = false;
                            this.$emit('refreshDataList');
                            this.$message.success('新增成功');
                        }
                    });
                }
            });
        },
    },
};
</script>
