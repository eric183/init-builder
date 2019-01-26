<template>
    <div class="mod-user">
        <div class="textright mb10">
            <!-- v-if="isAuth('mkt:advertisements:save')" -->
            <el-button size="small" v-if="isAuth('union:services:addService')" type="success" @click="addOrUpdateHandle()">新增</el-button>
        </div>
        <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
            <el-table-column type="index" header-align="center" align="center" width="50" label="序号"> </el-table-column>
            <el-table-column prop="title" header-align="center" align="center" label="名称"> </el-table-column>
            <el-table-column prop="coverImg" header-align="center" align="center" width="80" label="封面图">
                <template slot-scope="scope">
                    <el-popover v-if="scope.row.coverImg != ''" placement="right" trigger="click">
                        <img :src="scope.row.coverImg" style="max-width:720px;max-height:600px;" /> <img slot="reference" :src="scope.row.coverImg" style="width:50px;height:50px;" />
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column prop="jumpType" header-align="center" align="center" width="60" :formatter="formatType" label="类型"> </el-table-column>
            <el-table-column header-align="center" :formatter="inforUrlShow" align="center" label="跳转去向"> </el-table-column>
            <el-table-column prop="description" header-align="center" align="center" label="描述"> </el-table-column>
            <el-table-column header-align="center" :formatter="startAt" align="center" label="上线时间"> </el-table-column>
            <el-table-column :formatter="endAt" header-align="center" align="center" label="下线时间"> </el-table-column>
            <el-table-column prop="status" header-align="center" :formatter="formatStatus" align="center" width="60" label="状态"> </el-table-column>
            <el-table-column header-align="center" align="center" width="220" label="操作">
                <template slot-scope="scope">
                    <el-button type="success" v-if="isAuth('union:services:updateService')" plain size="mini" @click="addOrUpdateHandle(scope.row.serviceId)">修改</el-button>
                    <el-button type="success" v-if="isAuth('union:services:sortService')" plain size="mini" @click="setTop(scope.row.serviceId)">置顶</el-button>
                    <el-button type="danger" v-if="isAuth('union:services:deleteService')" plain size="mini" @click="deleteHandle(scope.row.serviceId)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 弹窗, 新增 / 修改 -->
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    </div>
</template>

<script>
import commonFunc from '@/assets/common.js';
import AddOrUpdate from './service-add-or-update';
export default {
    data() {
        return {
            // 表格数据展示
            dataList: [],
            dataListLoading: false,
            addOrUpdateVisible: false,
        };
    },
    components: {
        AddOrUpdate,
    },
    activated() {
        this.getDataList();
    },
    methods: {
        // 获取数据列表
        inforUrlShow(data) {
            if (data.jumpType == 1) {
                return data.jumpUrl;
            } else {
                return data.jumpId;
            }
        },
        getDataList() {
            this.dataListLoading = true;
            this.$http({
                url: this.$http.adornUrl('/v1/union/services'),
                method: 'get',
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.dataList = data.data.services;
                } else {
                    this.dataList = [];
                }
                this.dataListLoading = false;
            });
        },
        // 置顶
        setTop(id) {
            this.$http({
                url: this.$http.adornUrl('/v1/union/services/' + id + '/sort'),
                method: 'put',
            }).then(({data}) => {
                if (data && data.code === 201) {
                    this.getDataList();
                }
            });
        },
        // 新增 / 修改
        addOrUpdateHandle(id) {
            this.addOrUpdateVisible = true;
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init(id);
            });
        },
        // 删除
        deleteHandle(id) {
            var id = id
                ? [id]
                : this.dataListSelections.map(item => {
                      return item.id;
                  });
            this.$confirm(`确定进行删除操作?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    this.$http({
                        url: this.$http.adornUrl('/v1/union/services/' + id),
                        method: 'delete',
                    }).then(({data}) => {
                        this.getDataList();
                    });
                })
                .catch(() => {});
        },
        // 后端返回的数字，转换成中文
        startAt(item) {
            return commonFunc.commonFunc(item.onlineTime);
        },
        endAt(item) {
            return commonFunc.commonFunc(item.offlineTime);
        },
        formatStatus(row, column) {
            switch (row.status) {
                case 1:
                    return '下线';
                    break;
                case 2:
                    return '上线';
                    break;
                case 3:
                    return '已过期';
                    break;
            }
        },
        formatType(row, column) {
            switch (row.jumpType) {
                case 1:
                    return 'H5';
                    break;
                case 3:
                    return '美食详情页';
                    break;
                case 2:
                    return '美食店铺页';
                    break;
                case 4:
                    return '商城店铺页';
                    break;
                case 5:
                    return '商城详情页';
                    break;
            }
        },
    },
};
</script>
