<template>
    <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px" size="small">
            <el-form-item label="角色名称" prop="roleName"> <el-input v-model="dataForm.roleName" placeholder="角色名称"></el-input> </el-form-item>
            <el-form-item label="备注"> <el-input v-model="dataForm.remark" placeholder="备注"></el-input> </el-form-item>
            <el-form-item label="角色类型"> <el-switch v-model="dataForm.roleType" active-text="全部数据" :active-value="1" inactive-text="部分数据" :inactive-value="2"> </el-switch> </el-form-item>
            <el-form-item size="mini" label="授权">
                <el-tree :data="menuList" :props="menuListTreeProps" node-key="menuId" ref="menuListTree" :default-expand-all="true" show-checkbox> </el-tree>
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
export default {
    data() {
        return {
            visible: false,
            menuList: [],
            pageNum: 1,
            pageSize: 9999,
            menuListTreeProps: {
                label: 'name',
                children: 'children',
            },
            dataForm: {
                id: 0,
                roleName: '',
                remark: '',
                roleType: 1,
            },
            dataRule: {
                roleName: [{required: true, message: '角色名称不能为空', trigger: 'blur'}],
            },
            tempKey: -666666, // 临时key, 用于解决tree半选中状态项不能传给后台接口问题. # 待优化
            loginlist: [],
            roleDataList: [{value: 1, label: '全部数据'}, {value: 2, label: '部分数据'}],
        };
    },
    methods: {
        init(id) {
            this.dataForm.id = id || 0;
            // 获取菜单列表
            this.$http({
                url: this.$http.adornUrl('/v1/auth/sysMenus'),
                method: 'get',
                params: this.$http.adornParams({
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                }),
            })
                .then(({data}) => {
                    data = data.data.list;
                    // console.log(data)
                    this.menuList = treeDataTranslate(data, 'menuId');
                    // console.log(this.menuList)
                })
                .then(() => {
                    this.visible = true;
                    this.$nextTick(() => {
                        this.$refs['dataForm'].resetFields();
                        this.$refs.menuListTree.setCheckedKeys([]);
                    });
                })
                .then(() => {
                    if (this.dataForm.id) {
                        this.$http({
                            url: this.$http.adornUrl(`/v1/auth/roles/${this.dataForm.id}`),
                            method: 'get',
                            params: this.$http.adornParams(),
                        }).then(({data}) => {
                            if (data && data.code === 200) {
                                this.dataForm.roleName = data.data.roleName;
                                this.dataForm.remark = data.data.remark;
                                this.dataForm.roleType = data.data.roleType;
                                var idx = data.data.menuIds.indexOf(this.tempKey);
                                if (idx !== -1) {
                                    data.data.menuIds.splice(idx, data.data.menuIds.length - idx);
                                }
                                this.$refs.menuListTree.setCheckedKeys(data.data.menuIds);
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
                        url: this.$http.adornUrl(`/v1/auth/roles`),
                        method: this.dataForm.id == 0 ? 'post' : 'put',
                        data: this.$http.adornData({
                            roleId: this.dataForm.id || undefined,
                            roleName: this.dataForm.roleName,
                            remark: this.dataForm.remark,
                            roleType: this.dataForm.roleType,
                            menuIds: [].concat(this.$refs.menuListTree.getCheckedKeys(), [this.tempKey], this.$refs.menuListTree.getHalfCheckedKeys()),
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
