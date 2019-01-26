<template>
    <el-row>
        <el-upload
            ref="upload"
            :action="''"
            multiple
            :limit="1"
            :on-exceed="onExceed"
            class="upload-demo"
            :http-request="myUpload"
            :before-upload="beforeAvatarUpload"
            :on-remove="onRemove"
            :on-success="onSuccess"
        >
            <el-button size="small" type="primary">手机号导入</el-button>
        </el-upload>
    </el-row>
</template>

<script>
export default {
    data() {
        return {};
    },
    methods: {
        myUpload(content) {
            content.onSuccess('配时文件上传成功');
        },
        onExceed() {
            this.$message.error('暂时支持上传一个excel，谢谢');
        },
        beforeAvatarUpload(file) {
            let XLs = file.name.split('.');
            if (XLs[1] === 'xls' || XLs[1] === 'xlsx') {
                if (file.size / 1024 > 10) {
                    this.$message.error('请不要超过10k');
                    return false;
                }
                var fd = new FormData();
                fd.append('phones', file);
                this.$http({
                    url: this.$http.adornUrl(`/v1/note/messages/phones`),
                    method: 'post',
                    data: fd,
                }).then(({data}) => {
                    if (data && data.code === 201) {
                        this.$message.success('操作成功');
                        this.$emit('phonesData', data.data);
                    }
                });
            } else {
                this.$message.error('上传文件只能是 xls/xlsx 格式!');
                return false;
            }
        },
        onRemove() {},
        onSuccess(response, file, fileList) {},
    },
};
</script>

<style scoped>
.avatar {
    width: 148px;
    height: 148px;
}
</style>
