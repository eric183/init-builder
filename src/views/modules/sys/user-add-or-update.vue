<template>
    <el-dialog :title="'修改'" :close-on-click-modal="false" :visible.sync="visible">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px" size="small">
            <el-form-item label="手机号" prop="phone"> <el-input v-model="dataForm.phone" placeholder="登录帐号" disabled></el-input> </el-form-item>
            <el-form-item label="用户名" prop="realName"> <el-input v-model="dataForm.realName" placeholder="用户名" disabled></el-input> </el-form-item>
            <!-- <el-form-item label="角色" size="mini" prop="role" >
          <el-checkbox v-for="role in roleList" :key="role.roleId" :label="role.roleId" v-model="roleTestList" :checked="checkRoleList.indexOf(role.roleId)!=-1">{{ role.roleName}}</el-checkbox>
      </el-form-item> -->
            <el-form-item label="角色" size="mini" prop="role">
                <el-radio-group v-model="checkRole">
                    <el-radio v-for="role in roleList" :key="role.roleId" :label="role.roleId">{{ role.roleName }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="权限" size="mini" prop="power">
                <el-checkbox v-for="(power, index) in powerList" :key="index" :label="power.powerId" v-model="power.powerId" true-label="1" false-label="0">{{ power.powerName }}</el-checkbox>
            </el-form-item>
            <el-form-item label="状态" size="mini" prop="status">
                <el-radio-group v-model="dataForm.status">
                    <el-radio :label="0">禁用</el-radio>
                    <el-radio :label="1">正常</el-radio>
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
import {isEmail, isMobile} from '@/utils/validate';
export default {
    data() {
        return {
            visible: false,
            roleList: [],
            roleTestList: '',
            checkRole: '',
            checkRoleList: [],
            dataForm: {
                id: 0,
                phone: '',
                realName: '',
                userRoles: [],
                status: 1,
                sysCode: '',
                roleIdList: [],
            },
            powerList: [
                {powerId: 1, powerName: '后台系统'},
                {powerId: 1, powerName: '楼掌门APP'},
                {powerId: 0, powerName: '商家端app'},
                {powerId: 0, powerName: '物管app'},
                {powerId: 0, powerName: '预留'},
                {powerId: 0, powerName: '预留'},
                {powerId: 0, powerName: '预留'},
                {powerId: 0, powerName: '预留'},
            ],
            dataRule: {},
        };
    },
    methods: {
        init(id) {
            this.dataForm.id = id || 0;
            this.$http({
                url: this.$http.adornUrl('/v1/auth/roles'),
                method: 'get',
                params: this.$http.adornParams({
                    pageSize: 50,
                    pageNum: 1,
                }),
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
                            url: this.$http.adornUrl(`/v1/user/users/${this.dataForm.id}/userRole`),
                            method: 'get',
                            params: this.$http.adornParams(),
                        }).then(({data}) => {
                            if (data && data.code === 200) {
                                this.dataForm.userRoles = data.data.userRoles;
                                this.checkRole = this.dataForm.userRoles[0].roleId;
                                this.dataForm.phone = data.data.phone;
                                this.dataForm.realName = data.data.realName;
                                this.dataForm.status = data.data.status;
                                var str = data.data.sysCode;
                                //将后端返回的sysCode码进行反转
                                var newStr = str.split('').reverse();
                                for (let index in newStr) {
                                    this.powerList[index].powerId = newStr[index];
                                }
                            }
                        });
                    }
                });
        },
        // 表单提交
        dataFormSubmit() {
            this.$refs['dataForm'].validate(valid => {
                var list = [];
                for (var i = 0; i < this.powerList.length; i++) {
                    list.push(this.powerList[i].powerId);
                }
                list = list.reverse();
                var str = list.join(''); //点击权限的checkbox，返回的数据，反转成字符串，发给后端
                this.checkRoleList = [];
                this.checkRoleList.push(this.checkRole);
                if (valid) {
                    this.$http({
                        url: this.$http.adornUrl(`/v1/user/users/updatePermission`),
                        method: 'put',
                        data: this.$http.adornData({
                            userId: this.dataForm.id || undefined,
                            sysCode: str,
                            status: this.dataForm.status,
                            roleIds: this.checkRoleList,
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
