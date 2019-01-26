<template>
    <div>
        <div class="box" v-if="imageSrc" @click="onRemove">
            <div class="list" id="list1"><img :src="imageSrc" class="avatar" /></div>
        </div>

        <el-upload
            v-if="!imageSrc"
            ref="upload"
            :action="''"
            :http-request="myUpload"
            list-type="picture-card"
            :limit="1"
            :before-upload="beforeAvatarUpload"
            :on-remove="onRemove"
            :on-success="onSuccess"
        >
            <img v-if="imageSrc" :src="imageSrc" class="avatar" /> <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
    </div>
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
        httpPath: {
            type: String,
            required: true,
        },
        imageSrc: {
            type: String,
            required: false,
        },
    },
    data() {
        return {
            imageUrl: '',
        };
    },
    watch: {
        imageSrc: {
            handler(newValue, oldValue) {
                console.info(newValue + '   ' + oldValue);
            },
        },
    },
    created: function() {
        console.info('sssssssssssss' + this.imageUrl);
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
                this.$http.get(that.httpPath).then(function(res) {
                    if (res.data.code === 200) {
                        // console.log(res.data.data.accessKeyId)
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
                                    that.imageUrl = result.url;
                                    if (that.imageUrl) {
                                        that.$emit('setImageUrl', that.imageUrl);
                                        that.isShowImg = false;
                                    } else {
                                        that.isShowImg = true;
                                    }
                                });
                            });
                        } else {
                            co(function*() {
                                var timeStamp = new Date().getTime();
                                var result = yield client.put(that.imagePath + timeStamp, file); // 新增商品-上传的图片
                                that.imageUrl = result.url;
                                if (that.imageUrl) {
                                    that.$emit('setImageUrl', that.imageUrl);
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
            this.$emit('setImageUrl', null);
        },
        onSuccess() {
            // console.log(this.dataForm.imageUrl)
        },
    },
};
</script>

<style scoped>
.avatar {
    height: 148px;
    width: 148px;
    cursor: pointer;
}
.box {
    text-align: center;
    float: left;
    cursor: pointer;
}
.list {
    display: inline-block;
    width: 148px;
    height: 148px;
    margin: 0px;
    position: relative;
}
.list::before {
    /*无需再嵌套div来做遮罩层*/
    width: 148px;
    height: 148px;
    display: inline-block;
    background: #000000;
    opacity: 0;
    content: 'X';
    color: red;
    position: absolute;
    text-align: center;
    line-height: 148px;
    top: 0px;
    left: 0px;
    z-index: 9;
}
#list1:hover::before {
    height: 148px;
    opacity: 0.6;
}
.list img {
    width: 148px;
    height: 148px;
    margin: 0px;
    z-index: 1;
}
</style>
