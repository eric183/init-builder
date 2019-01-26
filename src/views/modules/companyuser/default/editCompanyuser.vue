<template>
    <el-dialog title="编辑人员" :close-on-click-modal="false" :append-to-body="true" :visible.sync="dialogVisible">
        <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" label-width="100px" size="small">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="姓名" prop="realname"> <el-input v-model="dataForm.realname" clearable></el-input> </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="性别" prop="gender">
                        <el-radio-group v-model="dataForm.gender">
                            <el-radio-button :label="1">男</el-radio-button>
                            <el-radio-button :label="2">女</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="部门"> <select-department :dataForm="dataForm" ref="departmentRef"></select-department> </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="职务">
                        <el-select v-model="dataForm.position"> <el-option v-for="item in positionList" :key="item.id" :label="item.position" :value="item.position"></el-option> </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="工号" prop="employeeNo"> <el-input v-model="dataForm.employeeNo"></el-input> </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false" size="small">取 消</el-button>
            <el-button type="primary" size="small" @click="subMit">确定</el-button>
        </div>
    </el-dialog>
</template>
<script>
import selectDepartment from './selectDepartment';
export default {
    components: {
        selectDepartment,
    },
    data() {
        return {
            dialogVisible: false,
            dataForm: {
                realname: '',
                gender: 0,
                position: '',
                parentName: '',
                departmentId: 0,
                employeeNo: '',
                userId: 0,
            },
            positionList: [],
            dataRule: {
                realname: [{required: true, message: '请填写姓名', trigger: 'blur'}],
            },
        };
    },
    methods: {
        init(obj) {
            let newObj = Object.assign(obj);
            this.dialogVisible = true;
            this.$nextTick(() => {
                this.dataForm.userId = newObj.userId;
                this.dataForm.realname = newObj.realName;
                this.dataForm.gender = newObj.gender;
                this.dataForm.position = newObj.position;
                this.dataForm.parentName = newObj.departmentName;
                this.dataForm.companyRefId = newObj.companyRefId;
                this.dataForm.employeeNo = newObj.employeeNo;
                this.getPositionList();
                this.$refs.departmentRef.init();
            });
        },
        // 获取职务信息下拉列表
        getPositionList() {
            this.$http({
                url: this.$http.adornUrl('/v1/user/companies/positions'),
                method: 'get',
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.positionList = data.data.positions;
                }
            });
        },
        subMit() {
            if (!this.dataForm.parentName) {
                this.dataForm.departmentId = 0;
            }
            this.$http({
                url: this.$http.adornUrl('/v2/user/users'),
                method: 'put',
                data: this.$http.adornData(this.dataForm),
            }).then(({data}) => {
                if (data && data.code === 201) {
                    this.$message.success('修改成功');
                    this.$emit('reshData');
                    this.dialogVisible = false;
                }
            });
        },
    },
};
</script>
