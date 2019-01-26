<template>
    <el-dialog :title="!dataForm.id ? '人工注册' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="130px" size="small">
            <!-- <el-form-item label="姓名" prop="realName">
        <el-input v-model="dataForm.realName" placeholder="姓名"></el-input>
      </el-form-item> -->
            <el-form-item label="昵称" prop="nickname"> <el-input v-model="dataForm.nickname" placeholder="昵称"></el-input> </el-form-item>
            <el-form-item label="手机号" prop="phone"> <el-input v-model="dataForm.phone" placeholder="手机号"></el-input> </el-form-item>
            <el-form-item label="性别" prop="gender">
                <el-select placeholder="请选择" v-model="dataForm.gender"> <el-option v-for="item in genderlist" :key="item.value" :label="item.label" :value="item.value"></el-option> </el-select>
            </el-form-item>
            <el-form-item label="密码" prop="password"> <el-input v-model="dataForm.password" type="password" placeholder="密码"></el-input> </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="visible = false">取消</el-button>
            <el-button size="small" type="primary" @click="dataFormSubmit()">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import Sha256 from 'js-sha256';
let sha256=Sha256.sha256;
export default {
    data() {
        return {
            genderlist: [{value: 1, label: '男'}, {value: 2, label: '女'}, {value: 3, label: '未填'}],
            visible: false,
            roleList: [],
            dataForm: {
                id: 0,
                realName: '',
                nickName: '',
                account: '',
                gender: '',
                status: '',
            },
            dataRule: {
                nickname: [{required: true, message: '昵称不能为空', trigger: 'blur'}],
                phone: [{required: true, message: '手机号不能为空', trigger: 'blur'}],
                gender: [{required: true, message: '性别不能为空', trigger: 'blur'}],
                password: [{required: true, message: '密码不能为空', trigger: 'blur'}],
            },
        };
    },
    methods: {
        init(id) {
            this.dataForm.id = id || 0;
            this.visible = true;
            this.$nextTick(() => {
                this.$refs['dataForm'].resetFields();
                if (this.dataForm.id) {
                    this.$http({
                        url: this.$http.adornUrl(`/v1/baseUser/${this.dataForm.id}`),
                        method: 'get',
                        params: this.$http.adornParams(),
                    }).then(({data}) => {
                        if (data && data.code === 200) {
                            console.log(data);
                            this.dataForm.realName = data.data.realName;
                            this.dataForm.nickName = data.data.nickName;
                            this.dataForm.account = data.data.account;
                            this.dataForm.gender = data.data.gender;
                            this.dataForm.status = data.data.status;
                        }
                    });
                }
            });
        },
        // 表单提交
        dataFormSubmit() {
            this.$refs['dataForm'].validate(valid => {
                if (valid) {
                    this.$http({
                        url: this.$http.adornUrl(`/v1/user/users`),
                        method: this.dataForm.id == 0 ? 'post' : 'put',
                        data: this.$http.adornData({
                            userId: this.dataForm.id || undefined,
                            nickname: this.dataForm.nickname,
                            phone: this.dataForm.phone,
                            gender: this.dataForm.gender,
                            password: sha256(this.dataForm.password),
                        }),
                    }).then(({data}) => {
                        if (data && data.code === 201) {
                            this.$message({
                                message: '操作成功',
                                type: 'success',
                                duration: 1000,
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
