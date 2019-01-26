<template>
    <el-dialog :title="!dataForm.id ? '新增白名单' : '新增黑名单'" :close-on-click-modal="false" @close="closeDialog" :visible.sync="visible">
        <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter.native="dataFormSubmit()" label-width="120px" size="small">
            <el-form-item label="姓名" prop="name"> <el-input v-model="dataForm.name"></el-input> </el-form-item>
            <el-form-item label="手机号码" prop="phone"> <el-input v-model="dataForm.phone"></el-input> </el-form-item>
            <el-form-item label="身份证号" prop="idCard"> <el-input v-model="dataForm.idCard"></el-input> </el-form-item>
            <el-form-item label="备注" prop="remark"> <el-input type="textarea" v-model="dataForm.remark"></el-input> </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="visible = false">取消</el-button>
            <el-button size="small" type="primary" @click="dataFormSubmit()">确定</el-button>
        </span>
    </el-dialog>
</template>
<script>
import {isMobile} from '@/utils/validate';
export default {
    data() {
        var validateMobile = (rule, value, callback) => {
            if (!isMobile(value)) {
                callback(new Error('手机号格式错误'));
            } else {
                callback();
            }
        };
        return {
            visible: false,
            dataForm: {
                id: 0,
                name: '',
                phone: '',
                idCard: '',
                remark: '',
            },
            dataRule: {
                name: [{required: true, message: '请输入姓名', trigger: 'blur'}],
                phone: [{required: true, message: '请输入手机号码', trigger: 'blur'}, {validator: validateMobile, trigger: 'blur'}],
                idCard: [{required: true, message: '请输入身份证号', trigger: 'blur'}],
            },
        };
    },
    methods: {
        closeDialog() {
            this.$refs.dataFormRef.resetFields();
        },
        init(id) {
            this.visible = true;
            this.dataForm.id = id;
        },
        // 表单提交
        dataFormSubmit() {
            this.$refs['dataFormRef'].validate(valid => {
                if (valid) {
                    this.$http({
                        url: this.$http.adornUrl(this.dataForm.id == 0 ? `/v1/visitor/whitelists` : `/v1/visitor/blacklists`),
                        method: 'post',
                        data: this.$http.adornData({
                            name: this.dataForm.name,
                            phone: this.dataForm.phone,
                            idCard: this.dataForm.idCard,
                            remark: this.dataForm.remark,
                        }),
                    }).then(({data}) => {
                        if (data && data.code === 201) {
                            this.isclick = true;
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
