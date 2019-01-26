<template>
    <div class="addmanage">
        <el-dialog :title="'新增'" :close-on-click-modal="false" @close="closeDialog" :visible.sync="visible">
            <el-form :model="dataForm" ref="dataFormRef" label-width="60px" size="small">
                <el-form-item label="标题" prop="title"> <el-input v-model="dataForm.title" placeholder="建议标题字数不超过64个字"></el-input> </el-form-item>
                <el-form-item label="封面图" class="advertImage">
                    <el-upload ref="upload" :action="''" :http-request="myUpload" list-type="picture-card" :limit="1" :before-upload="beforeAvatarUpload" :on-remove="onRemove">
                        <img v-if="image" :src="image" class="avatar" /> <i class="el-icon-plus"></i>
                    </el-upload>
                </el-form-item>
                <h5>上传1张详情封面照,格式jpg,png,尺寸:200*150(4:3),不超过80KB</h5>
                <div class="tinymce"><editor id="tiny" v-model="tinymceHtml" :init="init"></editor></div>
                <div class="upload-container">
                    <el-button icon="el-icon-upload" size="mini" @click="dialogVisible = true" type="primary">上传图片 </el-button>
                    <el-dialog append-to-body :visible.sync="dialogVisible" @close="imgClose">
                        <el-upload
                            class="editor-slide-upload"
                            :action="''"
                            :http-request="myUpload"
                            :file-list="fileList"
                            :show-file-list="true"
                            list-type="picture-card"
                            :on-remove="handleRemove"
                            :on-success="handleSuccess"
                            :before-upload="beforeUpload"
                        >
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                        <el-button class="mt10" size="small" @click="dialogVisible = false">取 消</el-button>
                        <el-button class="mt10" size="small" type="primary" @click="handleSubmit">确 定</el-button>
                    </el-dialog>
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
var co = require('co');
var OSS = require('ali-oss');
import {discoveries} from '@/assets/imgjs.js';
// import 'tinymce/skins/lightgray/skin.min.css'
// import 'tinymce/skins/lightgray/content.min.css'
import tinymce from 'tinymce/tinymce';
import 'tinymce/themes/modern/theme';
import Editor from '@tinymce/tinymce-vue';
import 'tinymce/plugins/image';
import 'tinymce/plugins/link';
import 'tinymce/plugins/code';
import 'tinymce/plugins/table';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/contextmenu';
import 'tinymce/plugins/wordcount';
import 'tinymce/plugins/colorpicker';
import 'tinymce/plugins/textcolor';
import './zh_CN.js';
export default {
    name: 'infoTinymce',
    data() {
        return {
            dataForm: {
                title: '',
            },
            visible: false,
            dialogVisible: false,
            fileList: [],
            imageUrl: [],
            image: '', //封面图
            tinymceHtml: '',
            init: {
                language: 'zh_CN',
                height: 300,
                plugins: 'link lists image code table colorpicker textcolor wordcount contextmenu',
                toolbar:
                    'bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | link unlink image code | removeformat',
                branding: false,
                theme_advanced_toolbar_align: 'left',
            },
        };
    },
    components: {Editor},
    methods: {
        aa() {
            this.visible = true;
            this.$nextTick(() => {
                this.$refs['dataFormRef'].resetFields();
            });
        },
        // 定义一个拦截不让upload自动上传（自动上传用的formData）
        myUpload(content) {
            content.onSuccess('配时文件上传成功');
        },
        onRemove() {
            this.image = '';
        },
        // 上传封面图
        beforeAvatarUpload(file) {
            const that = this;
            const isJPG = file.type === 'image/jpeg';
            const isJPG2 = file.type === 'image/png';
            const isLt80k = file.size / 1024 <= 80;
            var isComTrue = true; //是否压缩  true为需要压缩
            if (!isLt80k) {
                isComTrue = true;
            } else {
                isComTrue = false;
            }
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
                        if (isComTrue) {
                            lrz(file, {
                                width: 200,
                                quality: 0.7,
                            }).then(function(rst) {
                                co(function*() {
                                    var timeStamp = new Date().getTime();
                                    var result = yield client.put(discoveries + timeStamp, rst.file); //资讯管理封面图
                                    //console.log(result);
                                    that.image = result.url;
                                });
                            });
                        } else {
                            co(function*() {
                                var timeStamp = new Date().getTime();
                                var result = yield client.put(discoveries + timeStamp, file); //资讯管理封面图
                                //console.log(result);
                                that.image = result.url;
                            });
                        }
                    } else {
                        return false;
                    }
                });
            }
        },
        // 关闭新增的弹框
        closeDialog() {
            (this.dataForm.title = ''), (this.image = '');
            this.$refs.upload.clearFiles();
            this.fileList = [];
            this.tinymceHtml = '';
        },
        // 关闭 上传图片的弹框
        imgClose() {
            this.fileList = [];
            this.imageUrl = [];
        },
        // 富文本上传图片
        beforeUpload(file) {
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
                            var result = yield client.put(discoveries + timeStamp, file); //资讯管理内容图
                            //console.log(result);
                            that.imageUrl.push(result.url);
                        });
                    } else {
                        return false;
                    }
                });
            }
        },
        handleRemove() {},
        handleSuccess() {},
        handleSubmit() {
            // console.log(this.imageUrl)
            this.imageUrl.forEach(v => {
                tinyMCE.activeEditor.insertContent(`<img class="wscnph" src="${v}">`);
            });
            this.dialogVisible = false;
            this.imageUrl = [];
            //console.log(tinyMCE.activeEditor.getContent() )
        },
        dataFormSubmit() {
            this.$http({
                url: this.$http.adornUrl(`/v1/info/discoveries`),
                method: 'post',
                data: this.$http.adornData({
                    title: this.dataForm.title,
                    coverImg: this.image,
                    content: tinyMCE.activeEditor.getContent(),
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
        },
    },
};
</script>
<style scoped>
.upload-container {
    position: absolute;
    right: 30px;
    top: 320px;
}
.advertImage >>> .el-form-item__content {
    width: 148px !important  ;
    height: 148px !important  ;
    overflow: hidden !important;
    position: relative;
}
.addmanage h5 {
    margin-left: 60px;
    color: #aaa;
    margin-top: -12px;
    margin-bottom: 4px;
}
</style>
