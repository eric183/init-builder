<template>
    <el-dialog title="取消" :close-on-click-modal="false" :append-to-body="true" :visible.sync="dialogVisible">
        <el-form :model="resultDetail" :rules="dataRule" ref="dataFormRef" label-width="100px" size="small">
            <el-form-item label="取消原因" prop="detail"> <el-input v-model="resultDetail.detail" type="textarea"></el-input> </el-form-item>
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
            resultDetail: {
                detail: '',
            },
            ticketId: 0,
            dataRule: {
                detail: [{required: true, message: '必填', trigger: 'blur'}],
            },
        };
    },
    methods: {
        init(id) {
            this.dialogVisible = true;
            this.ticketId = id;
            this.$nextTick(() => {
                this.$refs['dataFormRef'].resetFields();
            });
        },
        subMit() {
            this.$http({
                url: this.$http.adornUrl('/v1/pm/regularization/tickets/' + this.ticketId + '/actions'),
                method: 'post',
                data: this.$http.adornData({
                    type: '10',
                    detail: this.resultDetail.detail,
                }),
            }).then(({data}) => {
                if (data.code == 201) {
                    this.dialogVisible = false;
                    this.$message({
                        message: '工单已取消',
                        type: 'success',
                    });
                    this.$emit('refreshDataList');
                }
            });
        },
    },
};
</script>
