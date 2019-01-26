<template>
    <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px" size="small">
            <el-form-item label="部门名称" prop="departmentName"> <el-input v-model="dataForm.departmentName"></el-input> </el-form-item>
            <el-form-item label="上级部门" prop="selectedOptions">
                <div v-if="!dataForm.id">
                    <el-cascader :options="options" filterable change-on-select v-model="dataForm.selectedOptions" @change="changeId" :show-all-levels="false" :props="props" clearable></el-cascader>
                </div>
                <div v-if="dataForm.id">
                    <el-popover ref="menuListPopover" placement="bottom-start" trigger="click">
                        <el-cascader :options="options" filterable change-on-select v-model="dataForm.selectedOptions" @change="changeId" :show-all-levels="false" :props="props" clearable></el-cascader>
                    </el-popover>
                    <el-input v-model="dataForm.parentName" v-popover:menuListPopover :readonly="true" placeholder="点击选择上级部门" class="menu-list__input" clearable></el-input>
                </div>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="visible = false">取消</el-button>
            <el-button size="small" type="primary" @click="dataFormSubmit()">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import {treeDataTranslate} from '@/utils';
import Icon from '@/icons';
export default {
    data() {
        return {
            visible: false,
            pageNum: 1,
            pageSize: 999,
            dataForm: {
                id: 0,
                departmentName: '',
                selectedOptions: [],
                parentId: '',
                parentName: '',
            },
            dataRule: {
                departmentName: [{required: true, message: '部门名称不能为空', trigger: 'blur'}],
            },
            options: [],
            props: {
                value: 'departmentId',
                label: 'departmentName',
                children: 'children',
            },
        };
    },
    methods: {
        init(obj) {
            if (obj) {
                this.dataForm.id = obj.departmentId;
            } else {
                this.dataForm.id = 0;
            }
            this.$http({
                url: this.$http.adornUrl('/v1/user/departments'),
                method: 'get',
            })
                .then(({data}) => {
                    this.options = treeDataTranslate(data.data.departments, 'departmentId');
                })
                .then(() => {
                    this.visible = true;
                    this.$nextTick(() => {
                        this.$refs['dataForm'].resetFields();
                        this.dataForm.parentId="";
                        this.dataForm.userId="";
                    });
                })
                .then(() => {
                    if (this.dataForm.id) {
                        // 修改
                        this.dataForm.parentId = obj.parentId;
                        this.dataForm.departmentName = obj.departmentName;
                        this.dataForm.parentName = obj.parentName;
                    }
                });
        },
        // el-cascader  选择器change事件
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
        changeId(value) {
            if(!value.length){
                this.dataForm.parentName = '';
                this.dataForm.parentId = '';
            }else{
                this.vals = this.getCascaderObj(this.dataForm.selectedOptions, this.options);
                this.dataForm.parentName = this.vals[this.vals.length - 1].departmentName;
                this.dataForm.parentId = this.vals[this.vals.length - 1].departmentId;
            }
        },
        // 表单提交
        dataFormSubmit() {
            this.$refs['dataForm'].validate(valid => {
                if (valid) {
                    if (this.dataForm.id && this.dataForm.parentName) {
                        if (this.dataForm.id == this.dataForm.parentId) {
                            this.$message.error('上级部门和当前部门不能重复');
                            return false;
                        }
                    }
                    this.$http({
                        url: this.$http.adornUrl(this.dataForm.id == 0 ? `/v1/user/departments` : `/v1/user/departments/` + this.dataForm.id),
                        method: this.dataForm.id == 0 ? 'post' : 'put',
                        data: this.$http.adornData({
                            departmentName: this.dataForm.departmentName,
                            parentId: (this.dataForm.parentName) ? this.dataForm.parentId : 0,
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
