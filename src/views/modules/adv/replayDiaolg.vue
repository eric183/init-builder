<template>
    <el-dialog title="回复" :close-on-click-modal="false" append-to-body :visible.sync="visible">
        <el-form :model="replayForm" :rules="replayRule" ref="replayRef" @keyup.enter.native="replayConfir()" label-width="50px" size="small">
            <el-form-item label="回复" prop="content"> <el-input type="textarea" v-model="replayForm.content"></el-input> </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="visible = false">取消</el-button>
            <el-button size="small" type="primary" @click="replayConfir()">确定</el-button>
        </span>
    </el-dialog>
</template>
<script>
export default {
    data() {
        return {
            visible: false,
            replayForm: {
                content: '',
                id: null,
            },
            replayRule: {},
        };
    },
    methods: {
        init(id) {
            (this.visible = true),
                (this.id = id),
                this.$nextTick(() => {
                    this.$refs.replayRef.resetFields();
                });
        },
        replayConfir() {
            this.$refs['replayRef'].validate(valid => {
                if (valid) {
                    this.$http({
                        url: this.$http.adornUrl(`/v1/act/interactive/` + this.id + `/reply`),
                        method: 'post',
                        data: this.$http.adornData({
                            content: this.replayForm.content,
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
