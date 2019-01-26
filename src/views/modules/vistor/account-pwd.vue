<template>
    <el-dialog title="修改" :close-on-click-modal="false" :visible.sync="visible">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="70px" size="small">
            <el-form-item label="旧密码" prop="oldPassword"> <el-input v-model="dataForm.oldPassword" placeholder="旧密码"></el-input> </el-form-item>
            <el-form-item label="新密码" prop="newPassword"> <el-input v-model="dataForm.newPassword" placeholder="新密码"></el-input> </el-form-item>
            <el-form-item label="备注" prop="remark"> <el-input v-model="dataForm.remark" placeholder="备注"></el-input> </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="visible = false">取消</el-button>
            <el-button size="small" type="primary" @click="dataFormSubmit()">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import {isMobile} from '@/utils/validate';
let sha256 = require('js-sha256').sha256;
export default {
    data() {
        return {
            dataForm: {
                id: null,
                oldPassword: '',
                newPassword: '',
                remark: '',
            },
            visible: false,
            dataRule: {
                oldPassword: [{required: true, message: '不能为空', trigger: 'blur'}],
                newPassword: [{required: true, message: '不能为空', trigger: 'blur'}],
            },
        };
    },
    activated() {},
    methods: {
        init(id) {
            this.dataForm.id = id;
            console.log(id);
            this.visible = true;
            this.$nextTick(() => {
                this.$refs['dataForm'].resetFields();
            });
        },
        dataFormSubmit() {
            this.$refs['dataForm'].validate(valid => {
                if (valid) {
                    this.$http({
                        url: this.$http.adornUrl(`/v1/visitor/users/password`),
                        method: 'put',
                        data: this.$http.adornData({
                            userId: this.dataForm.id,
                            oldPassword: sha256(this.dataForm.oldPassword),
                            newPassword: sha256(this.dataForm.newPassword),
                            remark: this.dataForm.remark,
                        }),
                    }).then(({data}) => {
                        if (data && data.code === 201) {
                            this.$message({
                                message: '操作成功',
                                type: 'success',
                            });
                            this.visible = false;
                        }
                    });
                }
            });
        },
    },
};
</script>
