<template>
    <div class="showdetail">
        <!-- 运营看的商品列表页面 -->
        <el-form label-width="50px" size="small" :model="dataForm" :inline="true">
            <el-form-item label="店铺:">
                <el-select placeholder="请选择" v-model="dataForm.shopId" @change="shopChange">
                    <el-option v-for="item in shoplist" :key="item.shopId" :label="item.shopName" :value="item.shopId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="名称:" class="ml10"> <el-input placeholder="商品名称" v-model="dataForm.goodsName" clearable></el-input> </el-form-item>
            <el-form-item label="状态:" class="ml10">
                <el-select placeholder="请选择" v-model="dataForm.status"> <el-option v-for="item in statuslist" :key="item.value" :label="item.label" :value="item.value"></el-option> </el-select>
            </el-form-item>
            <el-form-item> <el-button size="small" type="primary" @click="getDataListFun()">查询</el-button> </el-form-item>
        </el-form>
        <div class="shopkeeper">
            <el-table :data="tableData" border center="all" style="width: 100%">
                <el-table-column prop="goodsId" align="center" label="商品id" width="60"> </el-table-column>
                <el-table-column prop="coverImg" align="center" label="图片">
                    <template slot-scope="scope">
                        <el-popover placement="right" trigger="click">
                            <img :src="scope.row.coverImg" style="max-width:720px;max-height:600px;" /> <img slot="reference" :src="scope.row.coverImg" style="width:50px;height:50px" />
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column prop="goodsName" align="center" min-width="160" label="名称">
                    <template slot-scope="scope">
                        <span>{{ scope.row.goodsName }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="groupName" align="center" label="类别"> </el-table-column>
                <el-table-column prop="salePrice" align="center" label="售价(元)">
                    <template slot-scope="scope">
                        <span>{{ scope.row.salePrice / 100 }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="discountPrice" align="center" label="活动价(元)">
                    <template slot-scope="scope">
                        <span>{{ scope.row.discountPrice / 100 }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="status" align="center" width="130" label="状态">
                    <template slot-scope="scope">
                        <el-switch :width="35" v-model="scope.row.status" @change="auditStatusFun(scope.row)" active-text="上架" :active-value="2" inactive-text="下架" :inactive-value="3">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column prop="limitNum" align="center" label="限购"> </el-table-column>
                <el-table-column prop="sales" align="center" label="销量">
                    <template slot-scope="scope">
                        <input class="sales" @blur="inputBlur(scope.row)" type="text" v-model="scope.row.sales" />
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="120" v-if="isAuth('isShowTop')" key="isShowTop">
                    <template slot-scope="scope">
                        <el-button type="success" plain size="mini" @click="setTop(scope.row)">置顶</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagin">
                <el-pagination
                    layout="total, sizes, prev, pager, next, jumper"
                    @size-change="sizeChangeHandle"
                    @current-change="currentchange"
                    :current-page="pageNum"
                    :total="total"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="pageSize"
                >
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'operateGoodsList',
    data() {
        return {
            tableData: [], //页面初始数据
            dataForm: {
                shopId: null,
                goodsName: '',
                status: 2,
            },
            shoplist: [],
            shopId: null, //登录时候选择店铺，先写死
            total: 0,
            pageNum: 1, //当前页数
            pageSize: 8, //每页数量
            statuslist: [{value: null, label: '全部'}, {value: 1, label: '待上架'}, {value: 2, label: '已上架'}, {value: 3, label: '已下架'}],
        };
    },
    activated: function() {
        this.getShopSelect();
    },
    methods: {
        // 店铺下拉选择
        getShopSelect() {
            this.$http({
                url: this.$http.adornUrl2('/v1/merchant/shops/options'),
                method: 'get',
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.shoplist = data.data.options;
                    this.dataForm.shopId = this.shoplist[0].shopId;
                    this.searchshopinglist();
                }
            });
        },
        // 选择店铺下拉刷新商品列表
        shopChange(val) {
            this.dataForm.shopId = val;
            this.pageNum = 1;
            this.searchshopinglist();
        },
        // 销量的input数去焦点
        inputBlur(val) {
            console.log(val);
            this.$http({
                url: this.$http.adornUrl2('/v1/product/goods/' + val.goodsId),
                method: 'put',
                data: this.$http.adornData({
                    sales: val.sales,
                }),
            }).then(({data}) => {
                if (data && data.code === 201) {
                    this.$message({
                        message: '操作成功',
                        type: 'success',
                    });
                }
            });
        },
        getDataListFun() {
            this.pageNum = 1;
            this.searchshopinglist();
        },
        // 查询列表数据
        searchshopinglist() {
            var that = this;
            this.$http
                .get(this.$http.adornUrl2('/v1/product/goods'), {
                    params: {shopId: that.dataForm.shopId, pageNum: that.pageNum, pageSize: that.pageSize, goodsName: that.dataForm.goodsName, status: that.dataForm.status},
                })
                .then(function(res) {
                    if (res.data.code == 200) {
                        that.tableData = res.data.data.list;
                        that.total = res.data.data.total;
                    } else {
                        that.tableData = [];
                        that.total = 0;
                    }
                });
        },
        // 每页数
        sizeChangeHandle(val) {
            this.pageSize = val;
            this.pageNum = 1;
            this.searchshopinglist();
        },
        // 分页
        currentchange(value) {
            this.pageNum = value;
            this.searchshopinglist();
        },
        // 修改商品上下线状态
        auditStatusFun(value) {
            console.log(value);
            const that = this;
            this.$http.put(this.$http.adornUrl2('/v1/product/goods/' + value.goodsId), {status: value.status}).then(function(res) {
                if (res.data.code == 201) {
                    that.$message({
                        message: '操作成功',
                        type: 'success',
                    });
                    that.searchshopinglist();
                }
            });
        },
        // 置顶
        setTop(item) {
            this.$http({
                url: this.$http.adornUrl2('/v1/product/groups/' + item.groupId + '/goods/' + item.goodsId + '/sorts'),
                method: 'put',
                data: this.$http.adornData({
                    type: 1,
                }),
            }).then(({data}) => {
                if (data && data.code === 201) {
                    this.searchshopinglist();
                }
            });
        },
    },
};
</script>
<style lang="scss" scoped>
.sales {
    padding: 10px 0;
    text-align: center;
    border: 1px solid #ebeef5;
    border-radius: 5px;
    outline: none;
}
.sales:focus {
    border: 1px solid #3e8ef7;
}
</style>
