<template>
    <div class="addmanage">
        <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :append-to-body="true" @close="closeDialog" :visible.sync="visible">
            <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter.native="dataFormSubmit()" label-width="80px" size="small">
                <el-form-item label="名称" prop="title"> <el-input v-model="dataForm.title" placeholder="名称"></el-input> </el-form-item>
                <el-form-item label="跳转类型" prop="position">
                    <el-select v-model="dataForm.position"> <el-option v-for="item in positionList" :key="item.value" :label="item.label" :value="item.value"></el-option> </el-select>
                </el-form-item>
                <el-form-item v-if="dataForm.position == 1" label="链接" prop="infoUrl"> <el-input v-model="dataForm.infoUrl" placeholder="请输入链接(注：带上http或https)"></el-input> </el-form-item>
                <el-form-item v-if="dataForm.position == 2" label="商品详情" prop="goodsId"> <el-input v-model="dataForm.goodsId" placeholder="商品编码"></el-input> </el-form-item>
                <el-form-item v-if="dataForm.position == 3" label="专题列表" prop="subjecId"> <el-input v-model="dataForm.subjecId" placeholder="专题id"></el-input> </el-form-item>
                <el-form-item label="描述" prop="comment"> <el-input type="textarea" :autosize="true" v-model="dataForm.comment" placeholder="请输入描述50字以内"></el-input> </el-form-item>
                <div class="imgBox">
                    <el-form-item label="图片" class="advertImage" prop="imageUrl">
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
                            <img v-if="dataForm.imageUrl" :src="dataForm.imageUrl" class="avatar" /> <i class="el-icon-plus"></i>
                        </el-upload>
                    </el-form-item>
                    <span class="isShowImg" v-show="isShowImg">图片不能为空</span>
                    <h5>上传1张详情封面照,格式png, jpg,尺寸:750*420(16:9),不超过200KB</h5>
                    <div class="box_example">
                        <p class="title_example">图片上传示例</p>
                        <img class="img_example_last" src="../../../../assets/img/advexample.png" alt="" /> <img class="img_example" src="../../../../assets/img/advexample.png" alt="" />
                    </div>
                </div>
                <el-form-item label="是否上线" prop="status">
                    <el-switch :width="35" v-model="dataForm.status" active-text="是" :active-value="2" inactive-text="否" :inactive-value="1"> </el-switch>
                </el-form-item>
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
                <el-button size="small" type="primary" @click="dataFormSubmit()" :disabled="isclick">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {commonFunc,jdgouAdvertisements} from '@/utils/resources/index.js';
import co from 'co';
import OSS from 'ali-oss';
export default {
    data() {
        return {
            visible: false,
            dataForm: {
                id: 0,
                title: '',
                infoUrl: '',
                goodsId: null,
                subjecId: null,
                imageUrl: '',
                status: 1,
                comment: '',
                startAt: '',
                endAt: '',
                position: null,
            },
            positionList: [{value: 1, label: 'h5'}, {value: 2, label: '商品详情'}, {value: 3, label: '专题列表'}],
            isShowImg: false,
            isclick: false, //按钮默认可点击，点击确认之后不可再点击
            dataRule: {
                title: [{required: true, message: '名称不能为空', trigger: 'blur'}, {min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur'}],
                imageUrl: [{required: true, message: '图片不能为空', trigger: 'blur'}],
                position: [{required: true, message: '请选择', trigger: 'blur'}],
                goodsId: [{required: true, message: '商品id不能为空', trigger: 'blur'}],
                subjecId: [{required: true, message: '专题id不能为空', trigger: 'blur'}],
                startAt: [{required: true, message: '上线时间不能为空', trigger: 'blur'}],
                endAt: [{required: true, message: '下线时间不能为空', trigger: 'blur'}],
                comment: [{min: 2, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'}],
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
            const isLt200k = file.size / 1024 <= 200;
            var isComTrue = true; //是否压缩  true为需要压缩
            if (!isLt200k) {
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
                                    var result = yield client.put(jdgouAdvertisements + timeStamp, rst.file); //新增商品-上传的图片
                                    //console.log(result);
                                    that.dataForm.imageUrl = result.url;
                                    if (that.dataForm.imageUrl) {
                                        that.isShowImg = false;
                                    } else {
                                        that.isShowImg = true;
                                    }
                                });
                            });
                        } else {
                            co(function*() {
                                var timeStamp = new Date().getTime();
                                var result = yield client.put(jdgouAdvertisements + timeStamp, file); //新增商品-上传的图片
                                //console.log(result);
                                that.dataForm.imageUrl = result.url;
                                if (that.dataForm.imageUrl) {
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
            this.dataForm.imageUrl = '';
        },
        onSuccess() {
            //console.log(this.dataForm.imageUrl)
        },
        init(id) {
            this.isclick = false;
            this.dataForm.id = id || 0;
            this.visible = true;
            this.$nextTick(() => {
                this.$refs['dataFormRef'].resetFields();
                if (this.dataForm.id) {
                    this.$http({
                        url: this.$http.adornUrl5(`/v1/mkt/advertisements/` + this.dataForm.id),
                        method: 'get',
                    }).then(({data}) => {
                        if (data && data.code === 200) {
                            this.dataForm.title = data.data.title;
                            this.dataForm.imageUrl = data.data.imageUrl;
                            if (data.data.infoUrl.includes('goodsId')) {
                                this.dataForm.position = 2;
                                let goodsIndex = data.data.infoUrl.indexOf('=');
                                this.dataForm.goodsId = data.data.infoUrl.slice(goodsIndex + 1, data.data.infoUrl.length);
                            } else if (data.data.infoUrl.includes('subjecId')) {
                                this.dataForm.position = 3;
                                let subjecIdIndex = data.data.infoUrl.indexOf('=');
                                this.dataForm.subjecId = data.data.infoUrl.slice(subjecIdIndex + 1, data.data.infoUrl.length);
                            } else {
                                this.dataForm.position = 1;
                                this.dataForm.infoUrl = data.data.infoUrl;
                            }
                            this.dataForm.startAt = commonFunc(data.data.startAt);
                            this.dataForm.endAt = commonFunc(data.data.endAt);
                            this.dataForm.status = data.data.status;
                            this.dataForm.comment = data.data.comment;
                        }
                    });
                }
            });
        },
        closeDialog() {
            this.$refs['upload'].clearFiles();
        },
        // 表单提交
        dataFormSubmit() {
            this.$refs['dataFormRef'].validate(valid => {
                if (this.dataForm.startAt && this.dataForm.startAt >= this.dataForm.endAt) {
                    this.$message.error('上线时间不能大于下线时间');
                    return false;
                }
                if (!this.dataForm.imageUrl) {
                    this.isShowImg = true;
                    return false;
                }
                if (valid) {
                    this.$http({
                        //url: this.$http.adornUrl3(`/v1/advertisement`),
                        url: this.$http.adornUrl5(`/v1/mkt/advertisements`),
                        method: this.dataForm.id == 0 ? 'post' : 'put',
                        data: this.$http.adornData({
                            id: this.dataForm.id || undefined,
                            title: this.dataForm.title,
                            imageUrl: this.dataForm.imageUrl,
                            infoUrl: this.dataForm.position == 1 ? this.dataForm.infoUrl : this.dataForm.position == 2 ? 'goodsId=' + this.dataForm.goodsId : 'subjecId=' + this.dataForm.subjecId,
                            startAt: this.dataForm.startAt,
                            endAt: this.dataForm.endAt,
                            status: this.dataForm.status,
                            comment: this.dataForm.comment,
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
.box_example {
    width: 148px;
    height: 148px;
    position: absolute;
    left: 300px;
    top: 0;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    padding: 10px;
}
.box_example:hover .img_example_last {
    display: block;
}
.box_example:hover .addmanage {
    background-color: #000;
    filter: Alpha(Opacity=60);
    opacity: 0.6;
}
.title_example {
    margin: 0;
    padding: 0;
    font-size: 12px;
}
.img_example {
    height: 100px;
    width: 128px;
}
.img_example_last {
    display: none;
    position: absolute;
    top: -100px;
    z-index: 100;
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
.imgBox {
    position: relative;
}
</style>
