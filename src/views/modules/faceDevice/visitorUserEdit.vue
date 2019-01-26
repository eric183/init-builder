<template>
    <el-dialog :title="pageTitle" :close-on-click-modal="false" :visible.sync="dialogVisible">
        <el-form label-width="100px">
            <el-form-item label="访客姓名"> <el-input v-model="formConfig.userName"></el-input> </el-form-item>
            <el-form-item label="访客电话"> <el-input v-model="formConfig.phone"></el-input> </el-form-item>
            <el-form-item label="身份证号码"> <el-input v-model="formConfig.idCard"></el-input> </el-form-item>
            <el-form-item label="性别">
                <el-radio-group v-model="formConfig.gender">
                    <el-radio v-for="item in genderValues" :label="item.value" :key="item.value">{{ item.label }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="用户类型">
                <el-radio-group v-model="formConfig.userType">
                    <el-radio v-for="item in userTypeValues" :label="item.value" :key="item.value">{{ item.label }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="有效日期">
                <el-date-picker v-model="timeValue" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="setTimeValue"> </el-date-picker>
            </el-form-item>
            <el-form-item label="拜访公司"> <el-input v-model="formConfig.companyName"></el-input> </el-form-item>
            <el-form-item label="拜访楼层"> <el-input v-model="formConfig.floorName"></el-input> </el-form-item>
            <el-form-item label="图片">
                <OSSONEUpload :imagePath="OSSImagePath" :httpPath="OSSHttpPath" v-bind:image-src="formConfig.faceUser" v-on:setImageUrl="setImageUrl"></OSSONEUpload>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitForm()">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import OSSONEUpload from '@/views/modules/UIModules/OSSONEUpload';
import {visitorFaceMkdir} from '@/assets/imgjs.js';
export default {
    components: {OSSONEUpload},
    data() {
        return {
            pageTitle: '新增',
            timeValue: null,
            dialogVisible: false,
            OSSImagePath: visitorFaceMkdir,
            OSSHttpPath: this.$http.adornUrl4('/v1/oss/tokens'),
            genderValues: [{label: '男', value: 1}, {label: '女', value: 2}],
            userTypeValues: [{label: '普通访客', value: 1}, {label: 'VIP', value: 2}],
            formConfig: {},
        };
    },
    methods: {
        init() {
            this.pageTitle = '新增';
            this.timeValue = null;
            this.formConfig = {
                userName: null,
                phone: null,
                gender: 1,
                userType: 1,
                startTime: null,
                endTime: null,
                faceUser: null,
                companyName: null,
                floorName: null,
            };
            this.dialogVisible = true;
        },
        setImageUrl(imageUrl) {
            this.formConfig.faceUser = imageUrl;
        },
        setTimeValue(val) {
            if (val) {
                this.formConfig.startTime = val[0].getTime();
                this.formConfig.endTime = val[1].getTime();
            } else {
                this.formConfig.startTime = null;
                this.formConfig.endTime = null;
            }
        },
        selectById(userId) {
            let that = this;
            this.dialogVisible = true;
            this.$http({
                url: this.$http.adornUrl4('/v1/face/visitorUsers/' + userId),
                method: 'GET',
            }).then(data => {
                if (data && data.data.code === 200) {
                    let user = data.data.data;
                    that.formConfig = user;
                    that.timeValue = [new Date(user.startTime), new Date(user.endTime)];
                    that.pageTitle = '修改';
                }
            });
        },
        submitForm() {
            let that = this;
            let method = null;
            if (that.formConfig.userId) {
                method = 'PUT';
            } else {
                method = 'POST';
            }
            this.$http({
                url: this.$http.adornUrl4('/v1/face/visitorUsers'),
                method: method,
                data: this.$http.adornData(that.formConfig),
            }).then(data => {
                if (data && data.data.code === 201) {
                    that.dialogVisible = false;
                }
            });
        },
    },
};
</script>

<style scoped></style>
