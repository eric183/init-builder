<template>
    <div class="mod-user">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataListFun()" size="small">
            <el-form-item label="发布时间" class="ml10">
                <el-date-picker v-model="valueTime" type="daterange" value-format="yyyy-MM-dd" range-separator="-" start-placeholder="开始" end-placeholder="结束" @change="getTime"> </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button v-if="isAuth('info:discoveries:getDiscoveriesV2')" type="primary" @click="getDataListFun()">查询</el-button>
                <el-button v-if="isAuth('info:discoveries:addDiscovery')" type="success" @click="addOrUpdateHandle()">新增</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
            <el-table-column prop="discoveryId" header-align="center" align="center" width="50" label="ID"> </el-table-column>
            <el-table-column prop="title" header-align="center" align="center" min-width="180" :show-overflow-tooltip="true" label="标题"> </el-table-column>
            <el-table-column header-align="center" align="center" label="封面图">
                <template slot-scope="scope">
                    <el-popover v-if="scope.row.coverImg != ''" placement="right" trigger="click">
                        <img :src="scope.row.coverImg" style="max-width:720px;max-height:600px;" /> <img slot="reference" :src="scope.row.coverImg" style="width:50px;height:50px;" />
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column :formatter="publishTime" header-align="center" align="center" width="140" label="发布时间"> </el-table-column>
            <el-table-column prop="likeNum" header-align="center" align="center" label="点赞数"> </el-table-column>
            <el-table-column prop="viewNum" header-align="center" align="center" label="浏览量"> </el-table-column>
            <el-table-column prop="commentNum" header-align="center" align="center" label="评论"> </el-table-column>
            <el-table-column header-align="center" align="center" width="220" label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" v-if="isAuth('info:discoveries:sortDiscovery')" plain size="mini" @click="sort(scope.row.discoveryId)">置顶</el-button>
                    <el-button type="success" v-if="isAuth('info:discoveries:getDiscoveryDetailsV2')" plain size="mini" @click="detail(scope.row.discoveryId)">详情</el-button>
                    <el-button type="danger" v-if="isAuth('info:discoveries:deleteDiscovery')" plain size="mini" @click="deleteHandle(scope.row.discoveryId)">删除</el-button>
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
    </div>
</template>

<script>
import {commonFunc} from '@/utils/resources/index.js';
import add from './info-add';
export default {
    data() {
        return {
            dataForm: {
                startTime: '',
                endTime: '',
            },
            valueTime: '',
            // 表格数据展示
            dataList: [],
            pageNum: 1,
            pageSize: 10,
            totalPage: 0,
            dataListLoading: false,
            addOrUpdateVisible: false,
        };
    },
    components: {
        add,
    },
    activated() {
        this.getDataList();
    },
    methods: {
        //获取查询时间
        getTime(val) {
            if (val) {
                for (let i = 0; i < val.length; i++) {
                    this.dataForm.startTime = val[0];
                    this.dataForm.endTime = val[1];
                }
            } else {
                (this.dataForm.startTime = ''), (this.dataForm.endTime = '');
            }
        },
        getDataListFun() {
            this.pageNum = 1;
            this.getDataList();
        },
        // 获取数据列表
        getDataList() {
            this.dataListLoading = true;
            this.$http({
                url: this.$http.adornUrl('/v2/info/discoveries'),
                method: 'get',
                params: this.$http.adornParams({
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    startTime: this.dataForm.startTime,
                    endTime: this.dataForm.endTime,
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
        addOrUpdateHandle() {
            this.addOrUpdateVisible = true;
            // this.$router.push({path:'/infoadd'});
            this.$nextTick(() => {
                this.$refs.add.aa();
            });
        },
        detail(id) {
            this.$router.push({path: '/info-detail', query: {id: id}});
        },
        // 置顶
        sort(id) {
            this.$http({
                url: this.$http.adornUrl('/v1/info/discoveries/' + id + '/sort/' + 1),
                method: 'put',
            }).then(({data}) => {
                if (data.code == 201) {
                    this.getDataList();
                }
            });
        },
        // 删除
        deleteHandle(id) {
            var id = id
                ? [id]
                : this.dataListSelections.map(item => {
                      return item.id;
                  });
            this.$confirm(`确定对[id=${id.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    this.$http({
                        url: this.$http.adornUrl('/v1/info/discoveries/' + id),
                        method: 'delete',
                    })
                        .then(({data}) => {
                            this.getDataList();
                        })
                        .catch(error => {
                            this.$message.error(error);
                        });
                })
                .catch();
        },
        publishTime(item) {
            return commonFunc(item.publishTime);
        },
    },
};
</script>
