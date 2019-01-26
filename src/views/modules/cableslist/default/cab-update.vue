<template>
    <el-dialog :visible.sync="visable" title="编辑光缆">
        <!-- 编辑光缆的弹窗 -->
        <el-form :model="dataForm" ref="dataFormRef" label-width="100px" size="small">
            <el-form-item prop="cableName" label="光缆名称:"> <el-input v-model="dataForm.cableName" disabled></el-input> </el-form-item>
            <el-form-item prop="labName" label="所属机房:"> <el-input v-model="dataForm.labName" disabled></el-input> </el-form-item>
            <el-form-item prop="projectName" label="所属工程:"> <el-input v-model="dataForm.projectName" disabled></el-input> </el-form-item>
            <el-form-item prop="coreLineNum" label="光缆芯数:"> <el-input v-model="dataForm.coreLineNum" disabled></el-input> </el-form-item>
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
                cableName: '',
                labName: '',
                projectName: '',
                coreLineNum: '',
                remark: '',
            },
            cableId: 0,
            visable: false,
        };
    },
    methods: {
        init(obj) {
            this.visable = true;
            this.cableId = obj.cableId;
            this.dataForm.cableName = obj.cableName;
            this.dataForm.labName = obj.labName;
            this.dataForm.projectName = obj.projectName;
            this.dataForm.coreLineNum = obj.coreLineNum;
            this.dataForm.remark = obj.remark;
        },
        // 添加
        dataFormSubmit() {
            this.$refs['dataFormRef'].validate(valid => {
                if (valid) {
                    this.$http({
                        url: this.$http.adornUrl('/v1/cpn/cables/' + this.cableId),
                        method: 'put',
                        data: this.$http.adornData(this.dataForm),
                    }).then(({data}) => {
                        if (data && data.code === 201) {
                            this.visable = false;
                            this.$emit('refreshDataList');
                            this.$message.success('编辑成功');
                        }
                    });
                }
            });
        },
    },
};
</script>
