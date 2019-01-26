<template>
    <el-row>
        <!-- 职务 -->
        <el-form :inline="true" size="small">
            <div style="text-align:right">
                <el-form-item> <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button> </el-form-item>
            </div>
        </el-form>
        <el-table :data="dataList" v-loading="dataListLoading" border style="width: 100%;">
            <el-table-column type="index" header-align="center" align="center" width="50" label="序号"> </el-table-column>
            <el-table-column prop="position" align="center" header-align="center" label="职务名称"> </el-table-column>
            <el-table-column prop="id" header-align="center" align="center" label="职务id"> </el-table-column>
            <el-table-column fixed="right" header-align="center" align="center" label="操作" width="100">
                <template slot-scope="scope">
                    <el-button plain type="danger" size="mini" @click="deleteHandle(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <position-add v-if="positionAddDialog" ref="positionAddRef" @refreshDataList="getDataList"></position-add>
    </el-row>
</template>
<script>
import positionAdd from './position-add';
export default {
    components: {
        positionAdd,
    },
    data() {
        return {
            dataListLoading: false,
            positionAddDialog: false,
            dataList: [],
        };
    },
    methods: {
        // 查询职务列表
        getDataList() {
            this.dataListLoading = true;
            this.$http({
                url: this.$http.adornUrl('/v1/user/companies/positions'),
                method: 'get',
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.dataList = data.data.positions;
                }
                this.dataListLoading = false;
            });
        },
        // 新增职务
        addOrUpdateHandle() {
            this.positionAddDialog = true;
            this.$nextTick(() => {
                this.$refs.positionAddRef.init();
            });
        },
        // 删除职务
        deleteHandle(id) {
            this.$confirm(`确定进行删除操作?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    this.$http({
                        url: this.$http.adornUrl(`/v1/user/companies/positions/` + id),
                        method: 'delete',
                    }).then(({data}) => {
                        this.getDataList();
                    });
                })
                .catch(() => {});
        },
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.getDataList();
        });
    },
};
</script>
