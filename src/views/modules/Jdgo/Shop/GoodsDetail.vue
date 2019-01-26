<template>
    <el-row class="goods_info" v-loading="loading">
        <h3>详情预览</h3>
        <ul>
            <li class="ml30">
                <label>商品标题：</label> <span>{{ goodsInfo.name }}</span>
            </li>
            <li class="img_list ml30">
                <label>商品图片：</label>
                <el-row v-for="(item, index) in imageList" :key="index">
                    <el-popover placement="right" trigger="click">
                        <img :src="item" style="max-width:720px;max-height:600px;" /> <img slot="reference" :src="item" style="width:100px;max-height:100px;" />
                    </el-popover>
                </el-row>
            </li>
            <h4>商品参数：</h4>
            <li class="flex type_box ml30">
                <el-row>
                    <label>skuid：</label> <span>{{ goodsInfo.skuId }}</span>
                </el-row>
                <el-row>
                    <label>类目：</label> <span>{{ goodsInfo.thirdCatName }}</span>
                </el-row>
                <el-row>
                    <label>类目ID：</label> <span>{{ goodsInfo.thirdCatId }}</span>
                </el-row>
                <el-row>
                    <label>零售价：</label> <span>{{ goodsInfo.salePrice | newPrice }}</span
                    ><span>元</span>
                </el-row>
                <el-row>
                    <label>京东商城价：</label> <span>{{ goodsInfo.jdPrice | newPrice }}</span
                    ><span>元</span>
                </el-row>
                <el-row>
                    <label>京东协议价：</label> <span>{{ goodsInfo.protocolPrice | newPrice }}</span
                    ><span>元</span>
                </el-row>
                <el-row>
                    <label>产地：</label> <span>{{ goodsInfo.productArea }}</span>
                </el-row>
            </li>
            <li class="flex type_box ml30">
                <el-row>
                    <label>销量：</label> <span>{{ goodsInfo.sales }}</span>
                </el-row>
                <el-row>
                    <label>单位：</label> <span>{{ goodsInfo.saleUnit }}</span>
                </el-row>
                <el-row>
                    <label>重量：</label> <span>{{ goodsInfo.weight }}</span>
                </el-row>
                <el-row>
                    <label>库存状态：</label> <span>{{ goodsInfo.stock | stockState }}</span>
                </el-row>
                <el-row>
                    <label>上下架状态：</label> <span>{{ goodsInfo.state | upperState }}</span>
                </el-row>
                <el-row>
                    <label>是否启用：</label> <span>{{ goodsInfo.isEnable | enableState }}</span>
                </el-row>
                <el-row>
                    <label>更新时间：</label> <span>{{ goodsInfo.updatedAt | timeFormate }}</span>
                </el-row>
            </li>
            <h4>规格参数：</h4>
            <li class="ml30" v-html="goodsInfo.param"></li>
            <h4>详情：</h4>
            <li class="rich_text" v-html="goodsInfo.appintroduce"></li>
            <li></li>
            <li></li>
        </ul>
    </el-row>
</template>
<script>
export default {
    data() {
        return {
            goodsInfo: {},
            loading: true,
            imageList: [],
        };
    },
    methods: {
        init() {
            this.loading = true;
            Object.assign(this.$data, this.$options.data());
            this.getGoodsInfo();
        },
        getGoodsInfo() {
            const skuId = this.$route.query.id;
            this.$http({
                url: this.$http.adornUrl5('/v1/product/good/' + skuId + '/detail'),
                method: 'get',
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.goodsInfo = data.data;
                    this.imageList = data.data.imageList.split(',');
                    this.loading = false;
                }
            });
        },
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.init();
        });
    },
};
</script>
<style lang="scss" scoped>
.goods_info {
    ul {
        padding: 0;
    }
    li {
        margin-top: 20px;
        margin-bottom: 20px;
    }
    li.type_box {
        .el-row {
            width: 14.2%;
            display: flex;
        }
    }
    .img_list {
        display: flex;
        justify-content: flex-start;
        .el-row {
            margin-left: 10px;
        }
    }
}
</style>
