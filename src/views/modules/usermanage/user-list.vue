<template>
    <el-dialog :visible.sync="visable" @close="closeDialog">
        <el-form :model="dataForm" ref="dataForm" :inline="true" @keyup.enter.native="getDataList()" size="small">
            <el-form-item prop="phone" class="deviceSn"> <el-input v-model="dataForm.phone" placeholder="手机号" clearable></el-input> </el-form-item>
            <el-form-item prop="realname"> <el-input v-model="dataForm.realname" placeholder="姓名" clearable></el-input> </el-form-item>
            <el-form-item>
                <el-button size="mini" type="primary" @click="getDataList()">查询</el-button>
                <el-button size="mini" type="success" @click="visable = false">关闭</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="dataList" border style="width: 100%;">
            <el-table-column type="index" header-align="center" align="center" width="50" label="序号"> </el-table-column>
            <el-table-column prop="realname" header-align="center" align="center" label="姓名"> </el-table-column>
            <el-table-column prop="nickname" header-align="center" align="center" label="昵称"> </el-table-column>
            <el-table-column prop="phone" header-align="center" align="center" label="手机号"> </el-table-column>
            <el-table-column prop="gender" header-align="center" align="center" :formatter="gender" label="性别"> </el-table-column>
            <el-table-column header-align="center" align="center" width="260" :show-overflow-tooltip="true" label="公司名称">
                <template slot-scope="scope">
                    <p style="text-align:center;margin:0;">
                        <span class="mr10" v-for="item in scope.row.companyList" :key="item.companyId">{{ item.name }}</span>
                    </p>
                </template>
            </el-table-column>
            <el-table-column header-align="center" align="center" width="100" label="操作">
                <template slot-scope="scope">
                    <el-button type="danger" plain size="mini" @click="add(scope.row.userId)">同步</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="pageIndex"
            :page-size="pageSize"
            :total="totalPage"
            layout="total, prev, pager, next, jumper"
        >
        </el-pagination>
        <!-- 弹窗, 同步账号（新增） -->
        <useradd v-if="userAddVisible" ref="userAdd" @refreshDataList="getDataList"></useradd>
    </el-dialog>
</template>

<script>
import commonFunc from '@/assets/common.js';
import useradd from './user-add';
export default {
    data() {
        return {
            dataList: [], //用户列表的数据
            dataForm: {
                phone: '',
                realname: '',
            },
            pageIndex: 1,
            pageSize: 5,
            totalPage: 0,
            visable: false,
            userAddVisible: false,
        };
    },
    components: {
        useradd,
    },
    methods: {
        init() {
            this.visable = true;
            this.getDataList();
        },
        getDataList() {
            this.$http({
                url: this.$http.adornUrl('/v1/user/users'),
                method: 'get',
                params: this.$http.adornParams({
                    pageNum: this.pageIndex,
                    pageSize: this.pageSize,
                    phone: this.dataForm.phone,
                    realname: this.dataForm.realname,
                }),
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.dataList = data.data.list;
                    this.totalPage = data.data.total;
                }
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
        // 添加
        add(id) {
            this.userAddVisible = true;
            this.$nextTick(() => {
                this.$refs.userAdd.init(id);
            });
        },
        // 弹窗关闭
        closeDialog() {
            this.$emit('refreshDataList');
        },
        gender(item) {
            switch (item.gender) {
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
    },
};
</script>
