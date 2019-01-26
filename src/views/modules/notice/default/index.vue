<template>
    <div class="mod-user">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" size="small">
            <el-form-item label="状态:" class="ml10">
                <el-select v-model="dataForm.status"> <el-option v-for="item in noticeStatuList" :key="item.value" :label="item.label" :value="item.value"></el-option> </el-select>
            </el-form-item>
            <el-form-item>
                <el-button v-if="isAuth('notice:announcement:getAnnouncements')" type="primary" @click="getDataList()">查询</el-button>
                <el-button v-if="isAuth('notice:announcement:addAnnouncement')" type="success" @click="addOrUpdateHandle()">新增</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
            <el-table-column type="index" header-align="center" align="center" width="50" label="序号"> </el-table-column>
            <el-table-column prop="title" header-align="center" align="center" :show-overflow-tooltip="true" label="公告标题"> </el-table-column>
            <el-table-column prop="status" :formatter="status" header-align="center" align="center" label="状态"> </el-table-column>
            <el-table-column :formatter="createdAt" header-align="center" align="center" :show-overflow-tooltip="true" label="发布时间"> </el-table-column>
            <el-table-column header-align="center" align="center" width="220" label="操作">
                <template slot-scope="scope">
                    <el-button type="success" v-if="isAuth('notice:announcement:updateAnnouncement')" plain size="mini" @click="addOrUpdateHandle(scope.row.announcementId)">编辑</el-button>
                    <el-button type="danger" v-if="isAuth('notice:announcement:deleteAnnouncement')" plain size="mini" @click="deleteHandle(scope.row.announcementId)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 弹窗, 新增 / 修改 -->
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    </div>
</template>

<script>
import {commonFunc} from '@/utils/resources/index.js';
import AddOrUpdate from './notice-add-or-update';
export default {
    data() {
        return {
            dataForm: {
                status: null,
            },
            // 表格数据展示
            dataList: [],
            pageNum: 1,
            pageSize: 10,
            noticeStatuList: [{value: 1, label: '未发布'}, {value: 2, label: '发布中'}, {value: 3, label: '已过期'}, {value: null, label: '全部'}],
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
        getDataList() {
            this.dataListLoading = true;
            this.$http({
                url: this.$http.adornUrl('/v1/notice/announcements'),
                method: 'get',
                params: this.$http.adornParams({
                    status: this.dataForm.status,
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                }),
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.dataList = data.data.list;
                } else {
                    this.dataList = [];
                }
                this.dataListLoading = false;
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
            this.$confirm(`确定对[id=${id.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                this.$http({
                    url: this.$http.adornUrl('/v1/notice/announcements/' + id),
                    method: 'delete',
                })
                    .then(({data}) => {
                        this.getDataList();
                    })
                    .catch(error => {
                        this.$message.error(error);
                    });
            });
        },
        // 后端返回的数字，转换成中文
        status(row, column) {
            switch (row.status) {
                case 1:
                    return '未发布';
                    break;
                case 2:
                    return '发布中';
                    break;
                case 3:
                    return '已过期';
                    break;
            }
        },
        createdAt(item) {
            return commonFunc(item.startPublishTime) + '  至  ' + commonFunc(item.endPublishTime);
        },
    },
};
</script>
