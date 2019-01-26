<template>
    <el-row>
        <!-- 食堂人员列表 -->
        <el-row class="textright"> <el-button type="primary" size="small" @click="addPerson">新增</el-button> </el-row>
        <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
            <el-table-column type="index" header-align="center" align="center" width="50" label="序号"></el-table-column>
            <el-table-column prop="realname" header-align="center" align="center" label="姓名"></el-table-column>
            <el-table-column :formatter="genderType" header-align="center" align="center" label="性别"></el-table-column>
            <el-table-column prop="phone" header-align="center" align="center" label="手机号"></el-table-column>
            <el-table-column prop="departmentName" header-align="center" align="center" label="部门"></el-table-column>
            <el-table-column prop="employeeNo" header-align="center" align="center" label="工号"></el-table-column>
            <el-table-column :formatter="registerTime" header-align="center" align="center" label="注册时间"></el-table-column>
            <el-table-column header-align="center" align="center" label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" plain size="mini" @click="deleteHandle(scope.row.id)">移除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="pageNum"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
        <company-user-dialog v-if="addPersonLoading" ref="addPerson" @refreshDataList="getDataList"></company-user-dialog>
    </el-row>
</template>
<script>
import CompanyUserDialog from './CompanyUserDialog';
import {genderType,commonFunc} from '@/utils/resources/index.js';
export default {
    components: {
        CompanyUserDialog,
    },
    data() {
        return {
            dataListLoading: false,
            dataList: [],
            addPersonLoading: false,
            pageNum: 1,
            pageSize: 10,
            total: 0,
        };
    },
    methods: {
        getDataList() {
            this.dataListLoading = true;
            this.$http({
                url: this.$http.adornUrl('/v1/customized/canteenEmployees'),
                method: 'get',
                params: this.$http.adornParams({
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                }),
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.dataList = data.data.list;
                    this.total = data.data.total;
                }
                this.dataListLoading = false;
            });
        },
        // 每页数
        sizeChangeHandle(val) {
            this.pageSize = val;
            this.pageNum = 1;
            this.getDataList();
        },
        // 当前页
        currentChangeHandle(val) {
            this.pageNum = val;
            this.getDataList();
        },
        addPerson() {
            this.addPersonLoading = true;
            this.$nextTick(() => {
                this.$refs.addPerson.init();
            });
        },
        // 移除
        deleteHandle(id) {
            this.$confirm(`确定进行移除?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    this.$http({
                        url: this.$http.adornUrl('/v1/customized/canteenEmployees'),
                        method: 'delete',
                        data: this.$http.adornData({
                            id: id,
                        }),
                    }).then(({data}) => {
                        this.getDataList();
                    });
                })
                .catch(() => {});
        },
        genderType(item) {
            return genderType(item.gender);
        },
        registerTime(item) {
            return commonFunc(item.registerTime);
        },
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.getDataList();
        });
    },
};
</script>
