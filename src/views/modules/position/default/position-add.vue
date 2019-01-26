<template>
    <el-dialog title="新增职务" :close-on-click-modal="false" :append-to-body="true" :visible.sync="dialogVisible">
        <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" label-width="100px" size="small">
            <el-form-item label="职务名称" prop="position"> <el-input v-model="dataForm.position"></el-input> </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false" size="small">取 消</el-button>
            <el-button type="primary" size="small" @click="subMit">确定</el-button>
        </div>
    </el-dialog>
</template>
<script>
export default {
    data() {
        return {
            dialogVisible: false,
            dataForm: {
                position: '',
            },
            dataRule: {
                position: [{required: true, message: '请填写职务', trigger: 'blur'}],
            },
        };
    },
    methods: {
        init() {
            this.dialogVisible = true;
        },
        subMit() {
            this.$refs['dataFormRef'].validate(valid => {
                if (valid) {
                    this.$http({
                        url: this.$http.adornUrl('/v1/user/companies/positions'),
                        method: 'post',
                        data: this.$http.adornData(this.dataForm),
                    }).then(({data}) => {
                        if (data && data.code === 201) {
                            this.$message.success('新增成功');
                            this.$emit('refreshDataList');
                            this.dialogVisible = false;
                        }
                    });
                }
            });
        },
    },
};
</script>
