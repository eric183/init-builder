<template>
    <div class="showdetail">
        <!-- 类目管理 -->
        <p style="text-align:right"><el-button type="primary" v-if="isAuth('product:groups:addGroup')" size="mini" @click="add()">添加类目</el-button></p>
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column type="index" label="序号" align="center" width="50"> </el-table-column>
            <el-table-column prop="groupName" align="center" label="分类名称"> </el-table-column>
            <el-table-column prop="createdAt" align="center" :formatter="createdAt" label="创建时间"> </el-table-column>
            <el-table-column align="center" width="200" label="操作">
                <template slot-scope="scope">
                    <el-button type="success" v-if="isAuth('product:groups:updateGroup')" plain size="mini" @click="edit(scope.row)">编辑分类</el-button>
                    <el-button type="danger" v-if="isAuth('product:groups:deleteGroup')" plain size="mini" @click="isdelete(scope.row)">删除分类</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- <div class="pagin">
            <el-pagination
                background
                layout="total,prev, pager, next"
                @current-change="currentchange"
                :total="total"
                :page-size="pageSize">
            </el-pagination>
        </div> -->
        <!-- 类目管理的新增 -->
        <el-dialog :visible.sync="shopAddDialog">
            <el-form ref="shopAddform" :model="shopAddform" :rules="shopAddformRule" label-width="100px" size="small">
                <el-form-item label="类目名称" prop="groupName"> <el-input type="input" placeholder="类目名称10个字以内(含)" clearable v-model="shopAddform.groupName"></el-input> </el-form-item>
                <el-form-item label="类目描述" prop="remark"> <el-input type="input" placeholder="类目描述30个字以内(含)" clearable v-model="shopAddform.remark"></el-input> </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="mini" @click="addconfirm('shopAddform')">确认</el-button>
                    <el-button size="mini" @click="addcancel('shopAddform')">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 类目管理的编辑 -->
        <el-dialog :visible.sync="shopEditDialog">
            <el-form ref="shopEditform" :model="shopEditform" :rules="shopEditformRule" label-width="100px" size="small">
                <el-form-item label="类目名称" prop="groupName"> <el-input type="input" placeholder="类目名称10个字以内(含)" clearable v-model="shopEditform.groupName"></el-input> </el-form-item>
                <el-form-item label="类目描述" prop="remark"> <el-input type="input" placeholder="类目描述30个字以内(含)" clearable v-model="shopEditform.remark"></el-input> </el-form-item>
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
import qs from 'qs';
var co = require('co');
var OSS = require('ali-oss');
export default {
    name: 'Shopdetail',
    data() {
        return {
            tableData: [],
            total: 0,
            pageNum: 1,
            pageSize: 100,
            type: 32, //分组类型 当前页面优品类目分组
            shopAddDialog: false, //类目管理的新增弹框
            shopEditDialog: false, //类目管理的编辑弹框
            shopAddform: {
                groupName: '',
                remark: '',
            }, //类目管理的新增绑定数据
            shopEditform: {}, //类目管理的编辑绑定数据
            shopAddformRule: {
                groupName: [{required: true, message: '请选择分类名称', trigger: 'blur'}, {min: 2, max: 10, message: '长度在 2 到 10 个字之间', trigger: 'blur'}],
                remark: [{min: 2, max: 30, message: '长度在 2 到 30 个字之间', trigger: 'blur'}],
            },
            shopEditformRule: {
                groupName: [{required: true, message: '请选择分类名称', trigger: 'blur'}, {min: 2, max: 10, message: '长度在 2 到 10 个字之间', trigger: 'blur'}],
                remark: [{min: 2, max: 30, message: '长度在 2 到 30 个字之间', trigger: 'blur'}],
            },
        };
    },
    activated: function() {
        this.searchshopdet();
    },
    methods: {
        // 查询列表数据
        searchshopdet() {
            var that = this;
            this.$http
                .get(this.$http.adornUrl2('/v1/product/groups'), {
                    params: {
                        type: this.type,
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
        currentchange(val) {
            this.pageNum = value;
            this.searchshopdet();
        },
        //开店时间
        createdAt(item) {
            return commonFunc.commonFunc(item.createdAt);
        },
        add() {
            this.shopAddform = {};
            this.shopAddDialog = true;
        },
        edit(cateGory) {
            this.shopEditform = cateGory;
            this.shopEditDialog = true;
        },
        // 新增
        addconfirm() {
            var that = this;
            var param = {
                groupName: this.shopAddform.groupName,
                remark: this.shopAddform.remark,
                type: this.type,
            };
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
        editcancel() {
            this.shopEditDialog = false;
            this.$refs.shopEditform.resetFields();
        },
        // 编辑
        editconfirm() {
            var that = this;
            var param = {
                groupName: this.shopEditform.groupName,
                remark: this.shopEditform.remark,
            };
            //console.log(this.shopEditform)
            this.$refs['shopEditform'].validate(valid => {
                if (valid) {
                    this.$http.put(this.$http.adornUrl2('/v1/product/groups/' + this.shopEditform.groupId), param).then(function(res) {
                        if (res.data.code == 201) {
                            that.searchshopdet();
                            that.shopEditDialog = false;
                        }
                    });
                }
            });
        },
        isdelete(shopping) {
            var groupId = shopping.groupId; //商品id
            var that = this;
            this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                this.$http
                    .delete(this.$http.adornUrl2('/v1/product/groups/' + groupId))
                    .then(function(res) {
                        that.searchshopdet();
                        //console.log(res.data)
                    })
                    .catch(function(error) {
                        that.$message.error(error);
                    });
            });
        },
    },
};
</script>
