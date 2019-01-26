<template>
    <el-dialog title="同步" :close-on-click-modal="false" :append-to-body="true" :visible.sync="visible">
        <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter.native="dataFormSubmit()" label-width="100px" size="small">
            <el-form-item label="邮箱" prop="email"> <el-input v-model="dataForm.email" placeholder="邮箱"></el-input> </el-form-item>
            <el-form-item label="身份证号" prop="idCard"> <el-input v-model="dataForm.idCard" placeholder="身份证号"></el-input> </el-form-item>
            <el-form-item label="联系电话" prop="telephone"> <el-input v-model="dataForm.telephone" placeholder="联系电话"></el-input> </el-form-item>
            <el-form-item label="部门" prop="selectedOptions">
                <el-cascader :options="options" filterable change-on-select v-model="dataForm.selectedOptions" @change="changeId" :show-all-levels="false" :props="props"></el-cascader>
            </el-form-item>
            <el-form-item label="职务信息" prop="position"> <el-input v-model="dataForm.position" placeholder="职务信息"></el-input> </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="visible = false">取消</el-button>
            <el-button size="small" type="primary" @click="dataFormSubmit()">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    data() {
        return {
            visible: false,
            dataForm: {
                email: '',
                position: '',
                idCard: '',
                telephone: '',
                departmentId: '',
                selectedOptions: [],
            },
            userId: null, //用户id--传到该页面的用户id
            options: [],
            props: {
                value: 'departmentId',
                label: 'departmentName',
                children: 'children',
            },
            dataRule: {
                email: [{required: true, message: '邮箱不能为空', trigger: 'blur'}],
                idCard: [{required: true, message: '身份证不能为空', trigger: 'blur'}],
                telephone: [{required: true, message: '联系电话不能为空', trigger: 'blur'}],
                selectedOptions: [{required: true, message: '部门不能为空', trigger: 'blur'}],
                position: [{required: true, message: '职务信息不能为空', trigger: 'blur'}],
            },
        };
    },
    methods: {
        init(id) {
            this.userId = id;
            this.visible = true;
            this.$nextTick(() => {
                this.$refs['dataFormRef'].resetFields();
                this.getDepartment();
            });
        },
        // 查询部门
        getDepartment() {
            this.$http({
                url: this.$http.adornUrl('/v1/pm/departments'),
                method: 'get',
            }).then(({data}) => {
                this.options = data && data.code === 200 ? data.data.departments : [];
            });
        },
        // 部门级联选择器change事件
        changeId(val) {
            this.dataForm.departmentId = val[val.length - 1];
        },
        // 表单提交
        dataFormSubmit() {
            this.$refs['dataFormRef'].validate(valid => {
                if (valid) {
                    this.$http({
                        url: this.$http.adornUrl('/v1/pm/users/' + this.userId + '/userInfo'),
                        method: 'put',
                        data: this.$http.adornData({
                            email: this.dataForm.email,
                            departmentId: this.dataForm.departmentId,
                            position: this.dataForm.position,
                            idCard: this.dataForm.idCard,
                            telephone: this.dataForm.telephone,
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
