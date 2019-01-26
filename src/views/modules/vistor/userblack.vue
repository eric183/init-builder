<template>
    <div class="mod-user">
        <p class="textright"><el-button size="small" type="success" @click="addHandle()">新增</el-button></p>
        <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
            <el-table-column type="index" header-align="center" align="center" width="50" label="序号"> </el-table-column>
            <el-table-column prop="name" header-align="center" align="center" label="姓名"> </el-table-column>
            <el-table-column prop="phone" header-align="center" align="center" label="手机号"> </el-table-column>
            <el-table-column prop="idCard" header-align="center" align="center" label="身份证号"> </el-table-column>
            <el-table-column prop="remark" header-align="center" align="center" :show-overflow-tooltip="true" label="备注"> </el-table-column>
            <el-table-column :formatter="createdAt" header-align="center" align="center" :show-overflow-tooltip="true" label="添加时间"> </el-table-column>
            <el-table-column header-align="center" align="center" min-width="80" label="操作">
                <template slot-scope="scope">
                    <el-button type="danger" plain size="mini" @click="isdelete(scope.row.blacklistId)">移除</el-button>
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
        <!-- 弹窗, 新增 -->
        <add v-if="addVisible" ref="add" @refreshDataList="getDataList"></add>
    </div>
</template>

<script>
import commonFunc from '@/assets/common.js';
import add from './userwhite-add';
export default {
    data() {
        return {
            dataList: [],
            pageIndex: 1,
            pageSize: 10,
            totalPage: 0,
            dataListLoading: false,
            addVisible: false,
        };
    },
    components: {
        add,
    },
    activated() {
        this.getDataList();
    },
    methods: {
        // 获取数据列表
        getDataList() {
            this.dataListLoading = true;
            this.$http({
                url: this.$http.adornUrl('/v1/visitor/blacklists'),
                method: 'get',
                params: this.$http.adornParams({
                    pageNum: this.pageIndex,
                    pageSize: this.pageSize,
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
        getTime() {},
        // 新增
        addHandle() {
            this.addVisible = true;
            this.$nextTick(() => {
                this.$refs.add.init(1);
            });
        },
        // 删除
        isdelete(id) {
            this.$confirm(`确定进行删除操作?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    this.$http({
                        url: this.$http.adornUrl('/v1/visitor/blacklists/' + id),
                        method: 'delete',
                    }).then(({data}) => {
                        this.getDataList();
                    });
                })
                .catch(() => {});
        },
        status(item) {},
        createdAt(item) {
            return commonFunc.commonFunc(item.createdAt);
        },
    },
};
</script>
