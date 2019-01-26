<template>
    <div class="addmanage">
        <el-dialog :title="'新增'" :close-on-click-modal="false" @close="closeDialog" :visible.sync="visible">
            <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" label-width="80px" label-position="top" size="small">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="标题" prop="title"> <el-input v-model="dataForm.title" placeholder="建议标题字数不超过30个字" clearable></el-input> </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="活动时间" prop="valueTime">
                            <el-date-picker v-model="dataForm.valueTime" type="datetimerange" value-format="timestamp" range-separator="-" start-placeholder="开始" end-placeholder="结束">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="活动地点" prop="address"> <el-input v-model="dataForm.address" placeholder="建议字数不超过20个字" clearable></el-input> </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="活动类型" prop="type">
                            <el-select v-model="dataForm.type" :disabled="actId != 0">
                                <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row class="signup_box clearfix" v-if="dataForm.type == 2">
                    <el-form-item label="报名截止日期" prop="attendDeadline">
                        <el-date-picker v-model="dataForm.attendDeadline" type="datetime" placeholder="请选择日期" value-format="timestamp"> </el-date-picker>
                    </el-form-item>
                    <el-form-item label="限制报名人数" prop="isLimitNum">
                        <el-switch :width="35" v-model="dataForm.isLimitNum" active-text="是" :active-value="1" inactive-text="否" :inactive-value="0"></el-switch>
                    </el-form-item>
                    <el-form-item label="上限人数" v-if="dataForm.isLimitNum" prop="limitNum">
                        <el-input v-model="dataForm.limitNum" style="width:160px;">
                            <template slot="append"
                                >人</template
                            >
                        </el-input>
                    </el-form-item>
                    <el-form-item label="剩余展示名额" v-if="dataForm.isLimitNum" prop="remainNum">
                        <el-input v-model="dataForm.remainNum" style="width:160px;">
                            <template slot="append"
                                >人</template
                            >
                        </el-input>
                    </el-form-item>
                </el-row>
                <el-form-item label="封面图" class="advertImage" prop="image">
                    <el-upload ref="upload" :action="''" :http-request="myUpload" list-type="picture-card" :limit="1" :before-upload="beforeAvatarUpload" :on-remove="onRemove">
                        <img v-if="dataForm.image" :src="dataForm.image" class="avatar" style="width:148px;height:148px" /> <i class="el-icon-plus"></i>
                    </el-upload>
                </el-form-item>
                <h5>上传1张详情封面照,格式jpg,png,尺寸:750*460(16:9),不超过200KB</h5>
                <div class="tinymce"><editor id="tinymce" v-model="tinymceHtml" :init="init"></editor></div>
                <div class="upload-container">
                    <el-button icon="el-icon-upload" size="mini" @click="dialogVisible = true" type="primary">上传图片</el-button>
                    <el-dialog append-to-body :visible.sync="dialogVisible" @close="imgClose">
                        <el-upload
                            class="editor-slide-upload"
                            :action="''"
                            :http-request="myUpload"
                            :file-list="fileList"
                            :show-file-list="true"
                            list-type="picture-card"
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
import co from 'co';
import OSS from 'ali-oss';
import {act_infos, act_interactives} from '@/utils/resources/index.js';
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
import '@/utils/resources/zh_CN.js';
export default {
    name: 'actTinymce',
    data() {
        return {
            actId: 0,
            dataForm: {
                title: '',
                valueTime: [],
                type: '',
                image: '', //封面图
                address: '',
                isLimitNum: 0,
                attendDeadline: '',
                limitNum: '',
                remainNum: '',
            },
            visible: false,
            dialogVisible: false,
            fileList: [],
            imageUrl: [],
            typeList: [{value: 1, label: '互动型活动'}, {value: 2, label: '报名型活动'}],
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
            dataRule: {
                title: [
                    {required: true, message: '必填', trigger: 'blur'},
                    {
                        min: 1,
                        max: 30,
                        message: '长度在 1 到 30 个字符',
                        trigger: 'blur',
                    },
                ],
                valueTime: [{required: true, message: '必填', trigger: 'blur'}],
                type: [{required: true, message: '必填', trigger: 'blur'}],
                image: [{required: true, message: '必填', trigger: 'blur'}],
            },
        };
    },
    components: {Editor},
    methods: {
        aa(actId, type) {
            this.actId = actId || 0;
            this.dataForm.type = type || '';
            this.visible = true;
            this.$nextTick(() => {
                this.$refs['dataFormRef'].resetFields();
                this.dataForm.attendDeadline = '';
                this.dataForm.isLimitNum = 0;
                this.dataForm.limitNum = '';
                this.dataForm.remainNum = '';
                if (this.actId) {
                    this.$http({
                        url: this.$http.adornUrl('/v3/act/infos/' + actId + '/details'),
                        method: 'get',
                    }).then(({data}) => {
                        if (data && data.code === 200) {
                            this.dataForm.title = data.data.title;
                            this.dataForm.type = data.data.type;
                            this.dataForm.address = data.data.address;
                            this.dataForm.isLimitNum = data.data.isLimitNum;
                            this.dataForm.attendDeadline = data.data.attendDeadline;
                            this.dataForm.limitNum = data.data.limitNum;
                            this.dataForm.remainNum = data.data.remainNum;
                            this.dataForm.valueTime = [data.data.startTime, data.data.endTime];
                            this.dataForm.type = type;
                            this.dataForm.image = data.data.coverImg;
                            tinyMCE.activeEditor.setContent(data.data.content);
                            // tinyMCE.activeEditor.insertContent(data.data.content)
                        }
                    });
                } else {
                    tinyMCE.activeEditor.setContent('');
                }
            });
        },
        // 定义一个拦截不让upload自动上传（自动上传用的formData）
        myUpload(content) {
            content.onSuccess('配时文件上传成功');
        },
        onRemove() {
            this.dataForm.image = '';
        },
        // 上传封面图
        beforeAvatarUpload(file) {
            const that = this;
            const isJPG = file.type === 'image/jpeg';
            const isJPG2 = file.type === 'image/png';
            const isLt80k = file.size / 1024 <= 200;
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
                                width: 750,
                                quality: 0.7,
                            }).then(function(rst) {
                                co(function*() {
                                    var timeStamp = new Date().getTime();
                                    var result = yield client.put(act_infos + timeStamp, rst.file); //资讯管理封面图
                                    //console.log(result);
                                    that.dataForm.image = result.url;
                                });
                            });
                        } else {
                            co(function*() {
                                var timeStamp = new Date().getTime();
                                var result = yield client.put(act_infos + timeStamp, file); //资讯管理封面图
                                //console.log(result);
                                that.dataForm.image = result.url;
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
            (this.dataForm.title = ''), (this.dataForm.image = '');
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
                            var result = yield client.put(act_interactives + timeStamp, file); //活动管理内容图
                            //console.log(result);
                            that.imageUrl.push(result.url);
                        });
                    } else {
                        return false;
                    }
                });
            }
        },
        handleSubmit() {
            this.imageUrl.forEach(v => {
                tinyMCE.activeEditor.insertContent(`<img class="wscnph" src="${v}">`);
            });
            this.dialogVisible = false;
            this.imageUrl = [];
        },
        dataFormSubmit() {
            if (!this.dataForm.image) {
                this.$message.error('请上传图片');
            }
            if (!tinyMCE.activeEditor.getContent()) {
                this.$message.error('请填写内容');
            }
            this.$refs['dataFormRef'].validate(valid => {
                if (valid) {
                    this.$http({
                        url: this.actId ? this.$http.adornUrl(`/v1/act/infos`) : this.$http.adornUrl(`/v3/act/infos`),
                        method: this.actId ? 'put' : 'post',
                        data: this.$http.adornData({
                            actId: this.actId || undefined,
                            title: this.dataForm.title,
                            coverImg: this.dataForm.image,
                            startTime: this.dataForm.valueTime[0],
                            endTime: this.dataForm.valueTime[1],
                            type: this.dataForm.type,
                            content: tinyMCE.activeEditor.getContent(),
                            address: this.dataForm.address,
                            isLimitNum: this.dataForm.isLimitNum,
                            attendDeadline: this.dataForm.attendDeadline,
                            limitNum: this.dataForm.limitNum,
                            remainNum: this.dataForm.remainNum,
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
.upload-container {
    position: absolute;
    right: 30px;
    top: 481px;
}
.advertImage >>> .el-form-item__content {
    width: 148px !important  ;
    height: 148px !important  ;
    overflow: hidden !important;
    position: relative;
}
.addmanage h5 {
    color: #aaa;
    margin-top: -10px;
    margin-bottom: 4px;
}
.el-form-item {
    margin-bottom: 8px;
}
.el-form-item >>> .el-form-item__label {
    padding-bottom: 0;
}
.addmanage >>> .el-dialog__body {
    padding-top: 0;
}
.signup_box .el-form-item {
    float: left;
    margin-right: 10px;
}
</style>
