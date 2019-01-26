<template>
    <div class="mod-user">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" size="small">
            <el-form-item> <el-input v-model="dataForm.departmentName" placeholder="部门名称" clearable></el-input> </el-form-item>
            <el-form-item> <el-input v-model="dataForm.realName" placeholder="姓名" clearable></el-input> </el-form-item>
            <el-form-item> <el-input v-model="dataForm.phone" placeholder="账号" clearable></el-input> </el-form-item>
            <el-form-item> <el-input v-model="dataForm.idCard" placeholder="身份证号" clearable></el-input> </el-form-item>
            <el-form-item>
                <el-button size="small" type="primary" @click="getDataList()">查询</el-button>
                <el-button size="small" type="success" @click="addSynchro()">新增</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
            <el-table-column type="index" header-align="center" align="center" width="50" label="序号"> </el-table-column>
            <el-table-column prop="phone" header-align="center" align="center" label="账号"> </el-table-column>
            <el-table-column prop="realName" header-align="center" align="center" label="姓名"> </el-table-column>
            <el-table-column prop="idCard" header-align="center" align="center" label="身份证号"> </el-table-column>
            <el-table-column prop="position" header-align="center" align="center" label="职务信息"> </el-table-column>
            <el-table-column prop="departmentName" header-align="center" align="center" label="部门名称"> </el-table-column>
            <el-table-column prop="email" header-align="center" align="center" label="邮箱"> </el-table-column>
            <el-table-column prop="status" :formatter="status" header-align="center" align="center" label="员工状态"> </el-table-column>
            <el-table-column header-align="center" align="center" width="120" label="操作">
                <template slot-scope="scope">
                    <el-button type="success" plain size="mini" @click="addOrUpdateHandle(scope.row.userId)">修改</el-button>
                    <!-- <el-button type="danger" plain size="mini" @click="isdelete(scope.row.userId)">删除</el-button> -->
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
        <!-- 弹窗, 修改 -->
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
        <!-- 弹窗,用户列表 -->
        <synchro v-if="synchroVisible" ref="synchro" @refreshDataList="getDataList"></synchro>
    </div>
</template>

<script>
let sha256 = require('js-sha256').sha256; //这里用的是require方法，所以没用import
import AddOrUpdate from './useradmin-add';
import synchro from './user-list';
export default {
    data() {
        return {
            dataForm: {
                realName: '',
                phone: '',
                idCard: '',
                departmentName: '',
            },
            dataList: [],
            pageIndex: 1,
            pageSize: 10,
            totalPage: 0,
            userId: '', //访客机账号id
            dataListLoading: false,
            addOrUpdateVisible: false,
            synchroVisible: false,
        };
    },
    components: {
        AddOrUpdate,
        synchro,
    },
    activated() {
        this.getDataList();
    },
    methods: {
        // 获取数据列表
        getDataList() {
            this.dataListLoading = true;
            this.$http({
                url: this.$http.adornUrl('/v1/pm/users'),
                method: 'get',
                params: this.$http.adornParams({
                    pageNum: this.pageIndex,
                    pageSize: this.pageSize,
                    realName: this.dataForm.realName,
                    phone: this.dataForm.phone,
                    idCard: this.dataForm.idCard,
                    departmentName: this.dataForm.departmentName,
                }),
            }).then(({data}) => {
                if (data.code == 200) {
                    this.dataList = data.data.list;
                    this.totalPage = data.data.total;
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
        isdelete(id) {
            this.$confirm(`确定进行删除操作?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    this.$http({
                        url: this.$http.adornUrl('/v1/pm/users/' + id),
                        method: 'delete',
                    })
                        .then(({data}) => {
                            this.getDataList();
                        })
                        .catch(error => {
                            this.$message.error(error);
                        });
                })
                .catch(() => {});
        },
        // 同步lzm的账号到超级物管
        addSynchro() {
            this.synchroVisible = true;
            this.$nextTick(() => {
                this.$refs.synchro.init();
            });
        },
        // 修改管理员账号
        addOrUpdateHandle(id) {
            this.addOrUpdateVisible = true;
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init(id);
            });
        },
        status(item) {
            switch (item.status) {
                case 1:
                    return '启用';
                    break;
                case 2:
                    return '禁用';
                    break;
            }
        },
    },
};
</script>
<style lang="scss" scoped>
.complay .el-select {
    width: 100%;
}
</style>
