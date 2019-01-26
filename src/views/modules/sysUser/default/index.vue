<template>
    <div class="mod-user">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataListFun()" size="small">
            <el-form-item label="认证:">
                <el-select v-model="dataForm.status" placeholder="认证状态"> <el-option v-for="item in statuslist" :key="item.value" :label="item.label" :value="item.value"></el-option> </el-select>
            </el-form-item>
            <el-form-item> <el-input v-model="dataForm.realname" placeholder="姓名" clearable></el-input> </el-form-item>
            <el-form-item label="性别:" class="ml10">
                <el-select v-model="dataForm.gender" placeholder="性别"> <el-option v-for="item in genderlist" :key="item.value" :label="item.label" :value="item.value"></el-option> </el-select>
            </el-form-item>
            <el-form-item> <el-input v-model="dataForm.phone" placeholder="手机号" clearable></el-input> </el-form-item>
            <el-form-item> <el-button type="primary" v-if="isAuth('user:users:page')" @click="getDataListFun()">查询</el-button> </el-form-item>
        </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
            <el-table-column type="index" header-align="center" align="center" width="50" label="序号"> </el-table-column>
            <el-table-column prop="realname" header-align="center" align="center" label="姓名"> </el-table-column>
            <!-- <el-table-column
        prop="nickname"
        header-align="center"
        align="center"
        label="昵称">
      </el-table-column> -->
            <el-table-column prop="phone" header-align="center" align="center" label="手机号"> </el-table-column>
            <el-table-column prop="gender" :formatter="formatType" header-align="center" align="center" label="性别"> </el-table-column>
            <el-table-column header-align="center" align="center" min-width="200" :show-overflow-tooltip="true" label="公司名称">
                <template slot-scope="scope">
                    <span class="mr10" v-for="item in scope.row.companyList" :key="item.companyId">{{ item.name }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="status" :formatter="formatAuth" header-align="center" align="center" label="认证状态"> </el-table-column>
            <el-table-column prop="createdAt" :formatter="createdAt" header-align="center" align="center" min-width="90" :show-overflow-tooltip="true" label="注册时间"> </el-table-column>
            <el-table-column header-align="center" align="center" width="200" label="操作">
                <template slot-scope="scope">
                    <el-button plain type="success" size="mini" @click="addOrUpdateHandle(scope.row.userId)">修改</el-button>
                    <el-button plain type="success" size="mini" @click="addPower(scope.row.userId)">店铺权限</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="pageIndex"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            :total="totalPage"
            layout="total, sizes, prev, pager, next, jumper"
        >
        </el-pagination>
        <!-- 弹窗, 新增 / 修改 -->
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate"></add-or-update>
        <el-dialog title="电商权限" :visible.sync="mersDilog" @close="closeFun">
            <el-form ref="dataFormd" :rules="dataRule" @keyup.enter.native="dataFormSubmit()" label-width="80px" size="small">
                <el-form-item label="店铺角色" prop="userShopRole">
                    <el-select v-model="userShopRole"> <el-option v-for="item in userShopRoleList" :key="item.value" :label="item.label" :value="item.value"></el-option> </el-select>
                </el-form-item>
                <!--  aria-checked="true" mers -->
            </el-form>
            <el-table :data="dataListMers" ref="table" border @selection-change="selectionChange" style="width: 100%;">
                <el-table-column type="selection" header-align="center" align="center" width="50"> </el-table-column>
                <el-table-column type="index" header-align="center" align="center" width="50" label="序号"> </el-table-column>
                <el-table-column prop="shopName" header-align="center" align="center" label="店铺名称 "> </el-table-column>
                <el-table-column prop="shopId" header-align="center" align="center" label="店铺ID "> </el-table-column>
                <el-table-column prop="type" :formatter="type" header-align="center" align="center" label="店铺类型 "> </el-table-column>
            </el-table>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageIndexAdmin"
                :page-size="pageSizeAdmin"
                :total="totalAdmin"
                layout="total, prev, pager, next, jumper"
            >
            </el-pagination>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="mersDilog = false">取消</el-button>
                <el-button size="small" type="primary" @click="bund()">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {commonFunc} from '@/utils/resources/index.js';
import AddOrUpdate from './user-add-or-update';
export default {
    data() {
        return {
            dataForm: {
                status: 1,
                companyName: '',
                realname: '',
                gender: null,
                phone: '',
            },
            statuslist: [{value: 1, label: '正常'}, {value: 2, label: '禁用'}], //是否认证列表
            genderlist: [{value: null, label: '全部'}, {value: 1, label: '男'}, {value: 2, label: '女'}, {value: 3, label: '未填'}],
            userId: null,
            dataList: [],
            pageIndex: 1,
            pageSize: 10,
            totalPage: 0,
            pageIndexAdmin: 1,
            pageSizeAdmin: 10,
            totalAdmin: 0,
            dataListMers: [],
            total: 0,
            dataListLoading: false,
            mersDilog: false,
            dataListSelections: [],
            addOrUpdateVisible: false,
            userShopRoleList: [{value: 1, label: '店主'}, {value: 2, label: '店员'}],
            userShopRole: null,
            dataRule: {
                userShopRole: [{required: true, message: '店铺角色不能为空', trigger: 'blur'}],
            },
            selectInfo: [],
            multipleSelection: [], //选中的店铺数组
        };
    },
    components: {
        AddOrUpdate,
    },
    activated() {
        this.getDataList();
    },
    methods: {
        getDataListFun() {
            this.pageIndex = 1;
            this.getDataList();
        },
        // 获取数据列表
        getDataList() {
            this.dataListLoading = true;
            this.$http({
                url: this.$http.adornUrl('/v1/user/users'),
                method: 'get',
                params: this.$http.adornParams({
                    pageNum: this.pageIndex,
                    pageSize: this.pageSize,
                    status: this.dataForm.status,
                    gender: this.dataForm.gender,
                    phone: this.dataForm.phone,
                    realname: this.dataForm.realname,
                }),
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.dataList = data.data.list;
                    this.totalPage = data.data.total;
                } else {
                    this.dataList = [];
                    this.totalPage = 0;
                }
                this.dataListLoading = false;
            });
        },
        // 每页数
        sizeChangeHandle(val) {
            this.pageSize = val;
            this.pageIndex = 1;
            this.getDataList();
        },
        // 当前页
        currentChangeHandle(val) {
            this.pageIndex = val;
            this.getDataList();
        },
        //  修改
        addOrUpdateHandle(userId) {
            this.addOrUpdateVisible = true;
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init(userId);
            });
        },
        // 点击店铺权限
        addPower(userId) {
            this.userId = userId;
            this.searchshopinglist();
            this.mersDilog = true;
        },
        // 查询用户店铺列表数据
        searchshopinglist() {
            var that = this;
            this.$http.get(this.$http.adornUrl('/v1/user/users/' + this.userId + '/shops')).then(function(res) {
                if (res.data.code == 200) {
                    that.selectInfo = res.data.data.userShops;
                    if (res.data.data.userShops.length > 0) {
                        that.userShopRole = res.data.data.userShops[0].userShopRole;
                    }
                    that.getShopList();
                } else {
                    that.selectInfo = [];
                }
            });
        },
        // 获取店铺列表
        getShopList() {
            const that = this;
            that.$http({
                url: that.$http.adornUrl2('/v1/merchant/shops'),
                method: 'get',
                params: this.$http.adornParams({
                    pageNum: this.pageIndexAdmin,
                    pageSize: this.pageSizeAdmin,
                }),
            }).then(function(res) {
                if (res.data.code == 200) {
                    that.dataListMers = res.data.data.list;
                    that.totalAdmin = res.data.data.total;
                    for (let index in that.dataListMers) {
                        var mers = that.dataListMers[index];
                        if (that.selectInfo && that.selectInfo.length > 0) {
                            for (let j in that.selectInfo) {
                                if (that.selectInfo[j].shopId === mers.shopId) {
                                    console.info(that.selectInfo[j].shopId + '++++++++++++++++++++' + mers.shopId + '   ' + index + 1);
                                    that.$nextTick(function() {
                                        that.$refs.table.toggleRowSelection(that.dataListMers[index], true); //每次更新了数据，触发这个函数即可。
                                    });
                                }
                            }
                        }
                    }
                    console.info(that.$refs.table);
                } else {
                    that.tableData = [];
                    that.total = 0;
                }
            });
        },
        // 用户绑定店铺
        bund() {
            if (this.userShopRole == '') {
                this.$message.error('请选择店铺角色');
                return false;
            }
            var list = [];
            for (var i in this.selectInfo) {
                var obj1 = {};
                obj1.shopId = this.selectInfo[i].shopId;
                obj1.shopName = this.selectInfo[i].shopName;
                obj1.shopType = this.selectInfo[i].type;
                obj1.userShopRole = this.userShopRole;
                list.push(obj1);
            }
            this.$http({
                url: this.$http.adornUrl('/v1/user/userShop'),
                method: 'post',
                data: this.$http.adornData({
                    userId: this.userId,
                    shops: list,
                }),
            }).then(({data}) => {
                if (data && data.code === 201) {
                    this.mersDilog = false;
                }
            });
        },
        selectionChange(value) {
            this.selectInfo = value;
            console.log(value);
        },
        // 电商弹框权限关闭
        closeFun() {
            this.selectInfo = []; //清空店表格多选的
            this.userShopRole = ''; //清空店铺角色下拉框
        },
        // 每页数
        handleSizeChange(val) {
            this.pageSizeAdmin = val;
            this.pageIndexAdmin = 1;
            this.getShopList();
        },
        // 当前页
        handleCurrentChange(val) {
            this.pageIndexAdmin = val;
            this.getShopList();
        },
        createdAt(item) {
            return commonFunc(item.createdAt);
        },
        // 后端返回的数字，转换成中文
        formatType(row, column) {
            switch (row.gender) {
                case 1:
                    return '男';
                    break;
                case 2:
                    return '女';
                    break;
                case 3:
                    return '未填';
                    break;
            }
        },
        formatAuth(row, column) {
            switch (row.status) {
                case 1:
                    return '正常';
                    break;
                case 0:
                    return '禁用';
                    break;
            }
        },
        type(row, column) {
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
