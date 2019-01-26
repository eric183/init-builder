<template>
    <div class="showdetail">
        <!-- 店主 -->
        <el-form label-width="50px" size="small" :model="dataForm" :inline="true">
            <el-form-item label="分组:">
                <el-select placeholder="请选择" v-model="dataForm.groupId" clearable>
                    <el-option v-for="item in grouplist" :key="item.groupId" :label="item.groupName" :value="item.groupId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="名称:" class="ml10"> <el-input placeholder="商品名称" v-model="dataForm.goodsName" clearable></el-input> </el-form-item>
            <el-form-item label="状态:" class="ml10">
                <el-select placeholder="请选择" v-model="dataForm.status"> <el-option v-for="item in statuslist" :key="item.value" :label="item.label" :value="item.value"></el-option> </el-select>
            </el-form-item>
            <el-form-item>
                <el-button size="small" type="primary" @click="getDataListFun()">查询</el-button>
                <el-button type="success" v-if="isAuth('product:goods:addGoods')" size="mini" @click="add()">添加商品</el-button>
            </el-form-item>
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
                        <span class="color_name" @click="detail(scope.row)">{{ scope.row.goodsName }}</span>
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
                <el-table-column prop="sales" align="center" label="销量"> </el-table-column>
                <el-table-column prop="stock" align="center" label="库存"> </el-table-column>
                <el-table-column align="center" label="操作" width="320">
                    <template slot-scope="scope">
                        <el-button type="success" plain size="mini" @click="addRecommend(scope.row)" v-if="scope.row.isOnShopRecommend == 0">添加推荐</el-button>
                        <el-button type="danger" plain size="mini" @click="removeRecommend(scope.row)" v-if="scope.row.isOnShopRecommend == 1">取消推荐</el-button>
                        <el-button type="success" plain size="mini" v-if="isAuth('product:groups:sortGroupGoods')" @click="setTop(scope.row)">置顶</el-button>
                        <el-button type="success" v-if="isAuth('product:goods:updateGoods')" plain size="mini" @click="edit(scope.row.goodsId)">编辑</el-button>
                        <el-button type="danger" v-if="isAuth('product:goods:deleteGoods')" plain size="mini" @click="isdelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagin"><el-pagination background layout="total,prev, pager, next" @current-change="currentchange" :total="total" :page-size="pageSize"> </el-pagination></div>
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
            shopId: null, //登录时候选择店铺，先写死
            value1: '',
            dataForm: {
                goodsName: '',
                status: null,
                groupId: null,
            },
            type: null, //分组查询需要的type
            total: 0,
            pageNum: 1, //当前页数
            pageSize: 8, //每页数量
            goodsId: 0, //选中的商品id
            isShowRecommend: false, //添加推荐位/取消推荐位按钮，默认不展示
            statuslist: [{value: null, label: '全部'}, {value: 1, label: '待上架'}, {value: 2, label: '已上架'}, {value: 3, label: '已下架'}],
            grouplist: [],
        };
    },
    activated: function() {
        this.getStoreId();
        this.searchshopinglist();
    },
    methods: {
        getDataListFun() {
            this.pageNum = 1;
            this.searchshopinglist();
        },
        // 查询列表数据
        searchshopinglist() {
            var that = this;
            this.$http
                .get(this.$http.adornUrl2('/v1/product/goods'), {
                    params: {
                        shopId: that.shopId,
                        pageNum: that.pageNum,
                        pageSize: that.pageSize,
                        goodsName: that.dataForm.goodsName,
                        status: that.dataForm.status,
                        groupId: that.dataForm.groupId,
                    },
                })
                .then(function(res) {
                    if (res.data.code == 200) {
                        that.tableData = res.data.data.list;
                        that.total = res.data.data.total;
                    } else {
                        that.tableData = [];
                        that.total = 0;
                    }
                })
                .catch(function(error) {
                    that.$message.error(error);
                });
        },
        // 获取分组列表
        getRroup() {
            this.$http({
                url: this.$http.adornUrl2('/v1/product/groups'),
                method: 'get',
                params: this.$http.adornParams({
                    type: this.type,
                    shopId: this.shopId,
                }),
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.grouplist = data.data.list;
                }
            });
        },
        // 获取店铺id信息
        getStoreId() {
            this.shops = JSON.parse(sessionStorage.getItem('shops') || '[]');
            if (this.shops.length > 0) {
                this.shopId = this.shops[0].shopId;
                if (this.shops[0].shopType == 1) {
                    this.type = 22; //美食
                    this.getRroup();
                } else if (this.shops[0].shopType == 2) {
                    this.type = 32; //优品
                    this.getRroup();
                }
            } else {
                this.$message.error('登录没返回该店主的角色');
            }
        },
        // 添加推荐位
        addRecommend(value) {
            const that = this;
            //console.log(value)
            this.$http({
                url: this.$http.adornUrl2('/v1/product/groups/' + value.recommendGroupId + '/goods/' + value.goodsId),
                method: 'post',
            }).then(({data}) => {
                //console.log(data)
                if (data && data.code === 201) {
                    this.searchshopinglist();
                }
            });
        },
        // 取消推荐位
        removeRecommend(value) {
            // v1/shopRecommended/"+value.recommendRelationId
            this.$http({
                url: this.$http.adornUrl2('/v1/product/groups/' + value.recommendGroupId + '/goods/' + value.goodsId),
                method: 'delete',
            })
                .then(({data}) => {
                    this.searchshopinglist();
                })
                .catch(function(error) {
                    that.$message.error(error);
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
        currentchange(value) {
            this.pageNum = value;
            this.searchshopinglist();
        },
        // 修改商品上下线状态
        auditStatusFun(value) {
            const that = this;
            this.$http.put(this.$http.adornUrl2('/v1/product/goods/' + value.goodsId), {status: value.status}).then(function(res) {
                if (res.data.code == 201) {
                    that.searchshopinglist();
                }
            });
        },
        add() {
            this.$router.push({path: '/goods-add'});
        },
        edit(goodsId) {
            this.$router.push({
                path: '/goods-add',
                query: {goodsId: goodsId},
            });
        },
        detail(shopping) {
            var goodsId = shopping.goodsId; //商品id
            this.$router.push({
                path: '/goodsdetail',
                query: {goodsId: goodsId},
            });
        },
        isdelete(shopping) {
            var goodsId = shopping.goodsId; //商品id
            const that = this;
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                //this.$http.adornUrl("/v1/goods/"+goodsId
                this.$http
                    .delete(this.$http.adornUrl2('/v1/product/goods/' + goodsId))
                    .then(function(res) {
                        that.searchshopinglist();
                    })
                    .catch(function(error) {
                        that.$message.error(error);
                    });
            });
        },
    },
};
</script>
