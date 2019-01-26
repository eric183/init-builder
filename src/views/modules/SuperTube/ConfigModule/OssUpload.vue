<template>
    <el-row>
        <el-upload ref="upload" :action="''" :http-request="myUpload" list-type="picture-card" :limit="1" :before-upload="beforeAvatarUpload" :on-remove="onRemove" :on-success="onSuccess">
            <img v-if="imageUrl" :src="imageUrl" class="avatar" /> <i class="el-icon-plus"></i>
        </el-upload>
    </el-row>
</template>

<script>
var co = require('co');
var OSS = require('ali-oss');
export default {
    props: {
        imagePath: {
            type: String,
            required: true,
        },
        imageUrl: {
            type: String,
        },
    },
    data() {
        return {
            imgSrc: '',
        };
    },
    watch: {
        imageSrc: {
            handler(newValue, oldValue) {
                console.info(newValue + '   ' + oldValue);
            },
        },
    },
    methods: {
        myUpload(content) {
            content.onSuccess('配时文件上传成功');
        },
        beforeAvatarUpload(file) {
            let that = this;
            const isJPG = file.type === 'image/jpeg';
            const isJPG2 = file.type === 'image/png';
            const isLt200k = file.size / 1024 <= 200;
            var isComTrue = true; // 是否压缩  true为需要压缩
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
                    if (res.data.code === 200) {
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
                                    var result = yield client.put(that.imagePath + timeStamp, rst.file); // 新增商品-上传的图片
                                    // console.log(result);
                                    that.imgSrc = result.url;
                                    if (that.imgSrc) {
                                        that.$emit('setImageUrl', that.imgSrc);
                                    }
                                });
                            });
                        } else {
                            co(function*() {
                                var timeStamp = new Date().getTime();
                                var result = yield client.put(that.imagePath + timeStamp, file); // 新增商品-上传的图片
                                that.imgSrc = result.url;
                                if (that.imgSrc) {
                                    that.$emit('setImageUrl', that.imgSrc);
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
            this.$emit('setImageUrl', null);
        },
        clearFiles() {
            this.$refs['upload'].clearFiles();
        },
        onSuccess() {
            // console.log(this.dataForm.imageUrl)
        },
    },
};
</script>

<style scoped>
.avatar {
    width: 148px;
    height: 148px;
}
</style>
