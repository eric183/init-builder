<template>
    <div class="addmanage">
        <el-dialog title="新增" :close-on-click-modal="false" @close="closeDialog" :append-to-body="true" :visible.sync="visible">
            <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter.native="dataFormSubmit()" label-width="100px" size="small">
                <el-form-item label="相册类别" prop="galleryId">
                    <el-select v-model="dataForm.galleryId"> <el-option v-for="item in galleryList" :key="item.galleryId" :label="item.title" :value="item.galleryId"></el-option> </el-select>
                </el-form-item>
                <el-form-item label="相片标题" prop="title"> <el-input v-model="dataForm.title" placeholder="相册标题"></el-input> </el-form-item>
                <div class="imgBox">
                    <el-form-item label="相片" class="advertImage">
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
                            <img v-if="dataForm.image" :src="dataForm.image" class="avatar" /> <i class="el-icon-plus"></i>
                        </el-upload>
                    </el-form-item>
                    <h5>上传1张相片,格式png, jpg,尺寸:750*420(16:9),不超过100KB</h5>
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
import {photos} from '@/utils/resources/index.js';
import co from 'co';
import OSS from 'ali-oss';
export default {
    data() {
        return {
            visible: false,
            dataForm: {
                galleryId: null,
                title: '',
                coverImg: '',
            },
            galleryList: [],
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
                            var result = yield client.put(photos + timeStamp, file); //新增商品-上传的图片
                            //console.log(result);
                            that.dataForm.image = result.url;
                        });
                    } else {
                        return false;
                    }
                });
            }
        },
        onRemove() {
            this.dataForm.image = '';
        },
        closeDialog() {
            (this.dataForm = {
                galleryId: null,
                title: '',
                image: '',
            }),
                this.$refs.dataFormRef.resetFields();
            this.$refs.upload.clearFiles();
        },
        onSuccess() {
            //console.log(this.dataForm.imageUrl)
        },
        init() {
            this.visible = true;
            this.getGarrlyList();
        },
        // 查询相册列表-下拉
        getGarrlyList() {
            this.$http({
                url: this.$http.adornUrl('/v1/info/galleries'),
                method: 'get',
                params: this.$http.adornParams({
                    pageSize: 999,
                    pageNum: 1,
                }),
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.galleryList = data.data.list;
                } else {
                    this.dataList = [];
                }
            });
        },
        // 表单提交
        dataFormSubmit() {
            this.$refs['dataFormRef'].validate(valid => {
                if (!this.dataForm.image) {
                    this.$message.error('上传图片不能为空');
                    return false;
                }
                if (valid) {
                    this.$http({
                        url: this.$http.adornUrl(`/v1/info/photos`),
                        method: 'post',
                        data: this.$http.adornData({
                            galleryId: this.dataForm.galleryId,
                            title: this.dataForm.title,
                            image: this.dataForm.image,
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
