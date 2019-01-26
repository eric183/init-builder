<template>
    <div class="mod-user">
        <p class="textright"><el-button size="small" v-if="isAuth('info:galleries:addGallery')" type="success" @click="addOrUpdateHandle()">新增相册</el-button></p>
        <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
            <el-table-column type="index" header-align="center" align="center" width="50" label="序号"> </el-table-column>
            <el-table-column prop="title" header-align="center" align="center" label="相册标题"> </el-table-column>
            <el-table-column header-align="center" align="center" label="相册封面">
                <template slot-scope="scope">
                    <el-popover placement="right" trigger="click">
                        <img :src="scope.row.coverImg" style="max-width:720px;max-height:600px;" /> <img slot="reference" :src="scope.row.coverImg" style="max-height: 50px;max-width: 130px" />
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column header-align="center" :formatter="createdAt" align="center" label="创建时间"> </el-table-column>
            <el-table-column header-align="center" align="center" width="150" label="操作">
                <template slot-scope="scope">
                    <el-button type="success" plain size="mini" @click="addOrUpdateHandle(scope.row)">修改</el-button>
                    <el-button type="danger" v-if="isAuth('info:galleries:deleteGallery')" plain size="mini" @click="deleteHandle(scope.row.galleryId)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="pageNum"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
        >
        </el-pagination>
        <!-- 弹窗, 新增 -->
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    </div>
</template>

<script>
import {commonFunc} from '@/utils/resources/index.js';
import AddOrUpdate from './gallery-add-or-update';
export default {
    data() {
        return {
            // 表格数据展示
            dataList: [],
            pageSize: 10,
            pageNum: 1,
            total: 0,
            dataListLoading: false,
            addOrUpdateVisible: false,
        };
    },
    components: {
        AddOrUpdate,
    },
    activated() {
        this.getDataList();
    },
    methods: {
        getDataList() {
            this.dataListLoading = true;
            this.$http({
                url: this.$http.adornUrl('/v1/info/galleries'),
                method: 'get',
                params: this.$http.adornParams({
                    pageSize: this.pageSize,
                    pageNum: this.pageNum,
                }),
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.dataList = data.data.list;
                    this.total = data.data.total;
                } else {
                    this.dataList = [];
                    this.total = 0;
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
        // 新增
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
                        url: this.$http.adornUrl('/v1/info/galleries/' + id),
                        method: 'delete',
                    }).then(({data}) => {
                        this.getDataList();
                    });
                })
                .catch(() => {});
        },
        // 后端返回的数字，转换成中文
        createdAt(item) {
            return commonFunc(item.createdAt);
        },
    },
};
</script>
