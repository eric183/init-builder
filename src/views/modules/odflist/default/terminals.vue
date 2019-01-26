<template>
    <el-row>
        <!-- 端子列表 -->
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataListFun()" size="small">
            <el-form-item label="端子编号：" prop="terminalSn"> <el-input v-model="dataForm.terminalSn" placeholder="端子编号" clearable></el-input> </el-form-item>
            <el-form-item label="端子状态:" class="ml10">
                <el-select v-model="dataForm.status" clearable> <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value"></el-option> </el-select>
            </el-form-item>
            <el-form-item label="所属光缆:" class="ml10">
                <el-select v-model="dataForm.cableId" clearable>
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="item in cableList" :key="item.cableId" :label="item.cableName" :value="item.cableId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="所属光缆段:" class="ml10">
                <el-select v-model="dataForm.segmentId" clearable>
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="item in segmentList" :key="item.segmentId" :label="item.segmentName" :value="item.segmentId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getDataListFun()">查询</el-button>
                <el-button type="success" @click="pdf()">导出模板</el-button>
                <el-button type="success" @click="importInt()">导入</el-button>
                <el-button type="success" @click="$router.go(-1)">返回</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
            <el-table-column type="index" header-align="center" align="center" width="50" label="序号"></el-table-column>
            <el-table-column prop="terminalSn" header-align="center" align="center" label="端子编号"></el-table-column>
            <el-table-column prop="odfName" header-align="center" align="center" label="所在ODF"></el-table-column>
            <el-table-column prop="segmentName" header-align="center" align="center" label="所属光缆段"></el-table-column>
            <el-table-column prop="cableName" header-align="center" align="center" label="所属光缆"></el-table-column>
            <el-table-column :formatter="status" header-align="center" align="center" label="端子状态"></el-table-column>
            <el-table-column header-align="center" align="center" width="100" label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" plain size="mini" @click="business(scope.row.terminalId)">业务详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <aexport-int v-if="aexportIntAble" ref="aexportIntRef" :URL="'/v1/cpn/import/excels/terminals'" :excelName="'terminals'" @refreshDataList="getDataListFun"></aexport-int>
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
    </el-row>
</template>
<script>
import {terminalStatus,download} from '@/utils/resources/index.js';
import AexportInt from '@/views/compontents/AexportInt';
export default {
    components: {
        AexportInt,
    },
    data() {
        return {
            dataForm: {
                terminalSn: '',
                status: '0',
                cableId: '',
                segmentId: '',
            },
            odfId: 0,
            dataListLoading: false,
            aexportIntAble: false,
            dataList: [],
            statusList: [{value: '0', label: '全部'}, {value: '1', label: '在用'}, {value: '2', label: '停用'}, {value: '3', label: '空闲'}],
            cableList: [],
            segmentList: [],
            pageNum: 1,
            pageSize: 10,
            total: 0,
        };
    },
    methods: {
        getDataListFun() {
            this.pageNum = 1;
            this.getDataList();
        },
        getDataList() {
            this.dataListLoading = true;
            this.$http({
                url: this.$http.adornUrl('/v1/cpn/odfs/' + this.odfId + '/terminals'),
                method: 'get',
                params: this.$http.adornParams(
                    Object.assign(
                        this.dataForm,
                        {
                            pageNum: this.pageNum,
                            pageSize: this.pageSize,
                        },
                        this.dataForm
                    )
                ),
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
        // 业务详情
        business(id) {
            this.$router.push({name: 'tem-business', query: {id: id}});
        },
        // 光缆下拉列表
        getCablesOption() {
            this.$http({
                url: this.$http.adornUrl('/v1/cpn/cables/options'),
                method: 'get',
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.cableList = data.data.options;
                }
            });
        },
        // 光缆段下拉列表
        getSegmentOption() {
            this.$http({
                url: this.$http.adornUrl('/v1/cpn/cables/segments/options'),
                method: 'get',
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.segmentList = data.data.options;
                }
            });
        },
        // 导出模板
        pdf() {
            this.$http({
                url: this.$http.adornUrl('/v1/cpn/export/types/' + 5 + '/excels'),
                method: 'get',
                responseType: 'blob',
            })
                .then(response => {
                    download(response.data, '端子模板.xls');
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
        status(item) {
            return terminalStatus(item.status);
        },
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.odfId = vm.$route.query.id; //路由跳转拿到参数
            vm.getCablesOption();
            vm.getSegmentOption();
            vm.getDataListFun();
        });
    },
};
</script>
