<template>
    <div class="mod-user">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataListFun()" size="small">
            <el-form-item> <el-input v-model="dataForm.companyName" placeholder="企业名称" clearable></el-input> </el-form-item>
            <el-form-item> <el-input v-model="dataForm.userName" placeholder="姓名" clearable></el-input> </el-form-item>
            <el-form-item> <el-input v-model="dataForm.phone" placeholder="手机号" clearable></el-input> </el-form-item>
            <el-form-item> <el-button type="primary" v-if="isAuth('user:companyUserRel:page')" @click="getDataListFun()">查询</el-button> </el-form-item>
        </el-form>
        <el-tabs type="card" @tab-click="tabClick">
            <el-tab-pane label="待认证"></el-tab-pane>
            <el-tab-pane label="已同意"></el-tab-pane>
            <el-tab-pane label="已拒绝"></el-tab-pane>
            <el-tab-pane label="已离职"></el-tab-pane>
        </el-tabs>
        <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
            <el-table-column type="index" header-align="center" align="center" width="50" label="序号"> </el-table-column>
            <el-table-column prop="userName" header-align="center" align="center" min-width="70" label="姓名"> </el-table-column>
            <el-table-column :formatter="authType" v-if="isAuth('busCardAuth')" key="busCardAuth" header-align="center" align="center" label="证件类型"> </el-table-column>
            <el-table-column header-align="center" align="center" v-if="isAuth('busCardAuth')" key="busCardAuth2" width="160" label="证件图片">
                <template slot-scope="scope">
                    <span v-if="scope.row.authType == 1 || scope.row.authType == 2" v-for="(item, index) in scope.row.authImg" :key="index" class="ml10">
                        <el-popover placement="right" trigger="click">
                            <img :src="item" style="max-width:720px;max-height:600px;" /> <img slot="reference" :src="item" style="width:50px;height:50px;" />
                        </el-popover>
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="phone" header-align="center" v-if="isAuth('busPhoneAuth')" key="busPhoneAuth" align="center" min-width="90" label="手机号"> </el-table-column>
            <el-table-column prop="companyName" header-align="center" align="center" min-width="200" :show-overflow-tooltip="true" label="公司名称"> </el-table-column>
            <el-table-column v-if="dataForm.isAuthAccess == 1" key="createdAt" prop="createdAt" header-align="center" align="center" width="140" :formatter="createdAt" label="提交时间">
            </el-table-column>
            <el-table-column prop="updatedAt" v-if="dataForm.isAuthAccess != 1" key="updatedAt" :formatter="updatedAt" header-align="center" align="center" width="140" label="审核时间">
            </el-table-column>
            <el-table-column v-if="dataForm.isAuthAccess != 1" prop="authName" key="authName" header-align="center" align="center" label="审核人"> </el-table-column>
            <el-table-column v-if="dataForm.isAuthAccess != 1" prop="authPhone" key="authPhone" header-align="center" align="center" width="110" label="审核人联系方式"> </el-table-column>
            <el-table-column v-if="dataForm.isAuthAccess == 1 || dataForm.isAuthAccess == 2" key="btn" header-align="center" align="center" width="150" label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" v-if="isAuth('user:companyUserRel:update') && dataForm.isAuthAccess == 1" plain size="mini" @click="agree(scope.row.id)">同意</el-button>
                    <el-button type="danger" v-if="isAuth('user:companyUserRel:update') && dataForm.isAuthAccess == 1" plain size="mini" @click="refuse(scope.row.id)">拒绝</el-button>
                    <el-button type="danger" v-if="isAuth('user:companyUserRel:update') && dataForm.isAuthAccess == 2" plain size="mini" @click="cancel(scope.row.id)">取消</el-button>
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
    </div>
</template>

<script>
import commonFunc from '@/assets/common.js';
export default {
    data() {
        return {
            dataForm: {
                userName: '',
                account: '',
                isAuthAccess: 1, //默认显示第一个待认证的数据列表
                companyName: '',
            },
            dataListLoading: false,
            dataList: [],
            pageIndex: 1,
            pageSize: 10,
            totalPage: 0,
            isAuthAccess: 1,
        };
    },
    activated() {
        this.getDataList();
    },
    methods: {
        getDataListFun() {
            this.pageIndex = 1;
            this.getDataList();
        },
        // 获取数据列表
        getDataList() {
            this.dataListLoading = true;
            this.$http({
                url: this.$http.adornUrl('/v1/user/companyUserRel'),
                method: 'get',
                params: this.$http.adornParams({
                    pageNum: this.pageIndex,
                    pageSize: this.pageSize,
                    userName: this.dataForm.userName,
                    phone: this.dataForm.phone,
                    status: this.dataForm.isAuthAccess,
                    companyName: this.dataForm.companyName,
                }),
            }).then(({data}) => {
                if (data && data.code === 200) {
                    // console.log(data);
                    this.dataList = data.data.list;
                    this.totalPage = data.data.total;
                    // 后端返回的图片字符串转换成数组
                    for (var i in this.dataList) {
                        if (this.dataList[i].authImg == null) {
                            this.dataList[i].authImg = '';
                        }
                        if (this.dataList[i].authImg.indexOf(',') != -1) {
                            this.dataList[i].authImg = this.dataList[i].authImg.split(',');
                        } else {
                            var list = [];
                            list.push(this.dataList[i].authImg);
                            this.dataList[i].authImg = list;
                        }
                    }
                } else {
                    this.dataList = [];
                    this.totalPage = 0;
                }
                this.dataListLoading = false;
            });
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
        // 点击tab切换
        tabClick(tab) {
            this.dataForm.isAuthAccess = tab.index * 1 + 1; //(tab.index 是点击待认证列表这几个选项的下标)
            this.pageIndex = 1;
            this.pageSize = 10;
            this.getDataList();
        },
        // 同意
        agree(id) {
            var list = [];
            list.push(id);
            this.$http({
                url: this.$http.adornUrl('/v1/user/companyUserRel'),
                method: 'put',
                data: this.$http.adornData({
                    status: 2,
                    ids: list,
                }),
            }).then(({data}) => {
                if (data && data.code === 201) {
                    this.getDataList();
                    this.$message({
                        message: '操作成功',
                        type: 'success',
                        duration: 1500,
                    });
                }
            });
        },
        // 拒绝
        refuse(id) {
            var list = [];
            list.push(id);
            this.$confirm('此操作将拒绝该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                this.$http({
                    url: this.$http.adornUrl('/v1/user/companyUserRel'),
                    method: 'put',
                    data: this.$http.adornData({
                        status: 3,
                        ids: list,
                    }),
                }).then(({data}) => {
                    if (data && data.code === 201) {
                        this.getDataList();
                        this.$message({
                            message: '操作成功',
                            type: 'success',
                            duration: 1500,
                        });
                    }
                });
            });
        },
        // 取消认证
        cancel(id) {
            var list = [];
            list.push(id);
            this.$confirm('是否取消认证?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    this.$http({
                        url: this.$http.adornUrl('/v1/user/companyUserRel'),
                        method: 'put',
                        data: this.$http.adornData({
                            status: 4,
                            ids: list,
                        }),
                    }).then(({data}) => {
                        if (data && data.code === 201) {
                            this.getDataList();
                            this.$message({
                                message: '操作成功',
                                type: 'success',
                                duration: 1500,
                            });
                        }
                    });
                })
                .catch(() => {});
        },
        createdAt(item) {
            return commonFunc.commonFunc(item.createdAt);
        },
        updatedAt(item) {
            return commonFunc.commonFunc(item.createdAt);
        },
        // 证件类型
        authType(item) {
            switch (item.authType) {
                case 1:
                    return '身份认证';
                    break;
                case 2:
                    return '名片认证';
                    break;
                default:
                    return '未认证';
                    break;
            }
        },
    },
};
</script>
<style>
.el-tabs__item {
    color: #606266;
    font-size: 12px;
}
</style>
