<template>
    <div class="showdetail">
        <!--商品分类 -->
        <p class="textright"><el-button type="primary" v-if="isAuth('product:groups:addGroup')" size="mini" @click="add()">添加分类</el-button></p>
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column type="index" align="center" label="序号" width="50"> </el-table-column>
            <el-table-column prop="groupName" align="center" label="分类名称"> </el-table-column>
            <el-table-column prop="createdAt" align="center" :formatter="createdAt" :show-overflow-tooltip="true" label="创建时间"> </el-table-column>
            <el-table-column prop="goodsCount" align="center" label="商品数"> </el-table-column>
            <el-table-column prop="remark" align="center" :show-overflow-tooltip="true" label="备注"> </el-table-column>
            <el-table-column align="center" label="操作" width="220">
                <template slot-scope="scope">
                    <el-button type="success" plain size="mini" @click="firstSort(scope.row.groupId, 1)">置顶</el-button>
                    <el-button type="success" v-if="isAuth('product:groups:updateGroup')" plain size="mini" @click="edit(scope.row)">编辑</el-button>
                    <el-button type="danger" v-if="isAuth('product:groups:deleteGroup')" plain size="mini" @click="isdelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagin"><el-pagination background layout="total,prev, pager, next" @current-change="currentchange" :total="total" :page-size="pageSize"> </el-pagination></div>
        <!-- 商品分类的新增 -->
        <el-dialog :visible.sync="shopAddDialog">
            <el-form ref="shopAddform" :model="shopAddform" :rules="shopAddformRule" label-width="100px" size="small">
                <el-form-item label="分类名称" prop="groupName"> <el-input type="input" placeholder="分类名称2~4个字(含)" clearable v-model="shopAddform.groupName"></el-input> </el-form-item>
                <el-form-item label="备注" prop="remark"> <el-input type="input" placeholder="备注30个字以内(含)" clearable v-model="shopAddform.remark"></el-input> </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="mini" @click="addconfirm('shopAddform')">确认</el-button>
                    <el-button size="mini" @click="addcancel('shopAddform')">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 商品分类的编辑 -->
        <el-dialog :visible.sync="shopEditDialog">
            <el-form ref="shopEditform" :model="shopEditform" :rules="shopEditformRule" label-width="100px" size="small">
                <el-form-item label="分类名称" prop="groupName"> <el-input type="input" placeholder="分类名称2~4个字(含)" clearable v-model="shopEditform.groupName"></el-input> </el-form-item>
                <el-form-item label="备注" prop="remark"> <el-input type="input" placeholder="备注30个字以内(含)" clearable v-model="shopEditform.remark"></el-input> </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="mini" @click="editconfirm('shopEditform')">确认</el-button>
                    <el-button size="mini" @click="editcancel('shopEditform')">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import commonFunc from '@/assets/common.js';
export default {
    name: 'Shopdetail',
    data() {
        return {
            tableData: [],
            total: 0,
            pageNum: 1,
            pageSize: 10,
            shopId: null, //登录时候选择店铺，先写死
            groupType: 22, //分组类型 当前页面为美食店铺自定义商品分组
            shopAddDialog: false,
            shopEditDialog: false,
            shopEditform: {}, //编辑分类的弹框数据
            shopAddform: {}, //编辑分类的新增数据
            shopAddformRule: {
                groupName: [{required: true, message: '请选择分类名称', trigger: 'blur'}, {min: 2, max: 4, message: '长度在 2 到 4 个字之间', trigger: 'blur'}],
                remark: [{min: 2, max: 30, message: '长度在 2 到 30 个字之间', trigger: 'blur'}],
            },
            shopEditformRule: {
                groupName: [{required: true, message: '请选择分类名称', trigger: 'blur'}, {min: 2, max: 4, message: '长度在 2 到 4 个字之间', trigger: 'blur'}],
                remark: [{min: 2, max: 30, message: '长度在 2 到 30 个字之间', trigger: 'blur'}],
            },
        };
    },
    activated: function() {
        this.getStoreId();
        this.searchshopdet();
    },
    methods: {
        // 获取店铺id信息
        getStoreId() {
            this.shops = JSON.parse(sessionStorage.getItem('shops') || '[]');
            if (this.shops.length > 0) {
                this.shopId = this.shops[0].shopId;
            } else {
                this.$message.error('登录没返回该店主的角色');
            }
        },
        searchshopdet() {
            // type为22 美食店铺自定义商品分组
            var that = this;
            this.$http
                .get(this.$http.adornUrl2('/v1/product/groups'), {
                    params: {
                        type: 22,
                        shopId: this.shopId,
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
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
                });
        },
        // 置顶
        firstSort(id, param) {
            this.$http({
                url: this.$http.adornUrl2('/v1/product/groups/' + id + '/sorts'),
                method: 'put',
                data: this.$http.adornData({
                    type: param,
                }),
            }).then(({data}) => {
                if (data && data.code === 201) {
                    this.searchshopdet();
                }
            });
        },
        //开店时间
        createdAt(item) {
            return commonFunc.commonFunc(item.createdAt);
        },
        currentchange(value) {
            this.pageNum = value;
            this.searchshopdet();
        },
        add() {
            this.shopAddform = {};
            this.shopAddDialog = true;
        },
        edit(shopping) {
            this.shopEditform = shopping;
            this.shopEditDialog = true;
        },
        // 新增
        addconfirm() {
            var that = this;
            var param = {shopId: this.shopId, groupName: this.shopAddform.groupName, remark: this.shopAddform.remark, type: this.groupType};
            this.$refs['shopAddform'].validate(valid => {
                if (valid) {
                    this.$http.post(this.$http.adornUrl2('/v1/product/groups'), param).then(function(res) {
                        if (res.data.code == 201) {
                            that.searchshopdet();
                            that.shopAddDialog = false;
                        }
                    });
                }
            });
        },
        addcancel() {
            this.shopAddDialog = false;
            this.$refs.shopAddform.resetFields();
        },
        // 编辑
        editconfirm() {
            //console.log(this.shopEditform)
            var that = this;
            this.$refs['shopEditform'].validate(valid => {
                if (valid) {
                    this.$http
                        .put(this.$http.adornUrl2('/v1/product/groups/' + this.shopEditform.groupId), {groupName: that.shopEditform.groupName, remark: this.shopEditform.remark})
                        .then(function(res) {
                            if (res.data.code == 201) {
                                that.searchshopdet();
                                that.$message({
                                    type: 'success',
                                    message: '编辑成功!',
                                });
                                that.shopEditDialog = false;
                            }
                        });
                }
            });
        },
        editcancel() {
            this.shopEditDialog = false;
            this.$refs.shopEditform.resetFields();
        },
        isdelete(shopping) {
            var groupId = shopping.groupId; //商品id
            var that = this;
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                this.$http
                    .delete(this.$http.adornUrl2('/v1/product/groups/' + groupId))
                    .then(function(res) {
                        that.searchshopdet();
                    })
                    .catch(function(error) {
                        that.$message.error(error);
                    });
            });
        },
    },
};
</script>
