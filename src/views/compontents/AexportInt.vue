<template>
    <el-dialog :visible.sync="visible" :title="'上传文件'">
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
            <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
    </el-dialog>
</template>

<script>
export default {
    props: {
        URL: {
            type: String,
        },
        excelName: {
            type: String,
        },
    },
    data() {
        return {
            visible: false,
        };
    },
    methods: {
        init() {
            this.visible = true;
            this.$nextTick(() => {
                this.$refs.upload.clearFiles();
            });
        },
        myUpload(content) {
            content.onSuccess('配时文件上传成功');
        },
        onExceed() {
            this.$message.error('暂时支持上传一个excel，谢谢');
        },
        beforeAvatarUpload(file) {
            let XLs = file.name.split('.');
            if (XLs[1] === 'xls' || XLs[1] === 'xlsx') {
                // if (file.size / 1024 > 10) {
                //   this.$message.error("请不要超过10k");
                //   return false;
                // }
                var fd = new FormData();
                fd.append(this.excelName, file);
                this.$http({
                    url: this.$http.adornUrl(this.URL),
                    method: 'post',
                    data: fd,
                }).then(({data}) => {
                    if (data && data.code === 201) {
                        if (!data.data.isSuccessful) {
                            this.$message.error(data.data.errorMsg);
                        } else {
                            this.$message.success('导入成功');
                            this.visible = false;
                        }
                        this.$emit('refreshDataList');
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
