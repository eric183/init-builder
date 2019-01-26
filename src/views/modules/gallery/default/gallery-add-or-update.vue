<template>
    <div class="addmanage">
        <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" @close="closeDialog" :append-to-body="true" :visible.sync="visible">
            <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter.native="dataFormSubmit()" label-width="100px" size="small">
                <el-form-item label="相册标题" prop="title"> <el-input v-model="dataForm.title" placeholder="相册标题"></el-input> </el-form-item>
                <div class="imgBox">
                    <el-form-item label="相册封面" class="advertImage">
                        <el-upload ref="upload" :action="''" :http-request="myUpload" list-type="picture-card" :limit="1" :before-upload="beforeAvatarUpload" :on-remove="onRemove">
                            <img v-if="dataForm.coverImg" :src="dataForm.coverImg" class="avatar" /> <i class="el-icon-plus"></i>
                        </el-upload>
                    </el-form-item>
                    <h5>上传1张相册封面照,格式png, jpg,尺寸:750*420(16:9),不超过100KB</h5>
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="visible = false">取消</el-button>
                <el-button size="small" type="primary" @click="dataFormSubmit()">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {galleries} from '@/utils/resources/index.js';
import co from 'co';
import OSS from 'ali-oss';
export default {
    data() {
        return {
            visible: false,
            dataForm: {
                id: 0,
                title: '',
                coverImg: '',
            },
            dataRule: {
                title: [{required: true, message: '名称不能为空', trigger: 'blur'}, {min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur'}],
            },
        };
    },
    methods: {
        // 定义一个拦截不让upload自动上传（自动上传用的formData）
        myUpload(content) {
            content.onSuccess('配时文件上传成功');
        },
        beforeAvatarUpload(file) {
            const that = this;
            const isJPG = file.type === 'image/jpeg';
            const isJPG2 = file.type === 'image/png';
            if (!isJPG && !isJPG2) {
                this.$message.error('上传图片暂时只支持JPG,png格式');
                this.$refs.upload.clearFiles();
            } else {
                this.$http.get(that.$http.adornUrl('/v1/oss/tokens')).then(function(res) {
                    if (res.data.code == 200) {
                        //console.log(res.data.data.accessKeyId)
                        var client = new OSS({
                            accessKeyId: res.data.data.accessKeyId,
                            endpoint: res.data.data.endPoint,
                            accessKeySecret: res.data.data.accessKeySecret,
                            bucket: res.data.data.bucket,
                            region: res.data.data.region,
                            stsToken: res.data.data.securityToken,
                        });
                        co(function*() {
                            var timeStamp = new Date().getTime();
                            var result = yield client.put(galleries + timeStamp, file); //新增商品-上传的图片
                            //console.log(result);
                            that.dataForm.coverImg = result.url;
                        });
                    } else {
                        return false;
                    }
                });
            }
        },
        onRemove() {
            this.dataForm.coverImg = '';
        },
        closeDialog() {
            (this.dataForm = {
                id: 0,
                title: '',
                coverImg: '',
            }),
                this.$refs.dataFormRef.resetFields();
            this.$refs.upload.clearFiles();
        },
        init(obj) {
            const that = this;
            if (obj) {
                this.dataForm = {
                    id: obj.galleryId,
                    title: obj.title,
                    coverImg: obj.coverImg,
                };
            } else {
                this.dataForm.id = 0;
            }
            this.visible = true;
        },
        // 表单提交
        dataFormSubmit() {
            this.$refs['dataFormRef'].validate(valid => {
                if (!this.dataForm.coverImg) {
                    this.$message.error('上传图片不能为空');
                    return false;
                }
                if (valid) {
                    this.$http({
                        url: this.$http.adornUrl(this.dataForm.id == 0 ? `/v1/info/galleries` : '/v1/info/galleries/' + this.dataForm.id),
                        method: this.dataForm.id == 0 ? 'post' : 'put',
                        data: this.$http.adornData({
                            title: this.dataForm.title,
                            coverImg: this.dataForm.coverImg,
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
