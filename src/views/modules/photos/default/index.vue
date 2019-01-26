<template>
    <div class="mod-user">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataListFun()" size="small">
            <el-form-item label="相册:" prop="galleryId">
                <el-select v-model="dataForm.galleryId" @change="galleryChange(dataForm.galleryId)">
                    <el-option v-for="item in galleryList" :key="item.galleryId" :label="item.title" :value="item.galleryId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button size="small" type="primary" @click="getDataListFun()">查询</el-button>
                <el-button size="small" type="success" @click="addOrUpdateHandle()">新增相片</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
            <el-table-column type="index" header-align="center" align="center" width="50" label="序号"> </el-table-column>
            <el-table-column prop="title" header-align="center" align="center" label="相片标题"> </el-table-column>
            <el-table-column header-align="center" align="center" label="相片">
                <template slot-scope="scope">
                    <el-popover placement="right" trigger="click">
                        <img :src="scope.row.image" style="max-width:720px;max-height:600px;" /> <img slot="reference" :src="scope.row.image" style="max-height: 50px;max-width: 130px" />
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column header-align="center" :formatter="createdAt" align="center" label="创建时间"> </el-table-column>
            <el-table-column header-align="center" align="center" width="100" label="操作">
                <template slot-scope="scope">
                    <el-button type="danger" v-if="isAuth('info:photos:deletePhoto')" plain size="mini" @click="deleteHandle(scope.row.photoId)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="pageNum"
            :page-sizes="[10, 20, 30, 50]"
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
import AddOrUpdate from './photos-add-or-update';
export default {
    data() {
        return {
            dataForm: {
                galleryId: null,
            },
            galleryList: [], //相册列表下拉
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
        this.getGarrlyList();
    },
    methods: {
        // 查询相册列表-下拉
        getGarrlyList() {
            this.$http({
                url: this.$http.adornUrl('/v1/info/galleries'),
                method: 'get',
                params: this.$http.adornParams({
                    pageSize: 999,
                    pageNum: 1,
                }),
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.galleryList = data.data.list;
                    if (data.data.list.length > 0) {
                        this.dataForm.galleryId = this.galleryList[0].galleryId;
                        this.getDataList();
                    }
                } else {
                    this.dataList = [];
                }
            });
        },
        getDataListFun() {
            this.pageNum = 1;
            this.getDataList();
        },
        // 查询数据
        getDataList() {
            this.dataListLoading = true;
            this.$http({
                url: this.$http.adornUrl('/v1/info/photos'),
                method: 'get',
                params: this.$http.adornParams({
                    pageSize: this.pageSize,
                    pageNum: this.pageNum,
                    galleryId: this.dataForm.galleryId,
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
        galleryChange(value) {
            this.dataForm.galleryId = value;
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
        addOrUpdateHandle() {
            this.addOrUpdateVisible = true;
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init();
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
                        url: this.$http.adornUrl('/v1/info/photos/' + id),
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
