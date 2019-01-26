<template>
    <el-row>
        <!-- ODF列表 -->
        <el-row class="textright"> <el-button type="primary" size="small" @click="addOdf()">新增</el-button> </el-row>
        <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
            <el-table-column type="index" header-align="center" align="center" width="50" label="序号"></el-table-column>
            <el-table-column prop="odfName" header-align="center" align="center" label="ODF名称"></el-table-column>
            <el-table-column prop="labName" header-align="center" align="center" label="所属机房"></el-table-column>
            <el-table-column prop="projectName" header-align="center" align="center" label="所属工程"></el-table-column>
            <el-table-column prop="totalTerminalNum" header-align="center" align="center" label="端子总数"></el-table-column>
            <el-table-column prop="freeTerminalNum" header-align="center" align="center" label="空闲端子数"></el-table-column>
            <el-table-column prop="usedTerminalNum" header-align="center" align="center" label="在用端子数"></el-table-column>
            <el-table-column prop="stoppedTerminalNum" header-align="center" align="center" label="停用端子数"></el-table-column>
            <el-table-column prop="remark" header-align="center" align="center" width="300" label="备注"></el-table-column>
            <el-table-column header-align="center" align="center" width="250" label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" plain size="mini" @click="terminals(scope.row.odfId)">端子列表</el-button>
                    <el-button type="success" plain size="mini" @click="addOdf(scope.row)">编辑</el-button>
                    <el-button type="danger" plain size="mini" @click="deleteOdf(scope.row.odfId)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <odf-add ref="odfAddRef" v-if="odfAddLoad" @refreshDataList="getDataList"></odf-add>
    </el-row>
</template>
<script>
import odfAdd from './odf-add-or-update';
export default {
    components: {
        odfAdd,
    },
    data() {
        return {
            dataListLoading: false,
            dataList: [],
            odfAddLoad: false,
        };
    },
    methods: {
        getDataList() {
            this.dataListLoading = true;
            this.$http({
                url: this.$http.adornUrl('/v1/cpn/odfs'),
                method: 'get',
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.dataList = data.data.odfs;
                }
                this.dataListLoading = false;
            });
        },
        // 新增--编辑
        addOdf(obj) {
            this.odfAddLoad = true;
            this.$nextTick(() => {
                this.$refs.odfAddRef.init(obj);
            });
        },
        // 查看端子列表
        terminals(id) {
            this.$router.push({name: 'res-terminals', query: {id: id}});
        },
        // 删除
        deleteOdf(id) {
            this.$confirm(`确定进行删除?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    this.$http({
                        url: this.$http.adornUrl('/v1/cpn/odfs/' + id),
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
