<template>
    <el-row>
        <!-- 光缆段列表 -->
        <el-row class="textright">
            <el-button type="primary" size="small" @click="pdf()">导出模板</el-button>
            <el-button type="primary" size="small" @click="importInt()">导入</el-button>
            <el-button type="success" size="small" @click="$router.push('residentNetwork-cableslist')">返回</el-button>
        </el-row>
        <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
            <el-table-column type="index" header-align="center" align="center" width="50" label="序号"></el-table-column>
            <el-table-column prop="segmentName" header-align="center" align="center" label="光缆段名称"></el-table-column>
            <el-table-column prop="startInstallation" header-align="center" align="center" label="起始设施"></el-table-column>
            <el-table-column prop="endInstallation" header-align="center" align="center" label="终止设施"></el-table-column>
            <el-table-column prop="coreLineNum" header-align="center" align="center" label="光缆段芯数"></el-table-column>
            <el-table-column prop="recorder" header-align="center" align="center" label="录入人员"></el-table-column>
            <el-table-column :formatter="recordTime" header-align="center" align="center" label="录入时间"></el-table-column>
            <el-table-column prop="remark" header-align="center" align="center" label="备注"></el-table-column>
            <el-table-column header-align="center" align="center" width="260" label="操作">
                <template slot-scope="scope">
                    <el-button type="success" plain size="mini" @click="editSegments(scope.row)">编辑</el-button>
                    <el-button type="danger" plain size="mini" @click="deleteSegments(scope.row.segmentId)">删除</el-button>
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
        <aexport-int v-if="aexportIntAble" ref="aexportIntRef" :URL="'/v1/cpn/import/excels/segments'" :excelName="'segments'" @refreshDataList="getDataList"></aexport-int>
        <segments ref="segmentsRef" v-if="segmentsLoading" @refreshDataList="getDataList"></segments>
    </el-row>
</template>
<script>
import segments from './cab-segments-update';
import {commonFunc , download} from '@/utils/resources/index.js';
import AexportInt from '@/views/compontents/AexportInt';
export default {
    components: {
        segments,
        AexportInt,
    },
    data() {
        return {
            dataListLoading: false,
            aexportIntAble: false,
            dataList: [],
            cableId: 0,
            segmentsLoading: false,
            pageNum: 1,
            pageSize: 10,
            total: 0,
        };
    },
    methods: {
        getDataList() {
            this.dataListLoading = true;
            this.$http({
                url: this.$http.adornUrl('/v1/cpn/cables/' + this.cableId + '/segments'),
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
        editSegments(obj) {
            this.segmentsLoading = true;
            this.$nextTick(() => {
                this.$refs.segmentsRef.init(obj);
            });
        },
        // 删除
        deleteSegments(id) {
            this.$confirm(`确定进行删除?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    this.$http({
                        url: this.$http.adornUrl('/v1/cpn/cables/segments/' + id),
                        method: 'delete',
                    }).then(({data}) => {
                        this.getDataList();
                    });
                })
                .catch(() => {});
        },
        // 导出模板
        pdf() {
            this.$http({
                url: this.$http.adornUrl('/v1/cpn/export/types/' + 4 + '/excels'),
                method: 'get',
                responseType: 'blob',
            })
                .then(response => {
                    download(response.data, '光缆段模板.xls');
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
        recordTime(item) {
            return commonFunc(item.recordTime);
        },
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.cableId = vm.$route.query.id; //路由跳转拿到参数
            vm.getDataList();
        });
    },
};
</script>
