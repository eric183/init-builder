<template>
    <el-dialog :title="pageTitle" :close-on-click-modal="false" :visible.sync="dialogVisible">
        <el-form :model="dataForm" ref="dataForm" label-width="80px" size="small">
            <el-form-item label="姓名"> <el-input v-model="dataForm.name" placeholder="姓名"></el-input> </el-form-item>
            <el-form-item label="电话"> <el-input v-model="dataForm.phone" placeholder="电话"></el-input> </el-form-item>
            <el-form-item label="身份证号"> <el-input v-model="dataForm.idCard" placeholder="身份证号"></el-input> </el-form-item>
            <el-form-item label="性别">
                <el-radio-group v-model="dataForm.gender">
                    <el-radio v-for="item in genders" :label="item.value" :key="item.value">{{ item.label }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="状态">
                <el-radio-group v-model="dataForm.status">
                    <el-radio v-for="item in statusOption" :label="item.value" :key="item.value">{{ item.label }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="图片" class="advertImage">
                <OSSONEUpload :imagePath="OSSImagePath" :httpPath="OSSHttpPath" v-bind:image-src="dataForm.faceUser" v-on:setImageUrl="setImageUrl"></OSSONEUpload>
            </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submmit()">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import {faceurlMkdir} from '@/utils/resources/index.js';
import OSSONEUpload from '@/views/compontents/OSSONEUpload';
export default {
    props: ['visible'],
    components: {
        OSSONEUpload,
    },
    data() {
        return {
            pageTitle: '新增',
            dialogVisible: false,
            OSSImagePath: faceurlMkdir,
            OSSHttpPath: this.$http.adornUrl4('/v1/oss/tokens'),
            genders: [{label: '男', value: 1}, {label: '女', value: 2}],
            statusOption: [{label: '启用', value: 1}, {label: '禁用', value: 2}],
            dataForm: {
                name: '',
                phone: '',
                idCard: '',
                gender: 1,
                status: 1,
                faceUser: '',
            },
        };
    },
    methods: {
        init() {
            this.dialogVisible = true;
            this.dataForm = {
                name: '',
                phone: '',
                idCard: '',
                gender: 1,
                status: 1,
                faceUser: '',
            };
        },
        setImageUrl(imageUrl) {
            console.info('+++++++++++++++++++++++++++DDDDDDDDDdd' + imageUrl);
            this.dataForm.faceUser = imageUrl;
        },
        submmit() {
            let that = this;
            let method = null;
            if (that.dataForm.userId) {
                method = 'PUT';
            } else {
                method = 'POST';
            }
            this.$http({
                url: this.$http.adornUrl4('/v1/face/users'),
                method: method,
                data: this.$http.adornData(that.dataForm),
            }).then(data => {
                if (data && data.data.code === 201) {
                    that.$refs['dataForm'].resetFields();
                    that.dialogVisible = false;
                }
            });
        },
        selectById(id) {
            let that = this;
            this.dialogVisible = true;
            this.$http({
                url: this.$http.adornUrl4('/v1/face/users/' + id),
                method: 'GET',
            }).then(data => {
                if (data && data.data.code === 200) {
                    let user = data.data.data;
                    that.dataForm = user;
                    that.pageTitle = '修改';
                }
            });
        },
    },
};
</script>

<style scoped></style>
