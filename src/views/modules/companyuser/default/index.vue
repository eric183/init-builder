<template>
    <div class="mod-user">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataListFun()" size="small">
            <el-form-item> <el-input v-model="dataForm.companyName" placeholder="公司名称" clearable></el-input> </el-form-item>
            <el-form-item> <el-input v-model="dataForm.departmentName" placeholder="部门名称" clearable></el-input> </el-form-item>
            <el-form-item> <el-input v-model="dataForm.realName" placeholder="姓名" clearable></el-input> </el-form-item>
            <el-form-item> <el-input v-model="dataForm.phone" placeholder="手机号" clearable></el-input> </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getDataListFun()">查询</el-button>
                <el-button type="success" @click="batch()">批量操作通讯录</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChange" style="width: 100%;">
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column type="index" header-align="center" align="center" width="50" label="序号"> </el-table-column>
            <el-table-column prop="realName" header-align="center" align="center" label="姓名"> </el-table-column>
            <el-table-column prop="nickname" header-align="center" align="center" label="昵称"> </el-table-column>
            <el-table-column prop="phone" header-align="center" v-if="isAuth('comPhoneAuth')" key="comPhoneAuth" align="center" label="手机号"> </el-table-column>
            <el-table-column :formatter="authType" header-align="center" align="center" v-if="isAuth('comCardAuth')" key="comCardAuth" label="证件类型"> </el-table-column>
            <el-table-column header-align="center" align="center" v-if="isAuth('comCardAuth')" key="comCardAuth2" width="160" label="证件图片">
                <template slot-scope="scope">
                    <span v-if="scope.row.authType == 1 || scope.row.authType == 2" v-for="(item, index) in scope.row.authImg" :key="index" class="ml10">
                        <el-popover placement="right" trigger="click">
                            <img :src="item" style="max-width:720px;max-height:600px;" /> <img slot="reference" :src="item" style="width:50px;height:50px;" />
                        </el-popover>
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="gender" :formatter="formatType" header-align="center" align="center" label="性别"> </el-table-column>
            <el-table-column prop="departmentName" header-align="center" align="center" label="部门"> </el-table-column>
            <el-table-column prop="position" header-align="center" align="center" label="职务"> </el-table-column>
            <el-table-column prop="employeeNo" header-align="center" align="center" label="工号"> </el-table-column>
            <el-table-column prop="isHiddenContact" header-align="center" align="center" width="130" label="通讯录">
                <template slot-scope="scope">
                    <el-switch :width="35" v-model="scope.row.isHiddenContact" @change="changeFun(scope.row)" active-text="启用" :active-value="0" inactive-text="隐藏" :inactive-value="1">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column header-align="center" prop="companyName" align="center" width="260" :show-overflow-tooltip="true" label="公司名称"> </el-table-column>
            <el-table-column header-align="center" prop="departmentName" align="center" label="部门名称"> </el-table-column>
            <el-table-column prop="registerTime" :formatter="registerTime" header-align="center" align="center" width="140" label="注册时间"> </el-table-column>
            <el-table-column header-align="center" align="center" v-if="isAuth('user:departments:getDepartments')" width="100" label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" plain size="mini" @click="editPerson(scope.row)">编辑人员</el-button>
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
        <edit-companyuser @reshData="getDataList" ref="companyRef" v-if="companyLoad"></edit-companyuser>
    </div>
</template>

<script>
import {commonFunc} from '@/utils/resources/index.js';
import editCompanyuser from './editCompanyuser';
export default {
    components: {
        editCompanyuser,
    },
    data() {
        return {
            dataForm: {
                realName: '',
                phone: '',
                companyName: '',
                departmentName: '',
            },
            dataList: [],
            selectList: [], //多选的数组
            pageIndex: 1,
            pageSize: 10,
            totalPage: 0,
            dataListLoading: false,
            companyLoad: false,
        };
    },
    activated() {
        this.selectList = [];
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
                url: this.$http.adornUrl('/v1/user/companys/employees'),
                method: 'get',
                params: this.$http.adornParams({
                    pageNum: this.pageIndex,
                    pageSize: this.pageSize,
                    realName: this.dataForm.realName,
                    phone: this.dataForm.phone,
                    companyName: this.dataForm.companyName,
                    departmentName: this.dataForm.departmentName,
                }),
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.dataList = data.data.list;
                    this.totalPage = data.data.total;
                    // 后端返回的图片字符串转换成数组
                    for (var i in this.dataList) {
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
        // 编辑人员信息
        editPerson(obj) {
            this.companyLoad = true;
            this.$nextTick(() => {
                this.$refs.companyRef.init(obj);
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
        //修改通讯录
        changeFun(val) {
            this.$http({
                url: this.$http.adornUrl('/v1/user/users'),
                method: 'put',
                data: this.$http.adornData({
                    isHiddenContact: val.isHiddenContact,
                    userId: val.userId,
                }),
            }).then(({data}) => {
                if (data && data.code === 201) {
                    this.$message.success('修改成功');
                    this.getDataList();
                }
            });
        },
        selectionChange(value) {
            this.selectList = value;
        },
        // 批量操作通讯录
        batch() {
            if (!this.selectList.length) {
                this.$message.error('请勾选人员');
                return false;
            }
            let newList = [];
            this.selectList.map(obj => {
                newList.push(obj.userId);
            });
            this.$confirm(`请选择启用或者隐藏通讯录?`, '提示', {
                confirmButtonText: '启用',
                cancelButtonText: '隐藏',
                type: 'warning',
            })
                .then(() => {
                    this.batchContact(newList, 0);
                })
                .catch(() => {
                    this.batchContact(newList, 1);
                });
        },
        // 批量操作通讯录
        batchContact(userIds, isHiddenContact) {
            this.$http({
                url: this.$http.adornUrl('/v1/user/contacts/switch'),
                method: 'put',
                data: this.$http.adornData({
                    isHiddenContact: isHiddenContact,
                    userIds: userIds,
                }),
            }).then(({data}) => {
                if (data && data.code === 201) {
                    this.$message.success('修改成功');
                    this.getDataList();
                }
            });
        },
        // 后端返回的数字，转换成中文
        formatType(row, column) {
            switch (row.gender) {
                case 1:
                    return '男';
                    break;
                case 2:
                    return '女';
                    break;
                case 3:
                    return '未填';
                    break;
            }
        },
        formatAuth(row, column) {
            switch (row.status) {
                case 1:
                    return '正常';
                    break;
                case 0:
                    return '禁用';
                    break;
            }
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
        registerTime(item) {
            return commonFunc(item.registerTime);
        },
    },
};
</script>
