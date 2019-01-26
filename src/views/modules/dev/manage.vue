<template>
    <div class="mod-user">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataListFun()" size="small">
            <el-form-item>
                <el-select v-model="dataForm.buildingId" placeholder="楼栋" @change="buildChange(dataForm.buildingId)">
                    <el-option v-for="item in buildinglist" :key="item.buildingId" :label="item.name" :value="item.buildingId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item> <el-input v-model="dataForm.name" placeholder="设备名称" clearable></el-input> </el-form-item>
            <el-form-item label="状态:" class="ml10">
                <el-select v-model="dataForm.status" placeholder="状态"> <el-option v-for="item in statusTypelist" :key="item.value" :label="item.label" :value="item.value"></el-option> </el-select>
            </el-form-item>
            <!-- <el-form-item label="类型:" class="ml10">
        <el-select v-model="dataForm.type" placeholder="类型">
          <el-option v-for="item in deviceTypelist" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item> -->
            <el-form-item label="渠道:" class="ml10">
                <el-select v-model="dataForm.channel" placeholder="渠道"> <el-option v-for="item in channellist" :key="item.value" :label="item.label" :value="item.value"></el-option> </el-select>
            </el-form-item>
            <el-form-item>
                <el-button size="small" v-if="isAuth('access:devices:page')" type="primary" @click="getDataListFun()">查询</el-button>
                <el-button size="small" v-if="isAuth('access:devices:save')" type="success" @click="addOrUpdateHandle()">新增</el-button>
                <!-- <el-button v-if="isAuth('sys:user:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button> -->
            </el-form-item>
        </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
            <el-table-column type="index" header-align="center" align="center" width="50" label="序号"> </el-table-column>
            <el-table-column prop="name" header-align="center" align="center" :show-overflow-tooltip="true" label="设备名称"> </el-table-column>
            <el-table-column prop="deviceSn" header-align="center" align="center" :show-overflow-tooltip="true" label="设备序列号"> </el-table-column>
            <el-table-column prop="status" :formatter="status" header-align="center" align="center" label="状态"> </el-table-column>
            <el-table-column prop="netStatus" :formatter="formatStatus" header-align="center" align="center" label="联网状态"> </el-table-column>
            <el-table-column prop="channel" :formatter="channel" header-align="center" align="center" label="应用渠道"> </el-table-column>
            <el-table-column prop="remark" header-align="center" align="center" :show-overflow-tooltip="true" label="说明"> </el-table-column>
            <el-table-column prop="address" header-align="center" align="center" :show-overflow-tooltip="true" label="设备地址"> </el-table-column>
            <el-table-column header-align="center" align="center" width="150" label="操作">
                <template slot-scope="scope">
                    <el-button type="success" v-if="isAuth('access:devices:update')" plain size="mini" @click="addOrUpdateHandle(scope.row.deviceId)">修改</el-button>
                    <el-button type="danger" v-if="isAuth('access:devices:delete')" plain size="mini" @click="deleteHandle(scope.row.deviceId)">删除</el-button>
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
    </div>
</template>

<script>
import AddOrUpdate from './manage-add-or-update';
export default {
    data() {
        return {
            dataForm: {
                buildingId: '',
                name: '',
                status: 2,
                type: null,
                channel: null,
            },
            buildinglist: [], //楼栋列表
            buildingId: null,
            dataList: [],
            pageIndex: 1,
            pageSize: 10,
            totalPage: 0,
            dataListLoading: false,
            dataListSelections: [],
            addOrUpdateVisible: false,
            // 设备类型
            // deviceTypelist:[
            //   {value:null,label:"全部"},
            //   {value:1,label:"二维码设备"},
            //   {value:2,label:"人脸识别设备"}
            // ],
            // 设备状态
            statusTypelist: [{value: 1, label: '停用'}, {value: 2, label: '启用'}, {value: 3, label: '故障'}, {value: null, label: '全部'}],
            channellist: [{value: 1, label: '道闸'}, {value: 2, label: '普通电梯'}, {value: 3, label: 'VIP电梯'}, {value: 4, label: '私有办公室'}, {value: null, label: '全部'}],
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
        // 获取数据列表
        getDataList() {
            this.dataListLoading = true;
            this.$http({
                url: this.$http.adornUrl('/v1/access/devices'),
                method: 'get',
                params: this.$http.adornParams({
                    pageNum: this.pageIndex,
                    pageSize: this.pageSize,
                    buildingId: this.dataForm.buildingId,
                    name: this.dataForm.name,
                    type: this.dataForm.type,
                    channel: this.dataForm.channel,
                    status: this.dataForm.status,
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
        getDataListFun() {
            this.pageIndex = 1;
            this.getDataList();
        },
        // 楼栋下拉
        buildChange(value) {
            this.dataForm.buildingId = value;
            this.pageIndex = 1;
            this.getDataList();
        },
        // 每页数
        sizeChangeHandle(val) {
            this.pageSize = val;
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
        addOrUpdateHandle(deviceId) {
            this.addOrUpdateVisible = true;
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init(deviceId);
            });
        },
        // 删除
        deleteHandle(id) {
            var deviceId = id
                ? [id]
                : this.dataListSelections.map(item => {
                      return item.deviceId;
                  });
            this.$confirm(`确定对[id=${deviceId.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    this.$http({
                        url: this.$http.adornUrl('/v1/access/devices/' + deviceId),
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
        // 后端返回的数字，转换成中文
        formatType(row, column) {
            switch (row.deviceType) {
                case 1:
                    return '闸到二维码设备';
                    break;
                case 2:
                    return '普通电梯二维码控制设备';
                    break;
                case 3:
                    return 'VIP二维码控制设备';
                    break;
                case 4:
                    return '摄像头';
                    break;
            }
        },
        formatStatus(row, column) {
            switch (row.netStatus) {
                case 1:
                    return '未知';
                    break;
                case 2:
                    return '在线';
                    break;
                case 3:
                    return '离线';
                    break;
            }
        },
        status(row) {
            switch (row.status) {
                case 1:
                    return '停用';
                    break;
                case 2:
                    return '启用';
                    break;
                case 3:
                    return '故障';
                    break;
            }
        },
        channel(row) {
            switch (row.channel) {
                case 1:
                    return '道闸';
                    break;
                case 2:
                    return '普通电梯';
                    break;
                case 3:
                    return 'VIP电梯';
                    break;
                case 4:
                    return '私有办公室';
                    break;
            }
        },
    },
};
</script>
