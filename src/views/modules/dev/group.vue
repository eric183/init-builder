<template>
    <div class="mod-user">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataListFun()" size="small">
            <el-form-item>
                <el-select v-model="dataForm.buildingId" placeholder="楼栋" @change="buildChange(dataForm.buildingId)">
                    <el-option v-for="item in buildinglist" :key="item.buildingId" :label="item.name" :value="item.buildingId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item> <el-input v-model="dataForm.name" placeholder="设备分组名称" clearable></el-input> </el-form-item>
            <el-form-item>
                <el-button size="small" v-if="isAuth('access:groups:page')" type="primary" @click="getDataListFun()">查询</el-button>
                <el-button size="small" v-if="isAuth('access:groups:save')" type="success" @click="addOrUpdateHandle()">新增</el-button>
                <!-- <el-button v-if="isAuth('sys:user:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button> -->
            </el-form-item>
        </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
            <el-table-column type="index" header-align="center" align="center" width="50" label="序号"> </el-table-column>
            <el-table-column prop="name" header-align="center" align="center" :show-overflow-tooltip="true" label="设备分组名称"> </el-table-column>
            <el-table-column prop="type" :formatter="type" header-align="center" align="center" label="设备分组类型"> </el-table-column>
            <el-table-column header-align="center" align="center" label="组内设备">
                <template slot-scope="scope">
                    <el-button v-if="isAuth('access:groups:devices')" type="primary" plain size="mini" @click="grouplook(scope.row.groupId)">查看</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="createdAt" :formatter="createdAt" header-align="center" align="center" :show-overflow-tooltip="true" label="创建时间"> </el-table-column>
            <el-table-column header-align="center" align="center" width="250" label="操作">
                <template slot-scope="scope">
                    <el-button v-if="isAuth('access:groups:update')" type="success" plain size="mini" @click="addOrUpdateHandle(scope.row.groupId)">修改</el-button>
                    <el-button v-if="isAuth('access:groups:noDevices')" type="success" plain size="mini" @click="adddevice(scope.row.groupId)">添加设备</el-button>
                    <el-button v-if="isAuth('access:groups:delete')" type="danger" plain size="small" @click="deleteHandle(scope.row.groupId)">删除</el-button>
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
        <!---添加设备/点击查看的弹出框 -->
        <el-dialog :visible.sync="dialogaddEquipment">
            <el-form ref="formgroupdevice" :inline="true" :model="formgroupdevice" label-width="100px" size="small">
                <!-- <el-form-item label="设备类型">
                              <el-select  placeholder="请选择" v-model="formgroupdevice.deviceType">
                                  <el-option
                                  v-for="item in deviceTypelist"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                                  </el-option>
                              </el-select>
                          </el-form-item>  -->
                <!-- <el-form-item>
                              <el-input v-model="formgroupdevice.deviceSn" placeholder="设备序列号" clearable></el-input>
                          </el-form-item> 
                          <el-form-item>
                            <el-input v-model="formgroupdevice.name" placeholder="设备名称" clearable></el-input>
                          </el-form-item> 
                          <el-form-item>
                            <el-button class="searchbtn" type="primary" size="small" @click="getGroupDevice()">搜索</el-button>
                          </el-form-item>  -->
                <el-table :data="grouptableData" style="width: 100%">
                    <el-table-column type="index" label="序号" width="50"> </el-table-column>
                    <el-table-column prop="name" label="设备名称"> </el-table-column>
                    <el-table-column prop="deviceSn" label="设备序列号"> </el-table-column>
                    <el-table-column prop="type" :formatter="formatType" label="设备类型"> </el-table-column>
                    <el-table-column prop="netStatus" :formatter="formatStatu" label="联网状态"> </el-table-column>
                    <el-table-column prop="address" label="设备放置地址"> </el-table-column>
                    <el-table-column prop="version" label="版本号"> </el-table-column>
                    <el-table-column fixed="right" label="操作" width="100">
                        <template slot-scope="scope">
                            <el-button type="text" size="size" @click="addorgroupdevice(scope.row.deviceId)">{{ addorremovetitle }}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    @size-change="sizeChangeHandle1"
                    @current-change="currentChangeHandle1"
                    :current-page="pageIndex1"
                    :page-sizes="[5, 10, 20, 30]"
                    :page-size="pageSize1"
                    :total="totalPage1"
                    layout="total, sizes, prev, pager, next, jumper"
                >
                </el-pagination>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import commonFunc from '@/assets/common.js';
import AddOrUpdate from './group-add-or-update';
export default {
    data() {
        return {
            dataForm: {
                name: '',
                buildingId: '',
            },
            buildinglist: [], //楼栋列表
            dataList: [],
            pageIndex: 1, //页面进来列表数据展示分页
            pageSize: 10,
            totalPage: 0,
            pageIndex1: 1, //点击查看弹框战士的数据列表分页
            pageSize1: 5,
            totalPage1: 0,
            dataListLoading: false,
            dataListSelections: [],
            addOrUpdateVisible: false,
            dialogaddEquipment: false, //设备组绑定解绑设备弹框
            formgroupdevice: {
                id: 0,
                deviceName: '',
                deviceType: '',
                deviceSn: '',
            },
            grouptableData: [], //跟设备组关联的设备数据
            devicegroupId: 1, //设备分组id（存起来后面用）
            // 设备类型
            // deviceTypelist:[
            //   {value:1,label:"砸到二维码设备"},
            //   {value:2,label:"普通电梯二维码控制设备"},
            //   {value:3,label:"VIP二维码控制设备"},
            //   {value:4,label:"摄像头"}
            // ],
        };
    },
    components: {
        AddOrUpdate,
    },
    activated() {
        this._searchbuild();
    },
    methods: {
        // 查询楼栋列表 （默认项目第一个id作为楼栋列表）
        _searchbuild() {
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
        // 楼栋下拉将楼栋id存起来
        buildChange(value) {
            this.dataForm.buildingId = value;
            this.pageIndex = 1;
            this.getDataList();
        },
        getDataListFun() {
            this.pageIndex = 1;
            this.getDataList();
        },
        // 获取数据列表
        getDataList() {
            this.dataListLoading = true;
            this.$http({
                url: this.$http.adornUrl('/v1/access/groups'),
                method: 'get',
                params: this.$http.adornParams({
                    pageNum: this.pageIndex,
                    pageSize: this.pageSize,
                    buildingId: this.dataForm.buildingId,
                    name: this.dataForm.name,
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
        addOrUpdateHandle(groupId) {
            this.addOrUpdateVisible = true;
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init(groupId);
            });
        },
        // 删除
        deleteHandle(id) {
            var groupId = id
                ? [id]
                : this.dataListSelections.map(item => {
                      return item.devicegroupId;
                  });
            this.$confirm(`确定对[id=${groupId.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    this.$http({
                        url: this.$http.adornUrl('/v1/access/groups/' + groupId),
                        method: 'delete',
                    }).then(({data}) => {
                        this.getDataList();
                    });
                })
                .catch(() => {});
        },
        // 点击查看--每页数
        sizeChangeHandle1(val) {
            this.pageSize1 = val;
            this.pageIndex1 = 1;
            this.getGroupDevice();
        },
        // 点击查看--当前页
        currentChangeHandle1(val) {
            this.pageIndex1 = val;
            this.getGroupDevice();
        },
        // 点击查看打开设备与设备组解绑弹框
        grouplook(devicegroupId) {
            this.devicegroupId = devicegroupId;
            this.addorremovetitle = '移除';
            this.formgroupdevice.id = 1; //为1表示点击的是查看设备--要移除；为0表示添加设备，要新增
            this.dialogaddEquipment = true;
            this.getGroupDevice();
        },
        // 查询设备组下已绑定的设备/或者未绑定的设备
        getGroupDevice() {
            this.$http({
                url:
                    this.formgroupdevice.id == 1
                        ? this.$http.adornUrl('/v1/access/groups/' + this.devicegroupId + '/devices')
                        : this.$http.adornUrl('/v1/access/groups/' + this.devicegroupId + '/noDevices'),
                method: 'get',
                params: this.$http.adornParams({
                    pageNum: this.pageIndex1,
                    pageSize: this.pageSize1,
                    buildingId: this.dataForm.buildingId,
                    deviceSn: this.formgroupdevice.deviceSn,
                    name: this.formgroupdevice.name,
                }),
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.grouptableData = data.data.list;
                    this.totalPage1 = data.data.total;
                } else {
                    this.grouptableData = [];
                }
            });
        },
        // 点击添加设备打开设备与设备组绑定弹框
        adddevice(devicegroupId) {
            this.devicegroupId = devicegroupId;
            this.addorremovetitle = '添加';
            this.formgroupdevice.id = 0;
            this.dialogaddEquipment = true;
            this.getGroupDevice();
        },
        // 点击进行设备组解绑/绑定
        addorgroupdevice(deviceId) {
            var list = [];
            list.push(deviceId);
            this.$http({
                url: this.$http.adornUrl(this.addorremovetitle == '移除' ? '/v1/access/groups/unBundlingDevice' : '/v1/access/groups/bundlingDevice'),
                method: this.addorremovetitle == '移除' ? 'delete' : 'post',
                data: this.$http.adornData({
                    groupId: this.devicegroupId,
                    deviceIds: list,
                }),
            }).then(({data}) => {
                this.getGroupDevice();
                this.dialogaddEquipment = false;
            });
        },
        createdAt(item) {
            return commonFunc.commonFunc(item.createdAt);
        },
        // 后端返回的数字，转换成中文
        formatType(row, column) {
            switch (row.type) {
                case 1:
                    return '二维码设备';
                    break;
                case 2:
                    return '人脸识别设备';
                    break;
            }
            switch (row.devicegroupType) {
                case 1:
                    return '普通分组';
                    break;
                case 2:
                    return 'vip分组';
                    break;
                case 3:
                    return 'SVIP分组';
                    break;
            }
        },
        formatStatu(row) {
            switch (row.netStatus) {
                case 1:
                    return '在线';
                    break;
                case 0:
                    return '不在线';
                    break;
            }
        },
        type(row) {
            switch (row.type) {
                case 11:
                    return '普通电梯分组';
                    break;
                case 12:
                    return '高级电梯分组';
                    break;
            }
        },
    },
};
</script>
