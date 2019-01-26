<template>
    <el-dialog :visible.sync="visable" title="新增业务">
        <!-- 新增机房的弹窗 -->
        <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" label-width="90px" size="small">
            <el-form-item prop="businessType" label="业务类型:">
                <el-select v-model="dataForm.businessType"> <el-option v-for="item in businessTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option> </el-select>
            </el-form-item>
            <el-form-item prop="businessValue" label="业务值:"> <el-input v-model="dataForm.businessValue" placeholder="16字以内" clearable></el-input> </el-form-item>
            <el-form-item prop="operatorType" label="运营商:">
                <el-select v-model="dataForm.operatorType"> <el-option v-for="item in operatorTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option> </el-select>
            </el-form-item>
            <el-form-item prop="companyName" label="企业名称:"> <el-input v-model="dataForm.companyName" placeholder="32字以内" clearable></el-input> </el-form-item>
            <el-form-item prop="openingTime" label="企业开通时间:">
                <el-date-picker v-model="dataForm.openingTime" type="datetime" placeholder="请选择日期" value-format="timestamp"> </el-date-picker>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="visable = false">取消</el-button>
            <el-button size="small" type="primary" @click="dataFormSubmit()">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    data() {
        return {
            dataForm: {
                businessType: '',
                operatorType: '',
                businessValue: '',
                companyName: '',
                openingTime: '',
            },
            terminalId: 0,
            visable: false,
            businessTypeList: [{value: '1', label: 'ADSL'}, {value: '2', label: '数据'}, {value: '3', label: '语音'}],
            operatorTypeList: [{value: '1', label: '移动'}, {value: '2', label: '联通'}, {value: '3', label: '电信'}],
            dataRule: {
                businessType: [{required: true, message: '必填', trigger: 'blur'}],
                businessValue: [{required: true, message: '必填', trigger: 'blur'}, {min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: 'blur'}],
                operatorType: [{required: true, message: '必填', trigger: 'blur'}],
                companyName: [{required: true, message: '必填', trigger: 'blur'}, {min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur'}],
                openingTime: [{required: true, message: '必填', trigger: 'blur'}],
            },
        };
    },
    methods: {
        init(id) {
            this.terminalId = id;
            this.visable = true;
            this.$nextTick(() => {
                this.$refs.dataFormRef.resetFields();
            });
        },
        // 添加
        dataFormSubmit() {
            this.$refs['dataFormRef'].validate(valid => {
                if (valid) {
                    this.$http({
                        url: this.$http.adornUrl('/v1/cpn/terminals/' + this.terminalId + '/business'),
                        method: 'post',
                        data: this.$http.adornData(this.dataForm),
                    }).then(({data}) => {
                        if (data && data.code === 201) {
                            this.visable = false;
                            this.$emit('refreshDataList');
                            this.$message.success('新增成功');
                        }
                    });
                }
            });
        },
    },
};
</script>
