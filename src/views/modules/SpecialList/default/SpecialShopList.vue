<template>
    <el-row>
        <!-- <el-row class="textright">
            <el-button type="danger" size="mini">全选删除</el-button>
        </el-row> -->
        <el-table :data="dataList" border style="width: 100%;" size="mini" @selection-change="selectionChange">
            <!-- <el-table-column type="selection" width="50">
            </el-table-column> -->
            <el-table-column type="index" header-align="center" align="center" label="序号"> </el-table-column>
            <el-table-column prop="skuId" header-align="center" align="center" label="商品编码"> </el-table-column>
            <el-table-column prop="name" header-align="center" min-width="160" align="center" label="商品名称">
                <template slot-scope="scope">
                    <span @click="$router.push({path: '/Shop-GoodsDetail', query: {id: scope.row.skuId}})" style="color:#3E8EF7;cursor:pointer">{{ scope.row.name }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="thirdCatId" header-align="center" align="center" label="类别ID"> </el-table-column>
            <el-table-column prop="thirdCatName" header-align="center" align="center" label="类别"> </el-table-column>
            <el-table-column prop="protocolPrice" header-align="center" align="center" label="成本价/元">
                <template slot-scope="scope">
                    <span>{{ scope.row.protocolPrice / 100 }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="jdPrice" header-align="center" align="center" label="京东购单价/元">
                <template slot-scope="scope">
                    <span>{{ scope.row.jdPrice / 100 }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="salePrice" header-align="center" align="center" label="京东购售价/元">
                <template slot-scope="scope">
                    <span>{{ scope.row.salePrice / 100 }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="saleUnit" header-align="center" align="center" label="单位"> </el-table-column>
            <el-table-column :formatter="state" header-align="center" align="center" label="上下架状态"> </el-table-column>
            <el-table-column :formatter="updatedAt" header-align="center" align="center" label="添加日期"> </el-table-column>
            <el-table-column header-align="center" align="center" width="150" label="操作">
                <template slot-scope="scope">
                    <el-button type="success" plain size="mini" @click="subjectTop(scope.row.subjectRefId)">置顶</el-button>
                    <el-button type="danger" plain size="mini" @click="deleteGooods(scope.row.skuId)">删除</el-button>
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
    </el-row>
</template>

<script>
import {commonFunc2} from '@/utils/resources/index.js';
export default {
    data() {
        return {
            subjectId: 0,
            dataList: [],
            dataListLoading: false,
            pageNum: 1,
            pageSize: 10,
            total: 0,
        };
    },
    activated() {
        this.subjectId = this.$route.query.id;
        this.getDataList();
    },
    methods: {
        // 获取数据列表
        getDataList() {
            this.$http({
                url: this.$http.adornUrl5('/v1/ops/subjects/' + this.subjectId + '/goods'),
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
            });
        },
        selectionChange(value) {
            // console.log(value)
        },
        // 置顶商品
        subjectTop(subjectRefId) {
            this.$http({
                url: this.$http.adornUrl5('/v1/ops/subjects/' + subjectRefId + '/top'),
                method: 'put',
            }).then(({data}) => {
                if (data && data.code === 201) {
                    this.$message.success('置顶成功');
                    this.getDataList();
                }
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
            this.pageNum = val;
            this.getDataList();
        },
        state(item) {
            switch (item.state) {
                case 1:
                    return '上架';
                    break;
                case 0:
                    return '下架';
                    break;
            }
        },
        deleteGooods(id) {
            this.$confirm(`确定进行删除?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    this.$http({
                        url: this.$http.adornUrl5('/v1/ops/subjects/' + this.subjectId + '/goods/' + id),
                        method: 'delete',
                    }).then(({data}) => {
                        this.getDataList();
                    });
                })
                .catch(() => {});
        },
        // 发布时间
        updatedAt(item) {
            return commonFunc2(item.updatedAt);
        },
    },
};
</script>
