<template>
    <div class="addmanage">
        <el-dialog title="新增" :close-on-click-modal="false" @close="closeDialog" :append-to-body="true" :visible.sync="visible">
            <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter.native="dataFormSubmit()" label-width="100px" size="small">
                <el-form-item label="标题" prop="title"> <el-input v-model="dataForm.title" placeholder="标题"></el-input> </el-form-item>
                <el-form-item label="广告位置" prop="type">
                    <el-select v-model="dataForm.type" @change="typeChange(dataForm.type)">
                        <el-option v-for="item in advTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <div class="imgBox">
                    <el-form-item label="图片" class="advertImage">
                        <el-upload
                            ref="upload"
                            :action="''"
                            :http-request="myUpload"
                            list-type="picture-card"
                            :limit="1"
                            :file-list="fileList"
                            :before-upload="beforeAvatarUpload"
                            :on-remove="onRemove"
                            :on-success="onSuccess"
                        >
                            <img v-if="dataForm.imageUrl" :src="dataForm.imageUrl" class="avatar" /> <i class="el-icon-plus"></i>
                        </el-upload>
                    </el-form-item>
                    <span class="tip">*</span>
                    <h5 v-if="imgState">请上传1张图片,格式png, jpg,尺寸:1080*540,大小不超过2M</h5>
                    <h5 v-if="!imgState">请上传1张图片,格式png, jpg,尺寸:1080*1760,大小不超过2M</h5>
                </div>
                <el-form-item label="是否上线"> <el-switch :width="35" v-model="dataForm.status" active-text="是" :active-value="2" inactive-text="否" :inactive-value="1"> </el-switch> </el-form-item>
                <div class="box">
                    <el-form-item label="上线时间" prop="startAt">
                        <el-date-picker v-model="dataForm.startAt" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期"> </el-date-picker>
                    </el-form-item>
                    <el-form-item label="下线时间" prop="endAt">
                        <el-date-picker v-model="dataForm.endAt" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期"> </el-date-picker>
                    </el-form-item>
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
import commonFunc from '@/assets/common.js';
import {visitor} from '@/assets/imgjs.js';
var co = require('co');
var OSS = require('ali-oss');
export default {
    data() {
        return {
            visible: false,
            dataForm: {
                id: 0,
                title: '',
                type: '',
                imageUrl: '',
                status: 1,
                startAt: '',
                endAt: '',
            },
            fileList: [],
            imgList: [], //修改进来查询放图片的数组
            fileImgList: [], //上传的图片的数组
            imgState: false,
            advTypeList: [{value: 1, label: '轮播图'}, {value: 2, label: '全屏广告'}],
            jumpTypeList: [{value: 1, label: 'H5'}, {value: 2, label: '不跳转'}],
            dataRule: {
                title: [{required: true, message: '名称不能为空', trigger: 'blur'}, {min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur'}],
                type: [{required: true, message: '广告类型不能为空', trigger: 'blur'}],
                startAt: [{required: true, message: '上线时间不能为空', trigger: 'blur'}],
                endAt: [{required: true, message: '下线时间不能为空', trigger: 'blur'}],
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
            const isLt2M = file.size / 1024 / 1024 <= 2;
            if (!isLt2M) {
                this.$message.error('图片大小请不要超过2M');
                return false;
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
                        co(function*() {
                            var timeStamp = new Date().getTime();
                            var result = yield client.put(visitor + timeStamp, file); //新增商品-上传的图片
                            //console.log(result);
                            that.dataForm.imageUrl = result.url;
                        });
                    } else {
                        return false;
                    }
                });
            }
        },
        onRemove(file) {
            this.dataForm.imageUrl = '';
        },
        // 改变广告状态 改变下面的提示描述
        typeChange(val) {
            if (val == 1) {
                this.imgState = true;
            } else {
                this.imgState = false;
            }
        },
        closeDialog() {
            (this.dataForm = {
                id: 0,
                title: '',
                type: '',
                imageUrl: '',
                status: 1,
                startAt: '',
                endAt: '',
            }),
                this.$refs.dataFormRef.resetFields();
            this.$refs.upload.clearFiles();
        },
        onSuccess() {
            //console.log(this.dataForm.imageUrl)
        },
        init() {
            const that = this;
            this.visible = true;
            this.$nextTick(() => {
                this.$refs['dataFormRef'].resetFields();
            });
        },
        // 表单提交
        dataFormSubmit() {
            this.$refs['dataFormRef'].validate(valid => {
                if (this.dataForm.startAt && this.dataForm.startAt >= this.dataForm.endAt) {
                    this.$message.error('上线时间不能大于下线时间');
                    return false;
                }
                if (!this.dataForm.imageUrl) {
                    this.$message.error('请上传广告图片');
                    return false;
                }
                if (valid) {
                    this.$http({
                        url: this.$http.adornUrl(`/v1/visitor/advertisements`),
                        method: 'post',
                        data: this.$http.adornData({
                            id: this.dataForm.id || undefined,
                            title: this.dataForm.title,
                            type: this.dataForm.type,
                            imageUrl: this.dataForm.imageUrl,
                            startAt: this.dataForm.startAt,
                            endAt: this.dataForm.endAt,
                            status: this.dataForm.status,
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
h5 {
    margin-left: 100px;
    color: #aaa;
    margin-top: -10px;
    margin-bottom: 0;
}
.imgBox {
    position: relative;
}
.tip {
    color: #f56c6c;
    position: absolute;
    left: 46px;
    top: 8px;
}
.advertImage >>> .el-form-item__content {
    width: 148px !important  ;
    height: 148px !important  ;
    overflow: hidden !important;
    position: relative;
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
