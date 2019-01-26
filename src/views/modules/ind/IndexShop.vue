<template>
    <div class="crossProduct">
        <!-- 超级管理员 -->
        <div class="admin">
            <el-table :data="tableData" center="all" border style="width: 100%">
                <el-table-column align="center" prop="goodsId" label="商品id" width="60"> </el-table-column>
                <el-table-column align="center" prop="coverImg" label="商品图片">
                    <template slot-scope="scope">
                        <img :src="scope.row.coverImg" alt="" style="width: auto;height: 50px" />
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="goodsName" :show-overflow-tooltip="true" label="商品名称"> </el-table-column>
                <el-table-column align="center" prop="groupName" label="商品类别"> </el-table-column>
                <el-table-column align="center" prop="shopName" :show-overflow-tooltip="true" label="店铺"> </el-table-column>
                <el-table-column align="center" prop="salePrice" label="销售价(元)">
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
                <el-table-column align="center" label="操作" width="350">
                    <template slot-scope="scope">
                        <el-button type="primary" plain size="mini" @click="viewInfo(scope.row)">详情</el-button>
                        <el-button type="success" plain size="mini" @click="relevanceGoods(scope.row)">取消关联</el-button>
                        <el-button type="success" plain size="mini" @click="goodsSort(scope.row, 2)">上移</el-button>
                        <el-button type="success" plain size="mini" @click="goodsSort(scope.row, 3)">下移</el-button>
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
            total: 0,
            pageNum: 1, //当前页数
            pageSize: 8, //每页数量
            groupId: null,
        };
    },
    activated() {
        this.groupId = this.$route.query.groupId;
        this.relevanceList();
    },
    methods: {
        //关联商品列表
        relevanceList() {
            var that = this;
            this.$http.get(this.$http.adornUrl2('/v1/product/groups/' + this.groupId + '/goods'), {params: {pageNum: that.pageNum, pageSize: that.pageSize}}).then(function(res) {
                //console.log(res.data.data);
                if (res.data.code == 200) {
                    that.tableData = res.data.data.list;
                    that.total = res.data.data.total;
                }
            });
        },
        //取消关联商品
        relevanceGoods(item) {
            //console.log(item.goodsId)
            const that = this;
            const goodsId = item.goodsId;
            this.$http.delete(this.$http.adornUrl2('/v1/product/groups/' + this.groupId + '/goods/' + goodsId)).then(function(res) {
                that.relevanceList();
            });
        },
        //分页
        currentchange(value) {
            this.pageNum = value;
            this.relevanceList();
        },
        //查看详情
        viewInfo(shopping) {
            this.$router.push({path: '/goodsdetail', query: {goodsId: shopping.goodsId}});
        },
        //关联商品排序--上移/下移
        goodsSort(item, type) {
            //console.log(item)
            //console.log(type)
            const goodsId = item.goodsId;
            const that = this;
            const param = {type: type};
            this.$http.put(this.$http.adornUrl2('/v1/product/groups/' + this.groupId + '/goods/' + goodsId + '/sorts'), param).then(function(res) {
                if (res.data.code == 201) {
                    that.relevanceList();
                }
            });
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
