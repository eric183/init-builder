<template>
    <div class="mod-user">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataListFun()" size="small">
            <el-form-item label="类型">
                <el-select v-model="dataForm.type" placeholder="企业类型">
                    <el-option v-for="item in companyTypelist" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item> <el-input v-model="dataForm.name" placeholder="企业名称" clearable></el-input> </el-form-item>
            <el-form-item> <el-input v-model="dataForm.departmentName" placeholder="部门名称" clearable></el-input> </el-form-item>
            <el-form-item> <el-input v-model="dataForm.doorplateName" placeholder="门牌" clearable></el-input> </el-form-item>
            <el-form-item>
                <el-button size="small" v-if="isAuth('user:companys:page')" type="primary" @click="getDataListFun()">查询</el-button>
                <el-button size="small" v-if="isAuth('user:companys:save')" type="success" @click="addOrUpdateHandle()">新增</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
            <el-table-column type="index" header-align="center" align="center" width="50" label="序号"> </el-table-column>
            <el-table-column prop="name" header-align="center" align="center" :show-overflow-tooltip="true" min-width="180" label="企业名称"> </el-table-column>
            <!-- <el-table-column
        prop="type"
        :formatter="formatType"
        header-align="center"
        align="center"
        label="企业类型">
      </el-table-column> -->
            <el-table-column header-align="center" align="center" label="所在楼栋">
                <template slot-scope="scope">
                    <span class="mr10" v-for="item in scope.row.buildings" :key="item.buildingId">{{ item.name }}</span>
                </template>
            </el-table-column>
            <el-table-column header-align="center" align="center" width="180" label="楼栋门牌">
                <template slot-scope="scope">
                    <span class="mr10" v-for="(item, index) in scope.row.doorplates" :key="item.doorplateId"
                        ><em>{{ item.floorName + item.name }}</em
                        ><br v-show="(index + 1) % 4 == 0 && index + 1 >= 4"
                    /></span>
                </template>
            </el-table-column>
            <el-table-column prop="userCount" header-align="center" align="center" label="员工人数"> </el-table-column>
            <el-table-column header-align="center" align="center" width="150" label="企业管理员">
                <template slot-scope="scope">
                    <el-button type="primary" v-if="isAuth('user:companys:companyAdmin')" size="mini" plain @click="openAdmin(scope.row.companyId)">查看</el-button>
                    <el-button type="success" v-if="isAuth('user:companys:bundlingAdmin')" size="mini" plain @click="openAddAdmin(scope.row.companyId)">新增</el-button>
                </template>
            </el-table-column>
            <el-table-column header-align="center" align="center" width="110" label="企业关联设备组">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" v-if="isAuth('user:companys:companyGroup')" plain @click="lookgroup(scope.row.companyId)">查看</el-button>
                </template>
            </el-table-column>
            <el-table-column header-align="center" align="center" width="260" label="操作">
                <template slot-scope="scope">
                    <el-button type="success" size="mini" v-if="isAuth('user:companys:update')" plain @click="addOrUpdateHandle(scope.row.companyId)">修改</el-button>
                    <el-button type="success" size="mini" v-if="isAuth('user:companys:noCompanyGroup')" plain @click="openAddGroup(scope.row.companyId)">添加设备组</el-button>
                    <el-button type="danger" size="mini" v-if="isAuth('user:companys:delete')" plain @click="deleteHandle(scope.row.companyId)">删除</el-button>
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
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
        <!---企业关联设备分组点击查看的弹出框 -->
        <el-dialog :visible.sync="dialogaddEquipment" title="设备分组列表">
            <el-table :data="grouptableData" style="width: 100%">
                <el-table-column type="index" label="序号"> </el-table-column>
                <el-table-column prop="name" header-align="center" align="center" label="设备组名称"> </el-table-column>
                <el-table-column prop="type" :formatter="type" header-align="center" align="center" label="设备组类型"> </el-table-column>
                <el-table-column prop="status" :formatter="status" header-align="center" align="center" label="设备组状态"> </el-table-column>
                <el-table-column fixed="right" label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="removegroup(scope.row.groupId)">移除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
        <!---企业关联设备分组添加设备组的弹出框 -->
        <el-dialog :visible.sync="addgroupDialog" title="设备分组列表">
            <!-- <el-form :inline="true" :model="addGroupForm" size="small">
            <el-form-item>
              <el-select v-model="addGroupForm.buildingId" placeholder="楼栋">
                <el-option v-for="item in buildinglist" :key="item.buildingId" :label="item.buildingName" :value="item.buildingId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input v-model="addGroupForm.doorplateName" placeholder="设备组编号" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="addGroupForm.name" placeholder="设备组名称" clearable></el-input>
            </el-form-item>          
            <el-form-item>
              <el-button size="small" @click="getAddGroupDataList()">查询</el-button>
            </el-form-item>
        </el-form> -->
            <el-table :data="addgroupData" style="width: 100%">
                <el-table-column type="index" label="序号"> </el-table-column>
                <el-table-column prop="name" header-align="center" align="center" label="设备组名称"> </el-table-column>
                <el-table-column prop="type" :formatter="type" header-align="center" align="center" label="设备组类型"> </el-table-column>
                <el-table-column prop="status" :formatter="status" header-align="center" align="center" label="设备组状态"> </el-table-column>
                <el-table-column fixed="right" label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="addgroup(scope.row.groupId)">添加</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
        <!---管理员设置、管理员列表 -->
        <el-dialog :visible.sync="adminDialog" title="管理员列表">
            <el-table :data="adminData" style="width: 100%">
                <el-table-column type="index" label="序号"> </el-table-column>
                <el-table-column prop="realname" label="姓名"> </el-table-column>
                <el-table-column prop="nickname" label="昵称"> </el-table-column>
                <el-table-column prop="phone" label="手机号"> </el-table-column>
                <el-table-column fixed="right" label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="removeAdmin(scope.row.userId)">移除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
        <!---管理员设置、企业下非管理员列表 -->
        <el-dialog :visible.sync="adminAddDialog" title="新增管理员">
            <el-form :inline="true" :model="noAdminForm" size="small">
                <el-form-item> <el-input v-model="noAdminForm.realname" placeholder="姓名" clearable></el-input> </el-form-item>
                <el-form-item> <el-input v-model="noAdminForm.phone" placeholder="手机号" clearable></el-input> </el-form-item>
                <el-form-item> <el-button size="small" type="" @click="getUserDataListFun()">查询</el-button> </el-form-item>
            </el-form>
            <el-table :data="userData" style="width: 100%">
                <el-table-column type="index" label="序号"> </el-table-column>
                <el-table-column prop="realname" label="姓名"> </el-table-column>
                <el-table-column prop="nickname" label="昵称"> </el-table-column>
                <el-table-column prop="phone" label="手机号"> </el-table-column>
                <el-table-column fixed="right" label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="addAdmin(scope.row.userId)">添加</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageIndexAdmin"
                :page-size="pageSizeAdmin"
                :total="totalAdmin"
                layout="total, prev, pager, next"
            >
            </el-pagination>
        </el-dialog>
    </div>
</template>

<script>
import AddOrUpdate from './company-add-or-update';
export default {
    data() {
        return {
            dataForm: {
                doorplateName: '',
                name: '',
                type: null,
                departmentName: '',
            },
            // 非管理员
            noAdminForm: {
                realname: '',
                phone: '',
            },
            // 添加设备组的搜索表单数据
            // addGroupForm:{
            //   buildingId:'',
            //   devicegroupName:'',
            // },
            // 公司下的用户的搜索表单数据
            // userDataForm:{
            //   realName:'',
            //   account:''
            // },
            buildinglist: [], //楼栋列表
            dataList: [],
            pageIndex: 1,
            pageSize: 10,
            totalPage: 0,
            pageIndexAdmin: 1,
            pageSizeAdmin: 10,
            totalAdmin: 0,
            dataListLoading: false,
            dataListSelections: [],
            addOrUpdateVisible: false,
            dialogaddEquipment: false, //点击查看 企业关联设备分组（移除）
            addgroupDialog: false, //企业添加设备组弹框（添加）
            adminDialog: false, //管理员列表弹框
            adminDialog: false, //查看并删除管理员弹框
            adminAddDialog: false, //新增管理员弹框
            grouptableData: [], //企业关联设备分组数据
            addgroupData: [], //企业添加设备组数据
            adminData: [], //管理员列表弹框数据
            userData: [], //企业下的非管理员用户列表
            companyId: 1, //公司id
            companyTypelist: [{value: null, label: '全部'}, {value: 1, label: '普通企业'}, {value: 2, label: '运营管理企业'}, {value: 3, label: '物业管理企业'}],
        };
    },
    components: {
        AddOrUpdate,
    },
    activated() {
        this._searchbuild();
    },
    methods: {
        // 查询楼栋列表
        _searchbuild(param) {
            this.$http({
                url: this.$http.adornUrl('/v1/building/buildings'),
                method: 'get',
                params: this.$http.adornParams({
                    pageNum: 1,
                    pageSize: 9999,
                }),
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.buildinglist = data.data.list;
                    if (this.buildinglist.length > 0) {
                        this.dataForm.buildingId = data.data.list[0].buildingId;
                        this.getDataList();
                    }
                } else {
                    this.buildinglist = [];
                }
            });
        },
        // 查询按钮
        getDataListFun() {
            this.pageIndex = 1;
            this.getDataList();
        },
        // 获取数据列表
        getDataList() {
            this.dataListLoading = true;
            this.$http({
                url: this.$http.adornUrl('/v1/user/companys'),
                method: 'get',
                params: this.$http.adornParams({
                    pageNum: this.pageIndex,
                    pageSize: this.pageSize,
                    doorplateName: this.dataForm.doorplateName,
                    departmentName: this.dataForm.departmentName,
                    name: this.dataForm.name,
                    type: this.dataForm.type,
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
        // 多选
        selectionChangeHandle(val) {
            this.dataListSelections = val;
        },
        // 新增 / 修改
        addOrUpdateHandle(companyId) {
            this.addOrUpdateVisible = true;
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init(companyId);
            });
        },
        // 删除
        deleteHandle(id) {
            var companyId = id
                ? [id]
                : this.dataListSelections.map(item => {
                      return item.companyId;
                  });
            this.$confirm(`确定对[id=${companyId.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    this.$http({
                        url: this.$http.adornUrl('/v1/user/companys/' + companyId),
                        method: 'delete',
                    }).then(({data}) => {
                        this.getDataList();
                    });
                })
                .catch(() => {});
        },
        // 查看企业关联设备分组
        lookgroup(companyId) {
            this.companyId = companyId;
            this.$http({
                url: this.$http.adornUrl('/v1/user/companys/' + companyId + '/companyGroup'),
                method: 'get',
                params: this.$http.adornParams({
                    pageNum: 1,
                    pageSize: 9999,
                }),
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.grouptableData = data.data.list;
                } else {
                    this.grouptableData = [];
                }
            });
            this.dialogaddEquipment = true;
        },
        // 移除企业关联的设备分组
        removegroup(groupId) {
            var list = [];
            list.push(groupId);
            this.$http({
                url: this.$http.adornUrl('/v1/user/companys/unBundlingDeviceGroup'),
                method: 'put',
                data: this.$http.adornData({
                    companyId: this.companyId,
                    groupIds: list,
                }),
            }).then(({data}) => {
                if (data && data.code === 201) {
                    this.dialogaddEquipment = false;
                }
            });
            this.dialogaddEquipment = true;
        },
        openAddGroup(companyId) {
            this.companyId = companyId;
            this.addgroupDialog = true;
            this.getAddGroupDataList();
        },
        // 查询设备分组
        getAddGroupDataList() {
            this.$http({
                url: this.$http.adornUrl('/v1/user/companys/' + this.companyId + '/noCompanyGroup'),
                method: 'get',
                params: this.$http.adornParams({
                    pageNum: 1,
                    pageSize: 9999,
                }),
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.addgroupData = data.data.list;
                } else {
                    this.addgroupData = [];
                }
            });
        },
        // 添加设备分组
        addgroup(devicegroupId) {
            var list = [];
            list.push(devicegroupId);
            this.$http({
                url: this.$http.adornUrl('/v1/user/companys/bundlingDeviceGroup'),
                method: 'post',
                data: this.$http.adornData({
                    companyId: this.companyId,
                    groupIds: list,
                }),
            }).then(({data}) => {
                if (data && data.code === 201) {
                    this.$message({
                        message: '添加成功',
                        type: 'success',
                    });
                    this.getAddGroupDataList();
                    this.addgroupDialog = false;
                }
            });
        },
        openAdmin(companyId) {
            this.companyId = companyId;
            this.getAdminList();
            this.adminDialog = true;
        },
        //查看企业下的管理员
        getAdminList() {
            this.$http({
                url: this.$http.adornUrl('/v1/user/companys/' + this.companyId + '/companyAdmin'),
                method: 'get',
                params: this.$http.adornParams({
                    pageNum: this.pageIndexAdmin,
                    pageSize: this.pageSizeAdmin,
                }),
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.adminData = data.data.list;
                } else {
                    this.adminData = [];
                }
            });
        },
        // 移除管理员
        removeAdmin(userId) {
            var list = [];
            list.push(userId);
            this.$http({
                url: this.$http.adornUrl('/v1/user/companys/unBundlingAdmin'),
                method: 'put',
                data: this.$http.adornData({
                    userIds: list,
                    companyId: this.companyId,
                }),
            }).then(({data}) => {
                if (data && data.code === 201) {
                    this.$message({
                        message: '移除成功',
                        type: 'success',
                    });
                    this.getAdminList();
                    this.adminDialog = false;
                }
            });
        },
        openAddAdmin(companyId) {
            this.companyId = companyId;
            this.getUserDataList();
            this.adminAddDialog = true;
        },
        // 查询企业下非管理员的用户--查询按钮
        getUserDataListFun() {
            this.pageIndexAdmin = 1;
            this.getUserDataList();
        },
        // 查询企业下非管理员的用户
        getUserDataList() {
            this.$http({
                url: this.$http.adornUrl('/v1/user/companys/' + this.companyId + '/noCompanyAdmin'),
                method: 'get',
                params: this.$http.adornParams({
                    pageNum: this.pageIndexAdmin,
                    pageSize: this.pageSizeAdmin,
                    realname: this.noAdminForm.realname,
                    phone: this.noAdminForm.phone,
                }),
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.userData = data.data.list;
                    this.totalAdmin = data.data.total;
                } else {
                    this.userData = [];
                }
            });
        },
        // 非企业管理员表格分页
        // 每页数
        handleSizeChange(val) {
            this.pageSizeAdmin = val;
            this.pageIndexAdmin = 1;
            this.getUserDataList();
        },
        // 当前页
        handleCurrentChange(val) {
            this.pageIndexAdmin = val;
            this.getUserDataList();
        },
        // 添加管理员
        addAdmin(userId) {
            var list = [];
            list.push(userId);
            this.$http({
                url: this.$http.adornUrl('/v1/user/companys/bundlingAdmin'),
                method: 'post',
                data: this.$http.adornData({
                    companyId: this.companyId,
                    userIds: list,
                }),
            }).then(({data}) => {
                if (data && data.code === 201) {
                    this.$message({
                        message: '添加成功',
                        type: 'success',
                    });
                    this.adminAddDialog = false;
                }
            });
        },

        // 后端返回的数字，转换成中文
        formatType(row, column) {
            switch (row.type) {
                case 1:
                    return '普通企业';
                    break;
                case 2:
                    return '运营管理企业';
                    break;
                case 3:
                    return '物业管理企业';
                    break;
            }
        },
        type(row, column) {
            switch (row.type) {
                case 11:
                    return '普通电梯分组';
                    break;
                case 12:
                    return '高级电梯分组';
                    break;
            }
        },
        status(row, column) {
            switch (row.status) {
                case 1:
                    return '启用';
                    break;
                case 2:
                    return '禁用';
                    break;
            }
        },
    },
};
</script>
<style>
em {
    font-style: normal;
}
</style>
