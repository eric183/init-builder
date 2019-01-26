<template>
    <div class="mod-user">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" size="small">
            <el-form-item> <el-input v-model="dataForm.title" placeholder="广告标题" clearable></el-input> </el-form-item>
            <el-form-item label="状态:" class="ml10">
                <el-select v-model="dataForm.status"> <el-option v-for="item in advStatuList" :key="item.value" :label="item.label" :value="item.value"></el-option> </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getDataList()">查询</el-button>
                <el-button type="success" @click="addOrUpdateHandle()">新增</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
            <el-table-column type="index" header-align="center" align="center" width="50" label="序号"></el-table-column>
            <el-table-column prop="title" header-align="center" align="center" label="广告标题"> </el-table-column>
            <el-table-column prop="imageUrl" header-align="center" align="center" width="100" label="广告图片">
                <template slot-scope="scope">
                    <el-popover v-if="scope.row.imageUrl != ''" placement="right" trigger="click">
                        <img :src="scope.row.imageUrl" style="max-width:720px;max-height:600px;" /> <img slot="reference" :src="scope.row.imageUrl" style="max-height: 50px;max-width: 130px" />
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column prop="infoUrl" header-align="center" align="center" label="跳转去向"> </el-table-column>
            <el-table-column prop="comment" header-align="center" align="center" label="描述"> </el-table-column>
            <el-table-column header-align="center" :formatter="startAt" align="center" label="上线时间"> </el-table-column>
            <el-table-column :formatter="endAt" header-align="center" align="center" label="下线时间"> </el-table-column>
            <el-table-column prop="status" header-align="center" width="50" :formatter="formatStatus" align="center" label="状态"> </el-table-column>
            <el-table-column header-align="center" align="center" width="220" label="操作">
                <template slot-scope="scope">
                    <el-button type="success" plain size="mini" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
                    <el-button type="success" plain size="mini" @click="setTop(scope.row.id)">置顶</el-button>
                    <el-button type="danger" plain size="mini" @click="deleteHandle(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 弹窗, 新增 / 修改 -->
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    </div>
</template>

<script>
import commonFunc from '@/assets/common.js';
import AddOrUpdate from './AdvList-add-or-update';
export default {
    data() {
        return {
            dataForm: {
                title: '',
                type: 1,
                status: 2,
            },
            // 表格数据展示
            dataList: [],
            advStatuList: [{value: null, label: '全部'}, {value: 1, label: '下线'}, {value: 2, label: '上线'}, {value: 3, label: '已过期'}],
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
        getDataList() {
            this.dataListLoading = true;
            this.$http({
                url: this.$http.adornUrl5('/v1/mkt/advertisements'),
                method: 'get',
                params: this.$http.adornParams({
                    title: this.dataForm.title,
                    status: this.dataForm.status,
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
        // 置顶
        setTop(id) {
            this.$http({
                url: this.$http.adornUrl5('/v1/mkt/advertisements/' + id + '/settop'),
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
            this.$confirm(`确定对进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    this.$http({
                        url: this.$http.adornUrl5('/v1/mkt/advertisements/' + id),
                        method: 'delete',
                    }).then(({data}) => {
                        this.getDataList();
                    });
                })
                .catch(() => {});
        },
        // 后端返回的数字，转换成中文
        startAt(item) {
            return commonFunc.commonFunc(item.startAt);
        },
        endAt(item) {
            return commonFunc.commonFunc(item.endAt);
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
    },
};
</script>
