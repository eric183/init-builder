<template>
    <el-row>
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataListFun()" size="small">
            <el-form-item>
                <el-select v-model="dataForm.thirdCatId" filterable>
                    <el-option :value="null" label="全部">全部</el-option>
                    <el-option v-for="item in categoryList" :key="item.catId" :label="item.name" :value="item.catId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item> <el-input v-model="dataForm.skuId" placeholder="商品编码查询" clearable></el-input> </el-form-item>
            <el-form-item> <el-input v-model="dataForm.prodName" placeholder="商品名称查询" clearable></el-input> </el-form-item>
            <el-form-item label="上下架状态:"> <el-switch v-model="dataForm.state" active-color="#3E8EF7" inactive-color="#e5e5e5" :active-value="1" :inactive-value="0"> </el-switch> </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getDataListFun()">查询</el-button>
                <el-button type="success" @click="addOrUpdateHandle()">新增</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
            <el-table-column type="selection" width="50" label="全选"> </el-table-column>
            <el-table-column type="index" header-align="center" align="center" width="50" label="序号"> </el-table-column>
            <el-table-column prop="skuId" header-align="center" align="center" label="商品编码"> </el-table-column>
            <el-table-column prop="name" header-align="center" align="center" min-width="160" label="商品名称">
                <template slot-scope="scope">
                    <span @click="$router.push({path: '/Shop-GoodsDetail', query: {id: scope.row.skuId}})" style="color:#3E8EF7;cursor:pointer">{{ scope.row.name }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="thirdCatId" header-align="center" align="center" label="京东类别ID"> </el-table-column>
            <el-table-column prop="thirdCatName" header-align="center" align="center" label="京东类别"> </el-table-column>
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
            <el-table-column header-align="center" align="center" label="上下架状态">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.jdgState" active-color="#3E8EF7" inactive-color="#e5e5e5" :active-value="1" :inactive-value="0"> </el-switch>
                </template>
            </el-table-column>
            <el-table-column header-align="center" align="center" label="是否启用">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.isEnable" active-color="#3E8EF7" inactive-color="#e5e5e5" :active-value="1" :inactive-value="0"> </el-switch>
                </template>
            </el-table-column>
            <el-table-column prop="updatedAt" min-width="130" :formatter="updatedAt" header-align="center" align="center" label="更新日期"> </el-table-column>
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
        <!-- 弹窗, 新增-->
        <add ref="addOrUpdate" v-if="addOrUpdateVisible" @refreshDataList="getDataListFun"></add>
    </el-row>
</template>

<script>
import {commonFunc} from '@/utils/resources/index.js';
import add from './AddShopGroup';
export default {
    data() {
        return {
            dataForm: {
                thirdCatId: null,
                skuId: '',
                prodName: '',
                state: 1,
            },
            categoryList: [],
            // 表格数据展示
            dataList: [],
            idList: [],
            pageNum: 1,
            pageSize: 10,
            total: 0,
            dataListLoading: false,
            addOrUpdateVisible: false,
        };
    },
    components: {
        add,
    },
    activated() {
        this.getDataList();
        this.getCategory();
    },
    methods: {
        getDataListFun() {
            this.pageNum = 1;
            this.getDataList();
        },
        // 获取jd第三极分类
        getCategory() {
            this.$http({
                url: this.$http.adornUrl5('/v1/prod/categories'),
                method: 'get',
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.categoryList = data.data.list;
                }
            });
        },
        // 获取数据列表
        getDataList() {
            this.dataListLoading = true;
            this.$http({
                url: this.$http.adornUrl5('/v1/product/goods'),
                method: 'get',
                params: this.$http.adornParams({
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    thirdCatId: this.dataForm.thirdCatId,
                    skuId: this.dataForm.skuId,
                    prodName: this.dataForm.prodName,
                    state: this.dataForm.state,
                }),
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.dataList = data.data.list;
                    this.total = data.data.total;
                    this.dataList.map(obj => {
                        if (obj.state == 1 && obj.isShelves == 1) {
                            obj.jdgState = 1;
                        } else {
                            obj.jdgState = 0;
                        }
                    });
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
            if (this.idList.length == 0) {
                this.$message.error('请选择至少一件商品');
                return false;
            } else {
                this.$nextTick(() => {
                    this.$refs.addOrUpdate.init(this.idList);
                });
            }
        },
        selectionChangeHandle(value) {
            this.idList = [];
            if (value.length > 0) {
                value.map(obj => {
                    this.idList.push(obj.skuId);
                });
            }
        },
        updatedAt(item) {
            return commonFunc(item.updatedAt);
        },
    },
};
</script>
