<template>
    <el-row :class="{img_upload: limitNum == 1}">
        <!-- 目前单张图片上传 -->
        <el-upload ref="upload" :action="''" :http-request="myUpload" list-type="picture-card" :file-list="fileList" :limit="limitNum" :before-upload="beforeAvatarUpload" :on-remove="onRemove">
            <i class="el-icon-plus"></i>
        </el-upload>
    </el-row>
</template>

<script>
var co = require('co');
var OSS = require('ali-oss');
export default {
    props: {
        limitNum: {
            type: Number,
            required: true,
        },
        fileList: {
            type: Array,
            required: false,
        },
        fileSize: {
            type: Number,
            required: true,
        },
        imgWidth: {
            type: Number,
            required: true,
        },
        imgSize: {
            type: Number,
            required: true,
        },
        imgLocaltion: {
            type: String,
            required: true,
        },
        value: {
            required: false,
        },
        valueError: {
            type: String,
            required: false,
        },
    },
    data() {
        return {};
    },
    methods: {
        myUpload(content) {
            content.onSuccess('配时文件上传成功');
        },
        beforeAvatarUpload(file) {
            if (!this.value) {
                this.$message.error(this.valueError);
                return false;
            }
            const that = this;
            const isJPG = file.type === 'image/jpeg';
            const isJPG2 = file.type === 'image/png';
            const isJPG3 = file.type === 'image/gif';
            const isLt200k = file.size / 1024 <= this.imgSize;
            if (isJPG3) {
                if (!isLt200k) {
                    this.$message.error('请上传大小合适的gif动图');
                    return false;
                }
            }
            if (!isJPG && !isJPG2 && !isJPG3) {
                this.$message.error('上传图片暂时只支持JPG,png,gif格式');
                this.$refs.upload.clearFiles();
            } else {
                this.$http.get(that.$http.adornUrl('/v1/oss/tokens')).then(function(res) {
                    if (res.data.code == 200) {
                        var client = new OSS({
                            accessKeyId: res.data.data.accessKeyId,
                            endpoint: res.data.data.endPoint,
                            accessKeySecret: res.data.data.accessKeySecret,
                            bucket: res.data.data.bucket,
                            region: res.data.data.region,
                            stsToken: res.data.data.securityToken,
                        });
                        if (!isLt200k && !isJPG3) {
                            lrz(file, {
                                width: that.imgWidth,
                                quality: 0.7,
                            }).then(function(rst) {
                                co(function*() {
                                    var timeStamp = new Date().getTime();
                                    var result = yield client.put(that.imgLocaltion + timeStamp, rst.file); //新增商品-上传的图片
                                    //console.log(result);
                                    let obj = {};
                                    obj.url = result.url;
                                    that.fileList.push(obj);
                                    that.$emit('imgListFun', that.fileList);
                                });
                            });
                        } else {
                            co(function*() {
                                var timeStamp = new Date().getTime();
                                let param=that.imgLocaltion +((isJPG3 == true) ? timeStamp+'.gif' : timeStamp)
                                var result = yield client.put(param, file); //新增商品-上传的图片
                                let obj = {};
                                obj.url = result.url;
                                that.fileList.push(obj);
                                that.$emit('imgListFun', that.fileList);
                            });
                        }
                    } else {
                        return false;
                    }
                });
            }
        },
        onRemove(file, fileList) {
            let index = 0;
            this.fileList.map((obj, i) => {
                if (obj.url == file.url) {
                    index = i;
                }
            });
            this.fileList.splice(index, 1);
            this.$emit('imgListFun', this.fileList);
        },
    },
};
</script>

<style scoped>
.img_upload {
    height: 148px;
    width: 148px;
    overflow: hidden;
}
</style>
