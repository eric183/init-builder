<template>
    <el-row>
        <!-- 机房列表 -->
        <el-row class="textright"> <el-button type="primary" size="small" @click="addLab">新增</el-button> </el-row>
        <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
            <el-table-column type="index" header-align="center" align="center" width="50" label="序号"></el-table-column>
            <el-table-column prop="labName" header-align="center" align="center" label="机房名称"></el-table-column>
            <el-table-column prop="position" header-align="center" align="center" label="机房位置"></el-table-column>
            <el-table-column prop="remark" header-align="center" align="center" label="备注"></el-table-column>
            <el-table-column header-align="center" align="center" width="150" label="操作">
                <template slot-scope="scope">
                    <el-button type="danger" plain size="mini" @click="deleteLab(scope.row.labId)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <lab-add ref="labAddRef" v-if="labAddLoad" @refreshDataList="getDataList"></lab-add>
    </el-row>
</template>
<script>
import labAdd from './lab-add';
export default {
    components: {
        labAdd,
    },
    data() {
        return {
            dataListLoading: false,
            dataList: [],
            labAddLoad: false,
        };
    },
    methods: {
        getDataList() {
            this.dataListLoading = true;
            this.$http({
                url: this.$http.adornUrl('/v1/cpn/labs'),
                method: 'get',
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.dataList = data.data.labs;
                }
                this.dataListLoading = false;
            });
        },
        // 新增
        addLab() {
            this.labAddLoad = true;
            this.$nextTick(() => {
                this.$refs.labAddRef.init();
            });
        },
        // 删除
        deleteLab(id) {
            this.$confirm(`确定进行删除?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    this.$http({
                        url: this.$http.adornUrl('/v1/cpn/labs/' + id),
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
