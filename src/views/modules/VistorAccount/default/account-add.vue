<template>
    <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" @close="closeDialog" :visible.sync="visible">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px" size="small">
            <el-form-item label="姓名" prop="name"> <el-input v-model="dataForm.name" placeholder="姓名"></el-input> </el-form-item>
            <el-form-item label="账号" prop="phone"> <el-input v-model="dataForm.phone" placeholder="账号"></el-input> </el-form-item>
            <el-form-item label="密码" prop="password" v-if="!dataForm.id"> <el-input v-model="dataForm.password" placeholder="密码"></el-input> </el-form-item>
            <el-form-item label="备注" prop="remark"> <el-input v-model="dataForm.remark" placeholder="备注"></el-input> </el-form-item>
            <el-form-item label="状态" prop="status" v-if="!dataForm.id">
                <el-switch :width="35" v-model="dataForm.status" active-text="启用" :active-value="1" inactive-text="禁用" :inactive-value="2"> </el-switch>
            </el-form-item>
            <el-form-item label="角色" size="mini" prop="checkRole">
                <el-radio-group v-model="dataForm.checkRole">
                    <el-radio v-for="role in roleList" :key="role.roleId" :label="role.roleId">{{ role.roleName }}</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="visible = false">取消</el-button>
            <el-button size="small" type="primary" @click="dataFormSubmit()">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
// let sha256 = require('js-sha256').sha256; //这里用的是require方法，所以没用import
import Sha256 from 'js-sha256';
let sha256=Sha256.sha256;
export default {
    data() {
        return {
            dataForm: {
                id: 0,
                phone: '',
                password: '',
                remark: '',
                status: 1,
                name: '',
                type: '',
                checkRole: '',
            },
            roleList: [],
            visible: false,
            dataRule: {
                phone: [{required: true, message: '必填', trigger: 'blur'}],
                name: [{required: true, message: '必填', trigger: 'blur'}],
                password: [{required: true, message: '必填', trigger: 'blur'}],
                status: [{required: true, message: '必填', trigger: 'blur'}],
                checkRole: [{required: true, message: '必填', trigger: 'blur'}],
            },
        };
    },
    activated() {},
    methods: {
        init(id) {
            this.dataForm.id = id || 0;
            this.$http({
                url: this.$http.adornUrl('/v1/auth/roles'),
                method: 'get',
                params: this.$http.adornParams(),
            })
                .then(({data}) => {
                    this.roleList = data && data.code === 200 ? data.data.list : [];
                })
                .then(() => {
                    this.visible = true;
                    this.$nextTick(() => {
                        this.$refs['dataForm'].resetFields();
                    });
                })
                .then(() => {
                    if (this.dataForm.id) {
                        this.$http({
                            url: this.$http.adornUrl(`/v1/visitor/users/` + this.dataForm.id),
                            method: 'get',
                        }).then(({data}) => {
                            if (data && data.code === 200) {
                                this.dataForm.phone = data.data.phone;
                                this.dataForm.name = data.data.name;
                                this.dataForm.remark = data.data.remark;
                                this.dataForm.checkRole = data.data.userRoles[0].roleId;
                            }
                        });
                    }
                });
        },
        closeDialog() {
            this.$refs['dataForm'].resetFields();
        },
        dataFormSubmit() {
            this.$refs['dataForm'].validate(valid => {
                var checkRoleList = [];
                checkRoleList.push(this.dataForm.checkRole);
                if (valid) {
                    if (this.dataForm.id) {
                        this.$http({
                            url: this.$http.adornUrl(`/v1/visitor/users`),
                            method: 'put',
                            data: this.$http.adornData({
                                userId: this.dataForm.id,
                                phone: this.dataForm.phone,
                                remark: this.dataForm.remark,
                                type: 1,
                                name: this.dataForm.name,
                                roleIds: checkRoleList,
                            }),
                        }).then(({data}) => {
                            if (data && data.code === 201) {
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
                    } else {
                        this.$http({
                            url: this.$http.adornUrl(`/v1/visitor/users`),
                            method: 'post',
                            data: this.$http.adornData({
                                phone: this.dataForm.phone,
                                password: sha256(this.dataForm.password),
                                remark: this.dataForm.remark,
                                status: this.dataForm.status,
                                type: 1,
                                name: this.dataForm.name,
                                roleIds: checkRoleList,
                            }),
                        }).then(({data}) => {
                            if (data && data.code === 201) {
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
                }
            });
        },
    },
};
</script>
