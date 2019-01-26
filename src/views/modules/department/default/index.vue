<template>
    <div class="mod-menu">
        <!-- 部门 -->
        <el-form :inline="true" size="small">
            <div style="text-align:right">
                <el-form-item> <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button> </el-form-item>
            </div>
        </el-form>
        <el-table :data="dataList" border style="width: 100%;">
            <el-table-column prop="departmentId" header-align="center" align="center" width="100" label="ID"> </el-table-column>
            <table-tree-column prop="departmentName" header-align="center" treeKey="departmentId" label="部门"> </table-tree-column>
            <el-table-column prop="departmentId" header-align="center" align="center" label="部门ID"> </el-table-column>
            <el-table-column fixed="right" header-align="center" align="center" label="操作">
                <template slot-scope="scope">
                    <el-button plain type="success" size="mini" @click="addOrUpdateHandle(scope.row)">修改</el-button>
                    <el-button plain type="danger" size="mini" @click="deleteHandle(scope.row.departmentId)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 弹窗, 新增 / 修改 -->
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    </div>
</template>

<script>
import TableTreeColumn from '@/components/table-tree-column';
import AddOrUpdate from './de-add-or-update';
import {treeDataTranslate} from '@/utils';
export default {
    data() {
        return {
            dataList: [],
            dataListLoading: false,
            addOrUpdateVisible: false,
        };
    },
    components: {
        TableTreeColumn,
        AddOrUpdate,
    },
    activated() {
        this.getDataList();
    },
    methods: {
        // 获取数据列表
        getDataList() {
            this.dataListLoading = true;
            this.$http({
                url: this.$http.adornUrl('/v1/user/departments'),
                method: 'get',
            }).then(({data}) => {
                data = data.data;
                this.dataList = treeDataTranslate(data.departments, 'departmentId');
                this.dataListLoading = false;
            });
        },
        // 新增 / 修改
        addOrUpdateHandle(obj) {
            this.addOrUpdateVisible = true;
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init(obj);
            });
        },
        // 删除
        deleteHandle(id) {
            this.$confirm(`确定进行删除操作?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    this.$http({
                        url: this.$http.adornUrl(`/v1/user/departments/` + id),
                        method: 'delete',
                    }).then(({data}) => {
                        this.getDataList();
                    });
                })
                .catch(() => {});
        },
    },
};
</script>
