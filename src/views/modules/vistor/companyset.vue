<template>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="getDataList()" size="small" label-width="100px">
        <el-form-item label="访客联系人" prop="contacts"> <el-input v-model="dataForm.contacts" placeholder="访客联系人" clearable></el-input> </el-form-item>
        <el-form-item label="联系电话" prop="phone"> <el-input v-model="dataForm.phone" placeholder="联系电话" clearable></el-input> </el-form-item>
        <el-form-item label="访客审核"> <el-switch :width="35" v-model="dataForm.isVmChecked" active-text="是" :active-value="1" inactive-text="否" :inactive-value="0"> </el-switch> </el-form-item>
        <el-form-item> <el-button type="success" @click="confire()">提交</el-button> </el-form-item>
    </el-form>
</template>

<script>
import {isMobile} from '@/utils/validate';
import AddOrUpdate from './company-add-or-update';
var validateMobile = (rule, value, callback) => {
    if (!isMobile(value)) {
        callback(new Error('手机号格式错误'));
    } else {
        callback();
    }
};

export default {
    data() {
        return {
            dataForm: {
                contacts: '',
                phone: '',
                isVmChecked: 1,
            },
            companyId: null,
            dataRule: {
                contacts: [
                    {
                        required: true,
                        message: '请填写访客联系人',
                        trigger: 'blur',
                    },
                ],
                phone: [
                    {
                        required: true,
                        message: '请填写手机号',
                        trigger: 'blur',
                    },
                    {
                        validator: validateMobile,
                        trigger: 'blur',
                    },
                ],
            },
        };
    },
    activated() {
        this.getCompanyInfo();
    },
    methods: {
        // 查询账号/用户下的企业信息
        getCompanyInfo() {
            this.dataListLoading = true;
            this.$http({
                url: this.$http.adornUrl('/v1/visitor/companys/userCompany'),
                method: 'get',
            }).then(({data}) => {
                if (data.code == 200) {
                    this.dataForm.contacts = data.data.contacts;
                    this.dataForm.phone = data.data.phone;
                    this.dataForm.isVmChecked = data.data.isVmChecked;
                    this.companyId = data.data.companyId;
                }
            });
        },
        // 修改企业信息
        confire() {
            this.$refs['dataForm'].validate(valid => {
                if (valid) {
                    this.$http({
                        url: this.$http.adornUrl(`/v1/visitor/companys`),
                        method: 'put',
                        data: this.$http.adornData({
                            companyId: this.companyId,
                            contacts: this.dataForm.contacts,
                            phone: this.dataForm.phone,
                            isVmChecked: this.dataForm.isVmChecked,
                        }),
                    }).then(({data}) => {
                        if (data && data.code === 201) {
                            this.$message({
                                message: '操作成功',
                                type: 'success',
                            });
                        }
                    });
                }
            });
        },
    },
};
</script>
<style lang="scss" scoped>

</style>
