<template>
    <div class="storedetail">
        <!-- 店铺列表、运营看的 -->
        <div class="admin">
            <p style="text-align:right"><el-button type="primary" size="mini" @click="add()">新增店铺</el-button></p>
            <el-table :data="tableData" border style="width: 100%">
                <el-table-column align="center" prop="shopId" label="店铺id" width="60"> </el-table-column>
                <el-table-column align="center" prop="shopName" :show-overflow-tooltip="true" label="店铺名称"> </el-table-column>
                <el-table-column align="center" prop="operator" label="店主姓名"> </el-table-column>
                <el-table-column align="center" prop="operatorContact" label="店主联系方式"> </el-table-column>
                <el-table-column align="center" prop="createdAt" :show-overflow-tooltip="true" :formatter="auditPassTime" min-width="100" label="开店时间"> </el-table-column>
                <el-table-column align="center" prop="type" :formatter="formatType" label="店铺类型"> </el-table-column>
                <el-table-column align="center" prop="brief" min-width="160" :show-overflow-tooltip="true" label="店铺介绍"> </el-table-column>
                <el-table-column align="center" prop="auditStatus" width="140" label="状态">
                    <template slot-scope="scope">
                        <el-switch
                            :width="35"
                            :disabled="!isAuth('merchant:shops:updateShop')"
                            v-model="scope.row.auditStatus"
                            @change="auditStatusFun(scope.row)"
                            active-text="正常"
                            :active-value="2"
                            inactive-text="停用"
                            :inactive-value="4"
                        >
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="220">
                    <template slot-scope="scope">
                        <el-button type="primary" plain size="mini" @click="detail(scope.row)">详情</el-button>
                        <el-button type="success" plain size="mini" @click="firstSort(scope.row.shopId, 1)">置顶</el-button>
                        <!-- <el-button type="success" plain size="mini" @click="firstSort(scope.row.shopId,2)">上移</el-button>
                <el-button type="success" plain size="mini" @click="firstSort(scope.row.shopId,3)">下移</el-button> -->
                        <el-button type="danger" plain size="mini" @click="isdelete(scope.row)">删除</el-button>
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
        <!-- 店铺列表的新增 -->
        <el-dialog :visible.sync="storeAdddialog" :close-on-click-modal="false">
            <el-form ref="storeAddform" :model="storeAddform" :rules="storeAddRule" label-width="120px" size="small">
                <div class="dialogbox">
                    <el-form-item label="店铺类型" prop="type">
                        <el-select placeholder="请选择" v-model="storeAddform.type">
                            <el-option v-for="item in shopTypelist" :key="item.groupId" :label="item.groupName" :value="item.groupId"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="店铺名称" prop="shopName"> <el-input placeholder="店铺名称请在10个字以内(含)" clearable v-model="storeAddform.shopName"></el-input> </el-form-item>
                </div>
                <div class="dialogbox">
                    <el-form-item label="店铺介绍" prop="shopIntroduce">
                        <el-input placeholder="店铺介绍请在50个字以内(含)" type="textarea" clearable v-model="storeAddform.shopIntroduce"></el-input>
                    </el-form-item>
                </div>
                <div class="dialogbox">
                    <el-form-item label="店铺地址" prop="address"> <el-input placeholder="请输入内容" clearable v-model="storeAddform.address"></el-input> </el-form-item>
                </div>
                <div class="dialogbox">
                    <el-form-item label="店主姓名" prop="ownerName"> <el-input placeholder="请输入内容" clearable v-model="storeAddform.ownerName"></el-input> </el-form-item>
                    <el-form-item label="店主联系方式" prop="ownerContact"> <el-input placeholder="请输入内容" clearable v-model="storeAddform.ownerContact"></el-input> </el-form-item>
                    <el-form-item label="店主身份证号" prop="idCard"> <el-input placeholder="请输入内容" clearable v-model="storeAddform.idCard"></el-input> </el-form-item>
                </div>
                <el-form-item>
                    <el-button type="primary" size="mini" @click="addconfirm('storeAddform')">确认</el-button>
                    <el-button size="mini" @click="addcancel('storeAddform')">取消</el-button>
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
            tableData: [], //页面初始数据
            shopId: null, //登录时候选择店铺，先写死
            shops: [],
            value1: '',
            total: 0,
            pageNum: 1, //当前页数
            pageSize: 10, //每页数量
            goodsId: 0, //选中的商品id
            storeAdddialog: false,
            storeAddform: {
                //新增的店铺参数
                address: '',
                idCardNo: '',
                operatorContact: '',
                operator: '',
                brief: '',
                shopName: '',
                type: '',
            },
            shopTypelist: [
                //新增时候的店铺类型
                {
                    groupId: 1,
                    groupName: '美食',
                },
                {
                    groupId: 2,
                    groupName: '优品',
                },
            ],
            fileList1: [],
            fileList2: [],
            storeAddRule: {
                type: [{required: true, message: '请选择店铺类别', trigger: 'blur'}],
                shopName: [{required: true, message: '请输入店铺名称', trigger: 'blur'}, {min: 2, max: 10, message: '长度在 2 到 10 个字之间', trigger: 'blur'}],
                shopIntroduce: [{min: 2, max: 50, message: '长度在 2 到 50 个字之间', trigger: 'blur'}],
                address: [{required: true, message: '请输入店铺地址', trigger: 'blur'}],
                ownerName: [{required: true, message: '请输入店主姓名', trigger: 'blur'}],
                ownerContact: [{required: true, message: '请输入店主联系方式', trigger: 'blur'}],
                idCard: [{required: true, message: '请输入店主身份证号', trigger: 'blur'}],
            },
        };
    },
    activated: function() {
        this.searchshopinglist();
    },
    methods: {
        // 查询列表数据
        searchshopinglist() {
            var that = this;
            this.$http.get(this.$http.adornUrl2('/v1/merchant/shops'), {params: {pageNum: this.pageNum, pageSize: this.pageSize}}).then(function(res) {
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
        // 新增
        add() {
            this.storeAddform = {};
            this.storeAdddialog = true;
        },
        // 详情
        detail(shopping) {
            const shopId = shopping.shopId; //店铺id
            this.$router.push({path: '/sto-stoinfo', query: {shopId: shopId}});
        },
        // 删除
        isdelete(shopping) {
            var shopId = shopping.shopId; //店铺id
            var that = this;
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    this.$http.delete(this.$http.adornUrl2('/v1/merchant/shops/' + shopId)).then(function(res) {
                        that.searchshopinglist();
                    });
                })
                .catch(() => {});
        },
        // 置顶
        firstSort(id, param) {
            this.$http({
                url: this.$http.adornUrl2('/v1/merchant/shops/' + id + '/sorts'),
                method: 'put',
                data: this.$http.adornData({
                    type: param,
                }),
            }).then(({data}) => {
                if (data && data.code === 201) {
                    this.searchshopinglist();
                }
            });
        },
        // 新增的确定
        addconfirm() {
            const that = this;
            this.$refs['storeAddform'].validate(valid => {
                if (valid) {
                    this.$http
                        .post(this.$http.adornUrl2('/v1/merchant/shops'), {
                            address: this.storeAddform.address,
                            idCardNo: this.storeAddform.idCard,
                            operatorContact: this.storeAddform.ownerContact,
                            operator: this.storeAddform.ownerName,
                            brief: this.storeAddform.shopIntroduce,
                            shopName: this.storeAddform.shopName,
                            type: this.storeAddform.type,
                        })
                        .then(function(res) {
                            if (res.data.code == 201) {
                                that.searchshopinglist();
                                that.$message({
                                    type: 'success',
                                    duration: 1500,
                                    message: '新增成功',
                                });
                                that.storeAdddialog = false;
                            }
                        });
                }
            });
        },
        addcancel() {
            this.storeAdddialog = false;
        },
        // 修改店铺状态
        auditStatusFun(value) {
            var that = this;
            //this.$http.adornUrl("/v1/shops/"+value.shopId
            this.$http.put(this.$http.adornUrl2('/v1/merchant/shops/' + value.shopId), {shopBasicInfo: {auditStatus: value.auditStatus}}).then(function(res) {
                if (res.data.code == 201) {
                    that.$message.error('修改成功');
                }
            });
        },
        //开店时间
        auditPassTime(item) {
            return commonFunc.commonFunc(item.createdAt);
        },
        // 后端返回的数字，转换成中文
        formatType(row, column) {
            switch (row.type) {
                case 1:
                    return '美食';
                    break;
                case 2:
                    return '优品';
                    break;
            }
        },
    },
};
</script>
