<template>
    <el-dialog title="问题澄清" :close-on-click-modal="false" :visible.sync="visible">
        <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter.native="dataFormSubmit()" label-width="100px" size="small">
            <el-form-item label="澄清描述：" prop="content">
                <el-input type="textarea" :rows="3" :maxlength="300" v-model="dataForm.content" placeholder="澄清描述限制300字以内" clearable></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer"> <el-button size="small" type="primary" @click="dataFormSubmit()">确定</el-button> </span>
    </el-dialog>
</template>
<script>
export default {
    data() {
        return {
            dataForm: {
                content: '',
            },
            id: null, //服务的id
            visible: false,
            dataRule: {
                content: [{required: true, message: '内容不能为空', trigger: 'blur'}],
            },
        };
    },
    methods: {
        init(id) {
            this.id = id;
            this.visible = true;
            this.$nextTick(() => {
                this.$refs['dataFormRef'].resetFields();
            });
        },
        dataFormSubmit() {
            this.$refs['dataFormRef'].validate(valid => {
                if (valid) {
                    this.$http({
                        url: this.$http.adornUrl('/v1/prop/services/' + this.id + '/clarify'),
                        method: 'post',
                        data: this.$http.adornData({
                            content: this.dataForm.content,
                        }),
                    }).then(({data}) => {
                        if (data && data.code === 201) {
                            this.visible = false;
                            this.$message({
                                message: '操作成功',
                                type: 'success',
                                duration: 1000,
                                onClose: () => {
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
