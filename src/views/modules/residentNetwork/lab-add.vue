<template>
    <el-dialog :visible.sync="visable" title="新增机房">
        <!-- 新增机房的弹窗 -->
        <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" label-width="90px" size="small">
            <el-form-item prop="labName" label="机房名称:"> <el-input v-model="dataForm.labName" placeholder="机房名称" clearable></el-input> </el-form-item>
            <el-form-item prop="position" label="机房位置:"> <el-input v-model="dataForm.position" placeholder="机房位置" clearable></el-input> </el-form-item>
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
                labName: '',
                position: '',
                remark: '',
            },
            visable: false,
            dataRule: {
                labName: [{required: true, message: '必填', trigger: 'blur'}],
                position: [{required: true, message: '必填', trigger: 'blur'}],
            },
        };
    },
    methods: {
        init(id) {
            this.visable = true;
            this.$nextTick(() => {
                this.$refs.dataFormRef.resetFields();
            });
        },
        // 添加
        dataFormSubmit(userId) {
            this.$refs['dataFormRef'].validate(valid => {
                if (valid) {
                    this.$http({
                        url: this.$http.adornUrl('/v1/cpn/labs'),
                        method: 'post',
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
