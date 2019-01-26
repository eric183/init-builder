<template>
    <div class="mod-user">
        <p class="textright"><el-button size="small" type="success" @click="addOrUpdateHandle()">新建账号</el-button></p>
        <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
            <el-table-column type="index" header-align="center" align="center" width="50" label="序号"> </el-table-column>
            <el-table-column prop="phone" header-align="center" align="center" label="账号"> </el-table-column>
            <el-table-column prop="name" header-align="center" align="center" label="姓名"> </el-table-column>
            <el-table-column prop="remark" header-align="center" align="center" label="备注"> </el-table-column>
            <el-table-column header-align="center" align="center" min-width="90" label="状态">
                <template slot-scope="scope">
                    <el-switch :width="35" v-model="scope.row.status" @change="switchChange(scope.row)" active-text="启用" :active-value="1" inactive-text="禁用" :inactive-value="2"> </el-switch>
                </template>
            </el-table-column>
            <el-table-column header-align="center" align="center" min-width="230" label="操作">
                <template slot-scope="scope">
                    <!-- <el-button type="success" plain size="mini" @click="updatepw(scope.row.userId)">修改密码</el-button> -->
                    <el-button type="success" plain size="mini" @click="addOrUpdateHandle(scope.row.userId)">修改</el-button>
                    <el-button type="success" plain size="mini" @click="reset(scope.row.userId)">重置密码</el-button>
                    <el-button plain type="success" size="mini" @click="addPower(scope.row.userId)">绑定企业</el-button>
                    <el-button type="danger" plain size="mini" @click="isdelete(scope.row.userId)">删除</el-button>
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
        <!-- 弹窗, 新增/修改 -->
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
        <!-- 修改密码 -->
        <updatepw v-if="updatepwVisible" ref="updatepw"></updatepw>
        <!-- 绑定企业 -->
        <el-dialog title="企业信息" :visible.sync="companyDilog">
            <el-form label-width="50px" size="small">
                <el-form-item label="企业" prop="companyId" class="complay">
                    <el-select v-model="companyId"> <el-option v-for="item in roleList" :key="item.companyId" :label="item.companyName" :value="item.companyId"></el-option> </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="companyDilog = false">取消</el-button>
                <el-button size="small" type="primary" @click="bund()">确定</el-button>
            </span>
        </el-dialog>
        <!-- 重置密码 -->
        <el-dialog title="重置密码" :visible.sync="resetDilog">
            <el-form :model="resetForm" label-width="100px" size="small">
                <el-form-item label="重置后密码" prop="password"> <el-input v-model="resetForm.password" placeholder="重置后密码"></el-input> </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="resetDilog = false">取消</el-button>
                <el-button size="small" type="primary" @click="resetPwd()">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
let sha256 = require('js-sha256').sha256; //这里用的是require方法，所以没用import
import AddOrUpdate from './account-add';
import updatepw from './account-pwd';
export default {
    data() {
        return {
            resetForm: {
                password: '',
            },
            dataList: [],
            pageIndex: 1,
            pageSize: 10,
            totalPage: 0,
            userId: '', //访客机账号id
            roleList: [], //企业列表
            companyId: '', //企业id
            dataListLoading: false,
            addOrUpdateVisible: false,
            updatepwVisible: false,
            companyDilog: false,
            resetDilog: false,
            statusList: [{value: null, label: '全部'}, {value: 1, label: '启用'}, {value: 2, label: '禁用'}],
        };
    },
    components: {
        AddOrUpdate,
        updatepw,
    },
    activated() {
        this.getDataList();
    },
    methods: {
        // 获取数据列表
        getDataList() {
            this.dataListLoading = true;
            this.$http({
                url: this.$http.adornUrl('/v1/visitor/users'),
                method: 'get',
                params: this.$http.adornParams({
                    pageNum: this.pageIndex,
                    pageSize: this.pageSize,
                }),
            }).then(({data}) => {
                if (data.code == 200) {
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
        isdelete(id) {
            this.$confirm(`确定进行删除操作?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    this.$http({
                        url: this.$http.adornUrl('/v1/visitor/users/' + id),
                        method: 'delete',
                    })
                        .then(({data}) => {
                            this.getDataList();
                        })
                        .catch(error => {
                            this.$message.error(error);
                        });
                })
                .catch(() => {});
        },
        // 新增访客机账号
        addOrUpdateHandle(id) {
            this.addOrUpdateVisible = true;
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init(id);
            });
        },
        // 修改密码
        updatepw(id) {
            this.updatepwVisible = true;
            this.$nextTick(() => {
                this.$refs.updatepw.init(id);
            });
        },
        // 重置密码
        reset(userId) {
            this.userId = userId;
            this.resetDilog = true;
        },
        resetPwd() {
            this.$http({
                url: this.$http.adornUrl(`/v1/visitor/users/resetPassword`),
                method: 'put',
                data: this.$http.adornData({
                    userId: this.userId,
                    password: sha256(this.resetForm.password),
                }),
            }).then(({data}) => {
                if (data && data.code === 201) {
                    this.$message({
                        message: '操作成功',
                        type: 'success',
                        duration: 1500,
                        onClose: () => {
                            this.resetDilog = false;
                            this.$emit('refreshDataList');
                        },
                    });
                }
            });
        },
        // 点击企业列表--绑定
        addPower(userId) {
            this.userId = userId;
            this.getComplanyList();
            this.getUserComList();
            this.companyDilog = true;
        },
        //查询企业列表
        getComplanyList() {
            this.$http({
                url: this.$http.adornUrl('/v1/visitor/companys'),
                method: 'get',
                params: this.$http.adornParams({
                    pageNum: 1,
                    pageSize: 999,
                }),
            }).then(({data}) => {
                if (data.code == 200) {
                    this.roleList = data.data.list;
                } else {
                    this.roleList = [];
                }
            });
        },
        //查询用户下绑定的企业
        getUserComList() {
            this.$http({
                url: this.$http.adornUrl('/v1/visitor/users/' + this.userId + '/companyIds'),
                method: 'get',
            }).then(({data}) => {
                if (data.code == 200) {
                    this.companyId = data.data.companyIds[0]; //目前账号/用户绑定一个企业
                }
            });
        },
        // 账号/用户绑定企业
        bund() {
            // console.log(this.companyId)
            // console.log(this.userId)
            var list = [];
            list.push(this.companyId);
            this.$http({
                url: this.$http.adornUrl(`/v1/visitor/users/bindingCompany`),
                method: 'put',
                data: this.$http.adornData({
                    userId: this.userId,
                    companyIds: list,
                }),
            }).then(({data}) => {
                if (data && data.code === 201) {
                    this.$message({
                        message: '操作成功',
                        type: 'success',
                        duration: 1500,
                        onClose: () => {
                            this.companyDilog = false;
                            this.$emit('refreshDataList');
                        },
                    });
                }
            });
        },
        // 修改账号状态
        switchChange(item) {
            this.$http({
                url: this.$http.adornUrl(`/v1/visitor/users/status`),
                method: 'put',
                data: this.$http.adornData({
                    userId: item.userId,
                    status: item.status,
                }),
            }).then(({data}) => {
                if (data && data.code === 201) {
                    this.$message({
                        message: '操作成功',
                        type: 'success',
                        duration: 1500,
                        onClose: () => {
                            this.visible = false;
                            this.getDataList();
                        },
                    });
                }
            });
        },
        type(item) {
            switch (item.type) {
                case 1:
                    return '自助访客机';
                    break;
                case 2:
                    return '物业管理人员';
                    break;
                case 3:
                    return '企业管理人员';
                    break;
            }
        },
    },
};
</script>
<style lang="scss" scoped>
.complay .el-select {
    width: 100%;
}
</style>
