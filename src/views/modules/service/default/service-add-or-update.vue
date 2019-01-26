<template>
    <div class="addmanage">
        <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" @close="closeDialog" :append-to-body="true" :visible.sync="visible">
            <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter.native="dataFormSubmit()" label-width="100px" size="small">
                <el-form-item label="名称" prop="title"> <el-input v-model="dataForm.title" placeholder="名称"></el-input> </el-form-item>
                <el-form-item label="跳转类型" prop="jumpType">
                    <el-select v-model="dataForm.jumpType" @change="jumpTypeChange(dataForm.jumpType)">
                        <el-option v-for="item in jumpTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="linkTitle" v-if="linkState"> <el-input v-model="dataForm.jumpUrl" placeholder="请输入链接(注：带上http或https)"></el-input> </el-form-item>
                <el-form-item label="商品id" v-if="goodsState" prop="jumpId"> <el-input v-model="dataForm.jumpId"></el-input> </el-form-item>
                <el-form-item label="店铺ID" v-if="shopState" prop="jumpId"> <el-input v-model="dataForm.jumpId"></el-input> </el-form-item>
                <el-form-item label="描述" prop="description"> <el-input type="textarea" :autosize="true" v-model="dataForm.description" placeholder="请输入描述50字以内"></el-input> </el-form-item>
                <div class="imgBox">
                    <el-form-item label="图片" class="advertImage" prop="coverImg">
                        <el-upload
                            ref="upload"
                            :action="''"
                            :http-request="myUpload"
                            list-type="picture-card"
                            :limit="1"
                            :before-upload="beforeAvatarUpload"
                            :on-remove="onRemove"
                            :on-success="onSuccess"
                        >
                            <img v-if="dataForm.coverImg" :src="dataForm.coverImg" class="avatar" /> <i class="el-icon-plus"></i>
                        </el-upload>
                    </el-form-item>
                    <span class="isShowImg" v-show="isShowImg">图片不能为空</span>
                    <h5>上传1张详情封面照,格式png, jpg,尺寸:240*180(4:3),不超过20KB</h5>
                </div>
                <el-form-item label="是否上线" prop="status">
                    <el-switch :width="35" v-model="dataForm.status" active-text="是" :active-value="2" inactive-text="否" :inactive-value="1"> </el-switch>
                </el-form-item>
                <div class="box">
                    <el-form-item label="上线时间" prop="onlineTime">
                        <el-date-picker v-model="dataForm.onlineTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期"> </el-date-picker>
                    </el-form-item>
                    <el-form-item label="下线时间" prop="offlineTime">
                        <el-date-picker v-model="dataForm.offlineTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期"> </el-date-picker>
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
import {commonFunc,advertisements} from '@/utils/resources/index.js';
import co from 'co';
import OSS from 'ali-oss';
export default {
    data() {
        return {
            visible: false,
            dataForm: {
                id: 0,
                title: '',
                jumpType: '',
                jumpId: '',
                jumpUrl: '',
                coverImg: '',
                description: '',
                status: 1,
                onlineTime: '',
                offlineTime: '',
            },
            linkState: false,
            linkTitle: '链接',
            goodsState: false,
            shopState: false,
            isShowImg: false,
            jumpTypeList: [{value: 1, label: 'H5'}, {value: 2, label: '美食店铺页'}, {value: 3, label: '美食详情页'}, {value: 4, label: '商城店铺页'}, {value: 5, label: '商城详情页'}],
            dataRule: {
                title: [{required: true, message: '名称不能为空', trigger: 'blur'}, {min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur'}],
                jumpType: [{required: true, message: '类型不能为空', trigger: 'blur'}],
                jumpId: [{required: true, message: 'id不能为空', trigger: 'blur'}],
                coverImg: [{required: true, message: '图片不能为空', trigger: 'blur'}],
                onlineTime: [{required: true, message: '上线时间不能为空', trigger: 'blur'}],
                offlineTime: [{required: true, message: '下线时间不能为空', trigger: 'blur'}],
                description: [{min: 2, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'}],
                status: [{required: true, message: '是否上线不能为空', trigger: 'blur'}],
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
            const isLt20k = file.size / 1024 <= 20;
            var isComTrue = true; //是否压缩  true为需要压缩
            if (!isLt20k) {
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
                                width: 240,
                                quality: 0.7,
                            }).then(function(rst) {
                                co(function*() {
                                    var timeStamp = new Date().getTime();
                                    var result = yield client.put(advertisements + timeStamp, rst.file); //新增商品-上传的图片
                                    //console.log(result);
                                    that.dataForm.coverImg = result.url;
                                    if (that.dataForm.coverImg) {
                                        that.isShowImg = false;
                                    } else {
                                        that.isShowImg = true;
                                    }
                                });
                            });
                        } else {
                            co(function*() {
                                var timeStamp = new Date().getTime();
                                var result = yield client.put(advertisements + timeStamp, file); //新增商品-上传的图片
                                //console.log(result);
                                that.dataForm.coverImg = result.url;
                                if (that.dataForm.coverImg) {
                                    that.isShowImg = false;
                                } else {
                                    that.isShowImg = true;
                                }
                            });
                        }
                    } else {
                        return false;
                    }
                });
            }
        },
        onRemove() {
            this.dataForm.coverImg = '';
        },
        jumpTypeChange(val) {
            if (val == 1) {
                this.linkState = true;
                this.linkTitle = '链接';
            } else {
                this.linkState = false;
            }
            if (val == 3 || val == 5) {
                this.goodsState = true;
            } else {
                this.goodsState = false;
            }
            if (val == 2 || val == 4) {
                this.shopState = true;
            } else {
                this.shopState = false;
            }
        },
        closeDialog() {
            (this.dataForm = {
                id: 0,
                title: '',
                jumpId: '',
                jumpType: '',
                jumpUrl: '',
                coverImg: '',
                status: 1,
                onlineTime: '',
                offlineTime: '',
            }),
                this.$refs.dataFormRef.resetFields();
            this.$refs.upload.clearFiles();
        },
        onSuccess() {
            //console.log(this.dataForm.coverImg)
        },
        init(id) {
            this.dataForm.id = id || 0;
            this.visible = true;
            this.$nextTick(() => {
                this.$refs['dataFormRef'].resetFields();
                if (this.dataForm.id) {
                    this.$http({
                        //url: this.$http.adornUrl(`/v1/advertisement/${this.dataForm.id}`),
                        url: this.$http.adornUrl(`/v1/union/services/` + this.dataForm.id),
                        method: 'get',
                    }).then(({data}) => {
                        if (data && data.code === 200) {
                            this.dataForm.title = data.data.title;
                            this.dataForm.jumpType = data.data.jumpType;
                            this.dataForm.jumpId = data.data.jumpId;
                            this.dataForm.coverImg = data.data.coverImg;
                            this.dataForm.jumpUrl = data.data.jumpUrl;
                            this.dataForm.onlineTime = commonFunc(data.data.onlineTime);
                            this.dataForm.offlineTime = commonFunc(data.data.offlineTime);
                            this.dataForm.status = data.data.status;
                            this.dataForm.description = data.data.description;
                            if (data.data.jumpType == 1) {
                                this.linkState = true;
                                this.linkTitle = '链接';
                            } else {
                                this.linkState = false;
                            }
                            if (data.data.jumpType == 3 || data.data.jumpType == 5) {
                                this.goodsState = true;
                            } else {
                                this.goodsState = false;
                            }
                            if (data.data.jumpType == 2 || data.data.jumpType == 4) {
                                this.shopState = true;
                            } else {
                                this.shopState = false;
                            }
                        }
                    });
                }
            });
        },
        // 表单提交
        dataFormSubmit() {
            this.$refs['dataFormRef'].validate(valid => {
                if (this.dataForm.onlineTime && this.dataForm.onlineTime >= this.dataForm.offlineTime) {
                    this.$message.error('上线时间不能大于下线时间');
                    return false;
                }
                if (!this.dataForm.coverImg) {
                    this.isShowImg = true;
                    return false;
                }
                if (valid) {
                    this.$http({
                        //url: this.$http.adornUrl3(`/v1/advertisement`),
                        url: this.$http.adornUrl(this.dataForm.id == 0 ? `/v1/union/services` : `/v1/union/services/` + this.dataForm.id),
                        method: this.dataForm.id == 0 ? 'post' : 'put',
                        data: this.$http.adornData({
                            title: this.dataForm.title,
                            jumpType: this.dataForm.jumpType,
                            jumpId: this.dataForm.jumpId,
                            coverImg: this.dataForm.coverImg,
                            jumpUrl: this.dataForm.jumpUrl,
                            onlineTime: this.dataForm.onlineTime,
                            offlineTime: this.dataForm.offlineTime,
                            status: this.dataForm.status,
                            description: this.dataForm.description,
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
