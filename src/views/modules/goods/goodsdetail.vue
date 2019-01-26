<template>
    <div class="goodsDetail">
        <div class="head">
            <h3>商品详情</h3>
            <span class="footer_action"> <el-button type="primary" @click="$router.go(-1)" size="mini">返回</el-button> </span>
        </div>
        <ul class="shop_box">
            <li class="goods_type"><span>商品名称:</span> <span>商品类别:</span> <span>活动价格:</span> <span>销售价格:</span> <span>库存数量:</span> <span>限购数量:</span> <span>销售数量:</span></li>
            <li class="goods_type">
                <span>{{ shoppingdata.goodsName }}</span> <span>{{ shoppingdata.groupName }}</span> <span>{{ shoppingdata.discountPrice }}</span> <span>{{ shoppingdata.salePrice }}</span>
                <span>{{ shoppingdata.stock }}</span> <span>{{ shoppingdata.limitNum }}</span> <span>{{ shoppingdata.sales }}</span>
            </li>
            <li class="deteail">商品详情</li>
            <li class="img_box">
                <div>
                    <label>商品图片:</label><span class="ml10" v-for="(item, index) in bannerImgList" :key="index"><img :src="item" alt=""/></span>
                </div>
                <div>
                    <label>商品详情:</label><span class="ml10" v-for="(item, index) in detailImgList" :key="index"><img :src="item" alt=""/></span>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'Shopdetail',
    data() {
        return {
            shoppingdata: {},
            bannerImgList: [],
            detailImgList: [],
        };
    },
    activated: function() {
        this.searchshopdet();
        //console.log("我刷新了啊")
    },
    deactivated() {
        this.bannerImgList = [];
        this.detailImgList = [];
    },
    methods: {
        searchshopdet() {
            var that = this;
            var goodsId = this.$route.query.goodsId; //路由跳转拿到参数
            this.$http.get(this.$http.adornUrl2('/v1/product/goods/' + goodsId + '/details')).then(function(res) {
                if (res.data.code == 200) {
                    that.shoppingdata = res.data.data;
                    that.shoppingdata.discountPrice = that.shoppingdata.discountPrice / 100;
                    that.shoppingdata.salePrice = that.shoppingdata.salePrice / 100;
                    if (res.data.data.bannerImg.indexOf(',') != -1) {
                        that.bannerImgList = res.data.data.bannerImg.split(',');
                    } else {
                        that.bannerImgList.push(res.data.data.bannerImg);
                    }
                    if (res.data.data.detailImg.indexOf(',') != -1) {
                        that.detailImgList = res.data.data.detailImg.split(',');
                    } else {
                        that.detailImgList.push(res.data.data.detailImg);
                    }
                }
            });
        },
    },
};
</script>
<style lang="scss" scoped>
.head {
    display: flex;
    justify-content: space-between;
}
span.footer_action {
    display: inline-block;
    margin-top: 7px;
}
.box {
    display: flex;
    div {
        width: 20%;
        margin-top: 15px;
        font-size: 16px;
    }
    label {
        color: #3e8ef7;
        margin-right: 15px;
    }
}
.lastdiv {
    margin-top: 15px;
    font-size: 16px;
    img {
        vertical-align: top;
    }
    label {
        color: #3e8ef7;
        margin-right: 15px;
    }
    div {
        width: 50%;
    }
}
.shop_box {
    padding-left: 0;
    .goods_type {
        display: flex;
        span {
            width: 14.2%;
            text-align: center;
            padding: 20px 0;
            border-top: 1px solid #ccc;
            border-left: 1px solid #ccc;
        }
        span:nth-child(1) {
            flex: 1;
        }
        span:nth-child(7) {
            border-right: 1px solid #ccc;
        }
    }
    .deteail {
        border: 1px solid #ccc;
        border-bottom: 0;
        padding: 20px 10px;
    }
    .img_box {
        display: flex;
        border: 1px solid #ccc;
        padding: 20px 10px;
        img {
            vertical-align: top;
        }
        div {
            width: 50%;
        }
    }
}
</style>
