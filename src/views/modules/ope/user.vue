<template>
    <div class="mod-user">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataListFun()" size="small">
            <el-form-item label="认证状态:">
                <el-select v-model="dataForm.status" placeholder="认证状态"> <el-option v-for="item in isAuthlist" :key="item.value" :label="item.label" :value="item.value"></el-option> </el-select>
            </el-form-item>
            <el-form-item v-if="isAuth('userCardAuth')" key="userCardAuth3" label="认证类型:">
                <el-select v-model="dataForm.authType" placeholder="认证类型">
                    <el-option v-for="item in authTypelist" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="性别:" class="ml10">
                <el-select v-model="dataForm.gender" placeholder="性别"> <el-option v-for="item in genderlist" :key="item.value" :label="item.label" :value="item.value"></el-option> </el-select>
            </el-form-item>
            <el-form-item label="注册类型:" class="ml10">
                <el-select v-model="dataForm.regeditType"> <el-option v-for="item in regeditTypelist" :key="item.value" :label="item.label" :value="item.value"></el-option> </el-select>
            </el-form-item>
            <el-form-item> <el-input v-model="dataForm.companyName" placeholder="企业名称" clearable></el-input> </el-form-item>
            <el-form-item> <el-input v-model="dataForm.departmentName" placeholder="部门名称" clearable></el-input> </el-form-item>
            <el-form-item> <el-input v-model="dataForm.realname" placeholder="姓名" clearable></el-input> </el-form-item>
            <el-form-item> <el-input v-model="dataForm.phone" placeholder="手机号" clearable></el-input> </el-form-item>
            <el-form-item>
                <el-button type="primary" v-if="isAuth('user:users:page')" @click="getDataListFun()">查询</el-button>
                <el-button type="success" v-if="isAuth('user:users:save')" @click="userAdd()">人工注册</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
            <el-table-column type="index" header-align="center" align="center" width="50" label="序号"> </el-table-column>
            <el-table-column prop="realname" header-align="center" align="center" label="姓名"> </el-table-column>
            <el-table-column prop="nickname" header-align="center" align="center" label="昵称"> </el-table-column>
            <el-table-column :formatter="authType" header-align="center" align="center" v-if="isAuth('userCardAuth')" key="userCardAuth" label="证件类型"> </el-table-column>
            <el-table-column header-align="center" v-if="isAuth('userCardAuth')" key="userCardAuth2" align="center" width="160" label="证件图片">
                <template slot-scope="scope">
                    <span v-if="scope.row.authType == 1 || scope.row.authType == 2" v-for="(item, index) in scope.row.authImg" :key="index" class="ml10">
                        <el-popover placement="right" trigger="click">
                            <img :src="item" style="max-width:720px;max-height:600px;" /> <img slot="reference" :src="item" style="width:50px;height:50px;" />
                        </el-popover>
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="phone" header-align="center" v-if="isAuth('userPhoneAuth')" key="userPhoneAuth" align="center" label="手机号"> </el-table-column>
            <el-table-column prop="gender" :formatter="formatType" header-align="center" align="center" label="性别"> </el-table-column>
            <el-table-column header-align="center" align="center" width="260" :show-overflow-tooltip="true" label="公司名称">
                <template slot-scope="scope">
                    <p style="text-align:center;margin:0;">
                        <span class="mr10" v-for="item in scope.row.companyList" :key="item.companyId">{{ item.name }}</span>
                    </p>
                </template>
            </el-table-column>
            <el-table-column prop="status" :formatter="formatAuth" header-align="center" align="center" label="认证状态"> </el-table-column>
            <el-table-column :formatter="regeditType" header-align="center" align="center" label="注册类型"> </el-table-column>
            <el-table-column prop="createdAt" :formatter="createdAt" header-align="center" align="center" width="140" label="注册时间"> </el-table-column>
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
        <!-- 弹窗, 新增 / 修改 -->
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    </div>
</template>

<script>
import AddOrUpdate from './user-add-or-update';
import commonFunc from '@/assets/common.js';
export default {
    data() {
        return {
            dataForm: {
                status: null,
                authType: null,
                realname: '',
                gender: null,
                phone: '',
                companyName: '',
                departmentName: '',
                regeditType: null,
            },
            authTypelist: [{value: null, label: '全部'}, {value: 1, label: '身份证认证'}, {value: 2, label: '名片认证'}],
            isAuthlist: [{value: null, label: '全部'}, {value: 1, label: '正常'}, {value: 2, label: '禁用'}], //是否认证列表
            genderlist: [{value: null, label: '全部'}, {value: 1, label: '男'}, {value: 2, label: '女'}, {value: 3, label: '未填'}],
            regeditTypelist: [{value: null, label: '全部'}, {value: 1, label: 'APP注册'}, {value: 2, label: '人工注册'}],
            dataList: [],
            pageIndex: 1,
            pageSize: 10,
            totalPage: 0,
            dataListLoading: false,
            // detailDialog:false,
            dataListSelections: [],
            addOrUpdateVisible: false,
        };
    },
    components: {
        AddOrUpdate,
    },
    activated() {
        this.getDataList();
    },
    methods: {
        // 查询按钮
        getDataListFun() {
            this.pageIndex = 1;
            this.getDataList();
        },
        // 获取数据列表
        getDataList() {
            this.dataListLoading = true;
            this.$http({
                url: this.$http.adornUrl('/v1/user/users'),
                method: 'get',
                params: this.$http.adornParams({
                    pageNum: this.pageIndex,
                    pageSize: this.pageSize,
                    status: this.dataForm.status,
                    realname: this.dataForm.realname,
                    gender: this.dataForm.gender,
                    phone: this.dataForm.phone,
                    authType: this.dataForm.authType,
                    regeditType: this.dataForm.regeditType,
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
        userAdd(id) {
            this.addOrUpdateVisible = true;
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init(id);
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
        regeditType(item) {
            switch (item.regeditType) {
                case 1:
                    return 'APP注册';
                    break;
                case 2:
                    return '人工注册';
                    break;
            }
        },
        createdAt(item) {
            return commonFunc.commonFunc(item.createdAt);
        },
    },
};
</script>
