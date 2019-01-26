<template>
    <div class="addmanage">
        <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" @close="closeDialog" :visible.sync="visible">
            <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter.native="dataFormSubmit()" label-width="100px" size="small">
                <el-form-item label="公共标题" prop="title"> <el-input v-model="dataForm.title" placeholder="标题字数限制不超过20个字"></el-input> </el-form-item>
                <el-form-item label="公告内容" prop="content">
                    <el-input type="textarea" :autosize="true" v-model="dataForm.content" maxlength="300" placeholder="正文字数限制不超过300个字"></el-input>
                </el-form-item>
                <el-form-item label="是否发布" prop="status">
                    <el-switch :width="35" v-model="dataForm.status" active-text="是" :active-value="2" inactive-text="否" :inactive-value="1"> </el-switch>
                </el-form-item>
                <div class="box">
                    <el-form-item label="上线时间" prop="startPublishTime">
                        <el-date-picker v-model="dataForm.startPublishTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期"> </el-date-picker>
                    </el-form-item>
                    <el-form-item label="下线时间" prop="endPublishTime">
                        <el-date-picker v-model="dataForm.endPublishTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期"> </el-date-picker>
                    </el-form-item>
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="visible = false">取消</el-button>
                <el-button size="small" type="primary" @click="dataFormSubmit()" :disabled="isclick">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import commonFunc from '@/assets/common.js';
export default {
    data() {
        return {
            visible: false,
            dataForm: {
                id: 0,
                title: '',
                content: '',
                status: 1,
                startPublishTime: '',
                endPublishTime: '',
            },

            isclick: false, //按钮默认可点击，点击确认之后不可再点击
            dataRule: {
                title: [{required: true, message: '名称不能为空', trigger: 'blur'}, {min: 1, max: 20, message: '长度不超过20个字', trigger: 'blur'}],
                status: [{required: true, message: '是否发布不能为空', trigger: 'blur'}],
                startPublishTime: [{required: true, message: '开始时间不能为空', trigger: 'blur'}],
                endPublishTime: [{required: true, message: '结束时间不能为空', trigger: 'blur'}],
                comment: [{min: 2, max: 50, message: '长度不超过300个字', trigger: 'blur'}],
            },
        };
    },
    methods: {
        closeDialog() {
            //this.$refs.dataFormRef.resetFields();
            console.log('我关闭了啊');
            this.dataForm = {
                id: 0,
                title: '',
                content: '',
                status: 1,
                startPublishTime: '',
                endPublishTime: '',
            };
        },
        init(id) {
            this.isclick = false;
            this.dataForm.id = id || 0;
            this.visible = true;
            this.$nextTick(() => {
                this.$refs['dataFormRef'].resetFields();
                if (this.dataForm.id) {
                    this.$http({
                        //url: this.$http.adornUrl(`/v1/advertisement/${this.dataForm.id}`),
                        url: this.$http.adornUrl(`/v1/notice/announcements/` + this.dataForm.id + `/details`),
                        method: 'get',
                    }).then(({data}) => {
                        if (data && data.code === 200) {
                            this.dataForm.title = data.data.title;
                            this.dataForm.content = data.data.content;
                            this.dataForm.status = data.data.status;
                            this.dataForm.startPublishTime = commonFunc.commonFunc(data.data.startPublishTime);
                            this.dataForm.endPublishTime = commonFunc.commonFunc(data.data.endPublishTime);
                        }
                    });
                }
            });
        },
        // 表单提交
        dataFormSubmit() {
            this.$refs['dataFormRef'].validate(valid => {
                if (this.dataForm.startPublishTime && this.dataForm.startPublishTime >= this.dataForm.endPublishTime) {
                    this.$message.error('上线时间不能大于下线时间');
                    return false;
                }
                if (valid) {
                    this.$http({
                        //url: this.$http.adornUrl3(`/v1/advertisement`),
                        url: this.$http.adornUrl(this.dataForm.id == 0 ? `/v1/notice/announcements` : `/v1/notice/announcements/` + this.dataForm.id),
                        method: this.dataForm.id == 0 ? 'post' : 'put',
                        data: this.$http.adornData({
                            title: this.dataForm.title,
                            content: this.dataForm.content,
                            status: this.dataForm.status,
                            startPublishTime: this.dataForm.startPublishTime,
                            endPublishTime: this.dataForm.endPublishTime,
                        }),
                    }).then(({data}) => {
                        if (data && data.code === 201) {
                            this.isclick = true;
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
<style scoped>
.advertImage >>> .el-form-item__content {
    width: 148px !important  ;
    height: 148px !important  ;
    overflow: hidden !important;
    position: relative;
}
.avatar {
    width: 148px;
    height: 148px;
}
h5 {
    margin-left: 100px;
    color: #aaa;
}
.imgBox {
    position: relative;
}
.isShowImg {
    position: absolute;
    left: 100px;
    top: 148px;
    color: #f56c6c;
}
.addmanage >>> .el-switch__label span {
    font-size: 12px !important;
    color: #999999;
}
.addmanage >>> .el-switch span.is-active span {
    color: #3e8ef7;
}
.box {
    display: flex;
    flex-wrap: wrap;
}
</style>
