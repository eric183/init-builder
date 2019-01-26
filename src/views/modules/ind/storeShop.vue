<template>
    <div class="crossProduct">
        <!--分组进去的店铺列表 -->
        <div class="admin">
            <el-table :data="tableData" center="all" border style="width: 100%">
                <el-table-column align="center" prop="shopId" label="店铺id" width="60"> </el-table-column>
                <el-table-column align="center" prop="shopName" label="店铺名称"> </el-table-column>
                <el-table-column align="center" prop="brief" :show-overflow-tooltip="true" label="店铺介绍"> </el-table-column>
                <el-table-column align="center" prop="operator" label="店主姓名"> </el-table-column>
                <el-table-column align="center" prop="contact" label="店主联系方式"> </el-table-column>
                <el-table-column align="center" label="操作" width="150">
                    <template slot-scope="scope">
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
            type: null,
        };
    },
    activated() {
        this.type = this.$route.query.type;
        this.relevanceList();
    },
    methods: {
        //关联商品列表
        relevanceList() {
            var paramType = '';
            if (this.type == 21) {
                paramType = 1; //美食
            }
            if (this.type == 31) {
                paramType = 2; //优品
            }
            const that = this;
            this.$http.get(this.$http.adornUrl2('/v1/merchant/shops'), {params: {pageNum: that.pageNum, pageSize: that.pageSize, type: paramType}}).then(function(res) {
                //console.log(res.data.data);
                if (res.data.code == 200) {
                    that.tableData = res.data.data.list;
                    that.total = res.data.data.total;
                }
            });
        },
        //分页
        currentchange(value) {
            this.pageNum = value;
            this.relevanceList();
        },
        //关联商品排序--上移/下移
        goodsSort(item, type) {
            //console.log(item)
            //console.log(type)
            const goodsId = item.goodsId;
            const that = this;
            const param = {type: type};
            this.$http.put(this.$http.adornUrl2('/v1/merchant/shops/' + item.shopId + '/sorts'), param).then(function(res) {
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
