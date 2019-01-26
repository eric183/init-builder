<template>
    <div class="crossProduct">
        <!-- 超级管理员 -->
        <div class="admin">
            <el-form label-width="50px" size="small" :model="formData">
                <el-form-item label="店铺">
                    <el-select placeholder="请选择" v-model="formData.shopId" @change="shopChange(formData.shopId)">
                        <el-option v-for="item in shoplist" :key="item.shopId" :label="item.shopName" :value="item.shopId"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <el-table :data="tableData" center="all" border style="width: 100%">
                <el-table-column align="center" type="index" label="序号" width="50"> </el-table-column>
                <el-table-column align="center" prop="coverImg" label="商品图片">
                    <template slot-scope="scope">
                        <img :src="scope.row.coverImg" alt="" style="width: auto;height: 50px" />
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="goodsName" :show-overflow-tooltip="true" label="商品名称"> </el-table-column>
                <el-table-column align="center" prop="groupName" label="商品类别"> </el-table-column>
                <el-table-column align="center" prop="salePrice" label="销售价格(元)">
                    <template slot-scope="scope">
                        <span>{{ scope.row.salePrice / 100 }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="discountPrice" label="活动价(元)">
                    <template slot-scope="scope">
                        <span>{{ scope.row.discountPrice / 100 }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="sales" label="已销量"> </el-table-column>
                <el-table-column align="center" label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button type="primary" plain size="mini" @click="viewInfo(scope.row)">详情</el-button>
                        <el-button type="success" plain size="mini" @click="relevanceGoods(scope, tableData)">关联到推荐位</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagin"><el-pagination background layout="total,prev, pager, next" @current-change="currentchange" :total="total" :page-size="pageSize"> </el-pagination></div>
            <span class="footer_action"> <el-button type="primary" @click="$router.go(-1)" size="mini">返回列表</el-button> </span>
        </div>
    </div>
</template>

<script>
import qs from 'qs';
var co = require('co');
var OSS = require('ali-oss');
export default {
    name: 'Shopdetail',
    data() {
        return {
            tableData: [], //页面初始数据
            formData: {
                shopId: '',
            },
            total: 0,
            groupId: null,
            shopId: null,
            pageNum: 1, //当前页数
            pageSize: 8, //每页数量
            value: '', //店铺类型下拉绑定的key值
            dialogVisible: false,
            type: '', //店铺类型
            shoplist: [],
            oldUrl: '',
        };
    },
    activated() {
        this.tableData = [];
        this.groupId = this.$route.query.groupId;
        if (this.$route.query.shopId) {
            this.shopId = this.$route.query.shopId;
        }
        this.type = this.$route.query.type;
        this.getShopSelect();
    },
    deactivated() {
        this.formData.shopId = '';
        this.shopId = '';
    },
    methods: {
        //关联商品列表
        relevanceList() {
            const that = this;
            this.$http
                .get(this.$http.adornUrl2('/v1/product/goods'), {params: {excludeGroupId: that.groupId, shopId: that.shopId, pageNum: that.pageNum, pageSize: that.pageSize}})
                .then(function(res) {
                    if (res.data.code == 200) {
                        that.tableData = res.data.data.list;
                        that.total = res.data.data.total;
                    }
                });
        },
        // 店铺下拉选择
        getShopSelect() {
            var paramType = '';
            if (this.type == 21 || this.type == 11) {
                paramType = 1; //美食
            }
            if (this.type == 31 || this.type == 12) {
                paramType = 2; //优品
            }
            const that = this;
            this.$http.get(this.$http.adornUrl2('/v1/merchant/shops/options'), {params: {type: paramType}}).then(function(res) {
                if (res.data.code == 200) {
                    that.shoplist = res.data.data.options;
                    that.formData.shopId = that.shoplist[0].shopId;
                    that.shopId = that.shoplist[0].shopId;
                    that.relevanceList();
                }
            });
        },
        // 选择店铺切换数据
        shopChange(value) {
            this.shopId = value;
            this.relevanceList();
        },
        //关联到推荐位
        relevanceGoods(item, rows) {
            //console.log(item)
            const goodsId = item.row.goodsId;
            //console.log(goodsId)
            const that = this;
            this.$http.post(this.$http.adornUrl2('/v1/product/groups/' + this.groupId + '/goods/' + goodsId)).then(function(res) {
                if (res.data.code == 201) {
                    that.relevanceList();
                }
            });
        },
        //商品列表分页
        currentchange(value) {
            this.pageNum = value;
            this.relevanceList();
        },
        //查看详情
        viewInfo(shopping) {
            //console.log(shopping);
            // this.dialogVisible = true;
            this.$router.push({path: '/goodsdetail', query: {goodsId: shopping.goodsId}});
        },
    },
};
</script>
<style lang="scss" scoped>
.admin {
    position: relative;
    span.footer_action {
        position: absolute;
        left: 50px;
        bottom: 0;
    }
}
</style>
