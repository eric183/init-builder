<template>
    <el-dialog title="协作者" :close-on-click-modal="false" :visible.sync="visible">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px" size="small">
            <!-- 添加协作者 -->
            <el-form-item label="执行人" prop="selectedOptions">
                <el-cascader :options="options" filterable change-on-select v-model="selectedOptions" :show-all-levels="false" @change="managerChange" :props="props"></el-cascader>
                <el-select v-model="dataForm.userId" placeholder="请选择人员" @change="selectGet">
                    <el-option v-for="item in userList" :key="item.userId" :label="item.realName" :value="item.userId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="备注" prop="remark"> <el-input v-model="dataForm.remark" type="textarea" placeholder="备注"></el-input> </el-form-item>
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
                departmentName: '',
                realName: '',
                userId: null,
                remark: '',
            },
            taskId: null,
            userList: [], //人员下拉列表
            dataRule: {},
            selectedOptions: [],
            vals: [], //label和value的数组
            options: [],
            props: {
                value: 'departmentId',
                label: 'departmentName',
                children: 'children',
            },
        };
    },
    methods: {
        init(id) {
            this.visible = true;
            this.taskId = id;
            this.$nextTick(() => {
                this.$refs['dataForm'].resetFields();
                this.getDepartment();
            });
        },
        // 部门级联选择器change事件--执行人
        managerChange(val) {
            var id = val[val.length - 1];
            this.getPersonList(id);
            this.vals = this.getCascaderObj(this.selectedOptions, this.options); //部门的选择的数组
            this.dataForm.departmentName = this.vals[this.vals.length - 1].departmentName;
        },
        // 部门级联选择的时候下拉遍历生产新的value和label的数组
        getCascaderObj(val, opt) {
            return val.map(function(value, index, array) {
                for (var itm of opt) {
                    if (itm.departmentId == value) {
                        opt = itm.children;
                        return itm;
                    }
                }
                return null;
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
        // 查询人员数据--责任人
        getPersonList(id) {
            this.$http({
                url: this.$http.adornUrl('/v1/pm/departments/' + id + '/users/options'),
                method: 'get',
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.userList = data.data.options;
                } else {
                    this.userList = [];
                }
            });
        },
        // 获取人员id和人员name
        selectGet(value) {
            let obj = {};
            obj = this.userList.find(item => {
                //这里的userList就是上面遍历的数据源
                return item.userId === value; //筛选出匹配数据
            });
            this.dataForm.realName = obj.realName;
            this.dataForm.userId = obj.userId;
        },
        // 表单提交
        dataFormSubmit() {
            this.$refs['dataForm'].validate(valid => {
                if (valid) {
                    this.$http({
                        url: this.$http.adornUrl('/v1/pm/check/tasks/' + this.taskId + '/assistants'),
                        method: 'post',
                        data: this.$http.adornData({
                            departmentName: this.dataForm.departmentName,
                            realName: this.dataForm.realName,
                            userId: this.dataForm.userId,
                            remark: this.dataForm.remark,
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
            });
        },
    },
};
</script>
<style lang="scss" scoped></style>
