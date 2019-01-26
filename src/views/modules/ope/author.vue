<template>
    <div class="mod-user">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataListFun()" size="small">
            <el-form-item label="门禁:">
                <el-select v-model="dataForm.isAccessEnabled" placeholder="门禁二维码授权状态">
                    <el-option v-for="item in isAuthlist" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="用户:" class="ml10">
                <el-select v-model="dataForm.type" placeholder="用户授权类型">
                    <el-option v-for="item in userTypelist" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item> <el-input v-model="dataForm.companyName" placeholder="企业名称" clearable></el-input> </el-form-item>
            <el-form-item> <el-input v-model="dataForm.departmentName" placeholder="部门名称" clearable></el-input> </el-form-item>
            <el-form-item> <el-input v-model="dataForm.realname" placeholder="姓名" clearable></el-input> </el-form-item>
            <el-form-item> <el-input v-model="dataForm.phone" placeholder="手机号" clearable></el-input> </el-form-item>
            <el-form-item> <el-button type="primary" v-if="isAuth('user:users:page')" @click="getDataListFun()">查询</el-button> </el-form-item>
        </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
            <el-table-column type="index" header-align="center" align="center" width="50" label="序号"> </el-table-column>
            <el-table-column prop="realname" header-align="center" :show-overflow-tooltip="true" align="center" label="姓名"> </el-table-column>
            <el-table-column prop="phone" v-if="isAuth('phoneAuth')" key="phoneAuth" header-align="center" align="center" label="手机号"> </el-table-column>
            <el-table-column header-align="center" align="center" min-width="160" :show-overflow-tooltip="true" label="公司名称">
                <template slot-scope="scope">
                    <span class="mr10" v-for="item in scope.row.companyList" :key="item.companyId">{{ item.name }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="createdAt" header-align="center" :formatter="createdAt" align="center" min-width="100" :show-overflow-tooltip="true" label="注册时间"> </el-table-column>
            <el-table-column header-align="center" align="center" min-width="100" label="设备组权限">
                <template slot-scope="scope">
                    <!-- <span @click="openGroup(scope.row.userId)" class="look">点击查看</span> -->
                    <el-button type="primary" v-if="isAuth('user:users:userDeviceGroup')" plain size="mini" @click="openGroup(scope.row.userId)">查看</el-button>
                </template>
            </el-table-column>
            <el-table-column header-align="center" align="center" width="140" label="二维码门禁权限">
                <template slot-scope="scope">
                    <el-switch
                        :width="35"
                        :disabled="!isAuth('user:users:update')"
                        @change="isActiveChange(scope.row.userId, scope.row.isAccessEnabled)"
                        v-model="scope.row.isAccessEnabled"
                        active-text="启用"
                        :active-value="1"
                        inactive-text="禁用"
                        :inactive-value="0"
                    >
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column min-width="100" header-align="center" align="center" label="用户授权类型">
                <template slot-scope="scope">
                    <button class="authUser" :disabled="!isAuth('user:users:up')" size="mini" @click="switcUserType(scope.row.type, 0, scope.row.userId)" :class="{active: scope.row.type == 0}">
                        普通
                    </button>
                    <button class="authUser" :disabled="!isAuth('user:users:up')" size="mini" @click="switcUserType(scope.row.type, 1, scope.row.userId)" :class="{active: scope.row.type == 1}">
                        VIP
                    </button>
                    <!-- <span class="authUser" v-if="isAuth('user:users:update')" size="mini" @click="switcUserType(scope.row.type,3,scope.row.userId)" :class="{active:scope.row.type==3}">SVIP</span> -->
                </template>
            </el-table-column>
            <el-table-column header-align="center" align="center" min-width="100" label="操作">
                <template slot-scope="scope">
                    <!-- <el-button type="primary" plain size="mini" @click="openSearchAuthor(scope.row.userId)">查看授权</el-button> -->
                    <el-button type="success" v-if="isAuth('user:users:noUserDeviceGroup')" plain size="mini" @click="openAddGroup(scope.row.userId)">添加设备组</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="pageIndex"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            :total="totalPage"
            layout="total, sizes, prev, pager, next, jumper"
        >
        </el-pagination>
        <!---查看用户下的设备组权限 -->
        <el-dialog :visible.sync="userGroupDialog" title="用户设备分组权限列表">
            <el-table :data="userGroupData" style="width: 100%">
                <el-table-column type="index" label="序号"> </el-table-column>
                <el-table-column prop="name" header-align="center" align="center" label="设备分组名称"> </el-table-column>
                <el-table-column prop="type" header-align="center" align="center" :formatter="type" label="设备组类型"> </el-table-column>
                <el-table-column prop="status" :formatter="status" header-align="center" align="center" label="状态"> </el-table-column>
                <el-table-column fixed="right" label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="removeGroup(scope.row.groupId)">移除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
        <!---添加更多设备组授权 -->
        <el-dialog :visible.sync="addGroupDialog" title="添加更多设备组授权">
            <el-table :data="userMoreGroupData" style="width: 100%">
                <el-table-column type="index" label="序号"> </el-table-column>
                <el-table-column prop="name" header-align="center" align="center" label="设备分组名称"> </el-table-column>
                <el-table-column prop="type" header-align="center" align="center" :formatter="type" label="设备组类型"> </el-table-column>
                <el-table-column prop="status" :formatter="status" header-align="center" align="center" label="状态"> </el-table-column>
                <el-table-column fixed="right" label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="addGroup(scope.row.groupId)">添加</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
        <!---查看授权记录 -->
        <el-dialog :visible.sync="searchAuthorDialog" title="查看授权记录">
            <el-table :data="searchAuthorData" style="width: 100%">
                <el-table-column type="index" label="序号"> </el-table-column>
                <el-table-column prop="title" label="授权操作"> </el-table-column>
                <el-table-column prop="createTime" label="时间"> </el-table-column>
                <el-table-column prop="createBy" label="操作人"> </el-table-column>
                <el-table-column prop="" label="操作人手机号"> </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
import commonFunc from '@/assets/common.js';
export default {
    data() {
        return {
            dataForm: {
                realname: '',
                phone: '',
                type: null,
                isAccessEnabled: null,
                companyName: '',
                departmentName: '',
            },
            dataList: [],
            pageIndex: 1,
            pageSize: 10,
            totalPage: 0,
            userId: 1, //对该用户操作时存起来的用户id
            dataListLoading: false,
            userGroupDialog: false, //查看用户的所有设备组权限弹框
            addGroupDialog: false, //添加更多设备组授权弹框
            searchAuthorDialog: false, //查看授权记录弹框
            userGroupData: [], //用户下的设备分组的数据
            userMoreGroupData: [], //添加更多设备组授权数据
            searchAuthorData: [], //查看授权记录的数据
            dataListSelections: [],
            addOrUpdateVisible: false,
            // 用户授权类型
            userTypelist: [{value: 0, label: '普通'}, {value: 1, label: 'VIP'}, {value: null, label: '全部'}],
            // 二维码授权状态
            isAuthlist: [{value: null, label: '全部'}, {value: 1, label: '启用'}, {value: 0, label: '禁用'}],
        };
    },
    activated() {
        this.getDataList();
    },
    methods: {
        // 获取数据列表
        getDataList() {
            this.dataListLoading = true;
            this.$http({
                url: this.$http.adornUrl('/v1/user/users'),
                method: 'get',
                params: this.$http.adornParams({
                    pageNum: this.pageIndex,
                    pageSize: this.pageSize,
                    realname: this.dataForm.realname,
                    phone: this.dataForm.phone,
                    isAccessEnabled: this.dataForm.isAccessEnabled,
                    type: this.dataForm.type,
                    companyName: this.dataForm.companyName,
                    departmentName: this.dataForm.departmentName,
                    companyAuth: 1, //1表示不获取未认证用户
                }),
            }).then(({data}) => {
                if (data && data.code === 200) {
                    //console.log(data);
                    this.dataList = data.data.list;
                    this.totalPage = data.data.total;
                } else {
                    this.dataList = [];
                    this.totalPage = 0;
                }
                this.dataListLoading = false;
            });
        },
        getDataListFun() {
            this.pageIndex = 1;
            this.getDataList();
        },
        // 每页数
        sizeChangeHandle(val) {
            this.pageSize = val;
            this.pageIndex = 1;
            this.getDataList();
        },
        // 当前页
        currentChangeHandle(val) {
            this.pageIndex = val;
            this.getDataList();
        },
        // 多选
        selectionChangeHandle(val) {
            this.dataListSelections = val;
        },
        // 打开用户的设备组权限弹框
        openGroup(userId) {
            this.userId = userId;
            this.getUserGroupDataList();
            this.userGroupDialog = true;
        },
        // 查询该用户设备分组
        getUserGroupDataList() {
            this.$http({
                url: this.$http.adornUrl('/v1/user/users/' + this.userId + '/userDeviceGroup'),
                method: 'get',
                params: this.$http.adornParams({
                    pageNum: 1,
                    pageSize: 9999,
                }),
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.userGroupData = data.data.list;
                } else {
                    this.userGroupData = [];
                }
            });
        },
        // 移除用户与设备分组
        removeGroup(devicegroupId) {
            var list = [];
            list.push(devicegroupId);
            this.$http({
                url: this.$http.adornUrl('/v1/user/users/unBundlingGroup'),
                method: 'put',
                data: this.$http.adornData({
                    userId: this.userId,
                    groupIds: list,
                }),
            }).then(({data}) => {
                if (data && data.code === 201) {
                    this.userGroupDialog = false;
                    this.$message.success('移除成功');
                }
            });
        },
        // 打开添加更多设备组授权的弹框
        openAddGroup(userId) {
            this.userId = userId;
            this.getUserMoreGroupData();
            this.addGroupDialog = true;
        },
        // 查询该用户的设备分组(不包含已认证公司所包含的分组)
        getUserMoreGroupData() {
            this.$http({
                url: this.$http.adornUrl('/v1/user/users/' + this.userId + '/noUserDeviceGroup'),
                method: 'get',
                params: this.$http.adornParams({
                    pageNum: 1,
                    pageSize: 9999,
                }),
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.userMoreGroupData = data.data.list;
                } else {
                    this.userMoreGroupData = [];
                }
            });
        },
        // 添加设备分组
        addGroup(devicegroupId) {
            var list = [];
            list.push(devicegroupId);
            this.$http({
                url: this.$http.adornUrl('/v1/user/users/bundlingGroup'),
                method: 'post',
                data: this.$http.adornData({
                    userId: this.userId,
                    groupIds: list,
                }),
            }).then(({data}) => {
                if (data && data.code === 201) {
                    this.$message.success('添加成功');
                    this.addGroupDialog = false;
                }
            });
        },
        // 打开查看授权记录弹框
        openSearchAuthor(userId) {
            this.userId = userId;
            this.getUserMoreGroupDataList();
            this.searchAuthorDialog = true;
        },
        // 查看授权记录接口
        getUserMoreGroupDataList() {
            this.$http({
                url: this.$http.adornUrl('/v1/baseUser/' + this.userId + '/userLog'),
                method: 'get',
                params: this.$http.adornParams({
                    pageNum: 1,
                    pageSize: 9999,
                }),
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.searchAuthorData = data.page.list;
                } else {
                    this.searchAuthorData = [];
                }
            });
        },
        // 用户认证(二维码门禁授权)
        isActiveChange(userId, isAccessEnabled) {
            this.$http({
                url: this.$http.adornUrl('/v1/user/users'),
                method: 'put',
                data: this.$http.adornData({
                    isAccessEnabled: isAccessEnabled,
                    userId: userId,
                }),
            }).then(({data}) => {
                if (data && data.code === 201) {
                    //console.log("修改成功")
                    this.getDataList();
                } else {
                    //console.log("修改失败")
                }
            });
        },
        //切换用户类型
        switcUserType(type, index, userId) {
            this.$http({
                url: this.$http.adornUrl('/v1/user/users'),
                method: 'put',
                data: this.$http.adornData({
                    userId: userId,
                    type: index,
                }),
            }).then(({data}) => {
                if (data && data.code === 201) {
                    //console.log("修改成功")
                    this.getDataList();
                } else {
                    //console.log("修改失败")
                }
            });
        },
        // 后端返回的数字，转换成中文
        type(row, column) {
            switch (row.type) {
                case 11:
                    return '普通电梯分组';
                    break;
                case 12:
                    return '高级电梯分组';
                    break;
            }
        },
        status(row, column) {
            switch (row.status) {
                case 1:
                    return '启用';
                    break;
                case 2:
                    return '禁用';
                    break;
            }
        },
        createdAt(item) {
            return commonFunc.commonFunc(item.createdAt);
        },
    },
};
</script>
<style scoped>
.mod-user >>> .el-switch__label span {
    color: #999999;
    font-size: 12px !important;
}
.mod-user >>> .el-switch span.is-active span {
    color: #3e8ef7;
}
</style>
