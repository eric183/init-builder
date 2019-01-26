<template>
    <el-row>
        <!-- 光缆列表 -->
        <el-row class="textright">
            <el-button type="primary" size="small" @click="pdf()">导出模板</el-button>
            <el-button type="primary" size="small" @click="importInt()">导入</el-button>
        </el-row>
        <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
            <el-table-column type="index" header-align="center" align="center" width="50" label="序号"></el-table-column>
            <el-table-column prop="cableName" header-align="center" align="center" label="光缆名称"></el-table-column>
            <el-table-column prop="labName" header-align="center" align="center" label="所属机房"></el-table-column>
            <el-table-column prop="projectName" header-align="center" align="center" label="所属工程"></el-table-column>
            <el-table-column prop="cableSegmentNum" header-align="center" align="center" label="光缆段数"></el-table-column>
            <el-table-column prop="coreLineNum" header-align="center" align="center" label="光缆芯数"></el-table-column>
            <el-table-column prop="remark" header-align="center" align="center" label="备注"></el-table-column>
            <el-table-column header-align="center" align="center" width="260" label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" plain size="mini" @click="segments(scope.row.cableId)">光缆段列表</el-button>
                    <el-button type="success" plain size="mini" @click="editCables(scope.row)">编辑</el-button>
                    <el-button type="danger" plain size="mini" @click="deleteLab(scope.row.cableId)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            class="page"
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="pageNum"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
        <aexport-int v-if="aexportIntAble" ref="aexportIntRef" :URL="'/v1/cpn/import/excels/cables'" :excelName="'cables'" @refreshDataList="getDataList"></aexport-int>
        <cab-update ref="cabUpdateRef" v-if="cabUpdateLoading" @refreshDataList="getDataList"></cab-update>
    </el-row>
</template>
<script>
import cabUpdate from './cab-update';
import {download} from '@/utils/resources/index.js';
import AexportInt from '@/views/compontents/AexportInt';
export default {
    components: {
        cabUpdate,
        AexportInt,
    },
    data() {
        return {
            dataListLoading: false,
            dataList: [],
            aexportIntAble: false,
            cabUpdateLoading: false,
            pageNum: 1,
            pageSize: 10,
            total: 0,
        };
    },
    methods: {
        getDataList() {
            this.dataListLoading = true;
            this.$http({
                url: this.$http.adornUrl('/v1/cpn/cables'),
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
        // 编辑
        editCables(obj) {
            this.cabUpdateLoading = true;
            this.$nextTick(() => {
                this.$refs.cabUpdateRef.init(obj);
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
                        url: this.$http.adornUrl('/v1/cpn/cables/' + id),
                        method: 'delete',
                    }).then(({data}) => {
                        this.getDataList();
                    });
                })
                .catch(() => {});
        },
        // 查看光缆段
        segments(id) {
            this.$router.push({name: 'cab-segments', query: {id: id}});
        },
        // 导出模板
        pdf() {
            this.$http({
                url: this.$http.adornUrl('/v1/cpn/export/types/' + 3 + '/excels'),
                method: 'get',
                responseType: 'blob',
            })
                .then(response => {
                    download(response.data, '光缆模板.xls');
                })
                .catch(err => {
                    console.log(err);
                });
        },
        // 导入excel
        importInt() {
            this.aexportIntAble = true;
            this.$nextTick(() => {
                this.$refs.aexportIntRef.init();
            });
        },
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.getDataList();
        });
    },
};
</script>
