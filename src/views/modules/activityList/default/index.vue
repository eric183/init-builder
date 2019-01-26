<template>
    <div class="mod-user">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataListFun()" size="small">
            <el-form-item label="发布时间" class="ml10">
                <el-date-picker v-model="dataForm.createdAt" type="daterange" value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
            </el-form-item>
            <el-form-item label="活动状态:" class="ml10">
                <el-select v-model="dataForm.status"> <el-option v-for="item in StatuList" :key="item.value" :label="item.label" :value="item.value"></el-option> </el-select>
            </el-form-item>
            <el-form-item label="活动类型:" class="ml10">
                <el-select v-model="dataForm.type"> <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value"></el-option> </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getDataListFun()">查询</el-button>
                <el-button type="success" @click="addOrUpdateHandle()">新增</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
            <el-table-column prop="actId" header-align="center" align="center" width="50" label="ID"> </el-table-column>
            <el-table-column prop="title" header-align="center" align="center" min-width="180" :show-overflow-tooltip="true" label="标题"> </el-table-column>
            <el-table-column header-align="center" align="center" label="封面图">
                <template slot-scope="scope">
                    <el-popover v-if="scope.row.coverImg != ''" placement="right" trigger="click">
                        <img :src="scope.row.coverImg" style="max-width:720px;max-height:600px;" /> <img slot="reference" :src="scope.row.coverImg" style="width:50px;height:50px;" />
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column :formatter="createdAt" header-align="center" align="center" width="140" label="发布时间"> </el-table-column>
            <el-table-column :formatter="publishTime" header-align="center" align="center" width="150" label="活动时间"> </el-table-column>
            <el-table-column prop="likeNum" header-align="center" align="center" label="点赞数"> </el-table-column>
            <el-table-column prop="viewNum" header-align="center" align="center" label="浏览量"> </el-table-column>
            <el-table-column header-align="center" align="center" label="互动">
                <template slot-scope="scope">
                    <span class="color_blue cursor" @click="detail(scope.row.actId, scope.row.type)" v-if="scope.row.interactiveNum">{{ scope.row.interactiveNum }}</span>
                </template>
            </el-table-column>
            <el-table-column header-align="center" align="center" label="报名人数">
                <template slot-scope="scope">
                    <span class="cursor" @click="detail(scope.row.actId, scope.row.type)" v-if="scope.row.attendNum">{{ scope.row.attendNum }}</span>
                </template>
            </el-table-column>
            <el-table-column header-align="center" align="center" width="150" label="操作">
                <template slot-scope="scope">
                    <p>
                        <el-button type="primary" plain size="mini" @click="sort(scope.row.actId)">置顶</el-button>
                        <el-button type="primary" plain size="mini" @click="addOrUpdateHandle(scope.row.actId, scope.row.type)">编辑</el-button>
                    </p>
                    <p>
                        <el-button type="success" plain size="mini" @click="detail(scope.row.actId, scope.row.type)">详情</el-button>
                        <el-button type="danger" plain size="mini" @click="deleteHandle(scope.row.actId)">删除</el-button>
                    </p>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="pageNum"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            :total="totalPage"
            layout="total, sizes, prev, pager, next, jumper"
        >
        </el-pagination>
        <!-- 弹窗, 新增-->
        <add ref="add" v-if="addOrUpdateVisible" @refreshDataList="getDataList"></add>
        <!-- 弹窗, 详情-->
        <detail ref="detail" v-if="detailVisible"></detail>
    </div>
</template>

<script>
import {commonFunc} from '@/utils/resources/index.js';
import add from './activity-add';
import detail from './activity-detail';
export default {
    data() {
        return {
            dataForm: {
                createdAt: '',
                status: null,
                type: null,
            },
            StatuList: [{value: null, label: '全部'}, {value: 1, label: '未开始'}, {value: 2, label: '进行中'}, {value: 3, label: '已结束'}, {value: 10, label: '报名中'}],
            typeList: [{value: null, label: '全部'}, {value: 1, label: '互动型活动'}, {value: 2, label: '报名型活动'}],
            // 表格数据展示
            dataList: [],
            pageNum: 1,
            pageSize: 10,
            totalPage: 0,
            dataListLoading: false,
            addOrUpdateVisible: false,
            detailVisible: false,
        };
    },
    components: {
        add,
        detail,
    },
    activated() {
        this.getDataList();
    },
    methods: {
        getDataListFun() {
            this.pageNum = 1;
            this.getDataList();
        },
        // 获取数据列表
        getDataList() {
            this.dataListLoading = true;
            this.$http({
                url: this.$http.adornUrl('/v2/act/infos'),
                method: 'get',
                params: this.$http.adornParams({
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    publishStart: this.dataForm.createdAt.length > 0 ? this.dataForm.createdAt[0] : '',
                    publishEnd: this.dataForm.createdAt.length > 0 ? this.dataForm.createdAt[1] : '',
                    type: this.dataForm.type,
                    status: this.dataForm.status,
                }),
            }).then(({data}) => {
                if (data && data.code === 200) {
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
            this.getDataList();
        },
        // 当前页
        currentChangeHandle(val) {
            this.pageNum = val;
            this.getDataList();
        },
        // 新增
        addOrUpdateHandle(actId, type) {
            this.addOrUpdateVisible = true;
            this.$nextTick(() => {
                this.$refs.add.aa(actId, type);
            });
        },
        detail(id, type) {
            this.detailVisible = true;
            this.$nextTick(() => {
                this.$refs.detail.init(id, type);
            });
        },
        // 置顶
        sort(id) {
            this.$http({
                url: this.$http.adornUrl('/v1/act/infos/' + id + '/top'),
                method: 'put',
            }).then(({data}) => {
                if (data.code == 201) {
                    this.getDataList();
                }
            });
        },
        // 删除
        deleteHandle(id) {
            this.$confirm(`确定进行删除?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    this.$http({
                        url: this.$http.adornUrl('/v1/act/infos/' + id),
                        method: 'delete',
                    }).then(({data}) => {
                        this.getDataList();
                    });
                })
                .catch(() => {});
        },
        // 发布时间
        createdAt(item) {
            return commonFunc(item.createdAt);
        },
        // 活动时间
        publishTime(item) {
            return commonFunc(item.startTime) + '至' + commonFunc(item.endTime);
        },
    },
};
</script>
<style lang="scss" scoped>
.color_blue {
    color: #3e8ef7;
}
.cursor {
    cursor: pointer;
}
</style>
