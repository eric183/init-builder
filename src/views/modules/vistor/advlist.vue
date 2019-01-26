<template>
    <div class="mod-user">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataListFun()" size="small">
            <el-form-item> <el-input v-model="dataForm.title" placeholder="标题" clearable></el-input> </el-form-item>
            <el-form-item label="状态:" class="ml10">
                <el-select v-model="dataForm.status"> <el-option v-for="item in advStatuList" :key="item.value" :label="item.label" :value="item.value"></el-option> </el-select>
            </el-form-item>
            <el-form-item label="广告位置:" class="ml10">
                <el-select v-model="dataForm.type"> <el-option v-for="item in advTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option> </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getDataListFun()">查询</el-button>
                <el-button type="success" @click="addOrUpdateHandle()">新增</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
            <el-table-column type="index" header-align="center" align="center" width="50" label="序号"> </el-table-column>
            <el-table-column prop="title" header-align="center" align="center" :show-overflow-tooltip="true" label="广告标题"> </el-table-column>
            <el-table-column prop="imageUrl" header-align="center" align="center" max-height="200" min-width="120" label="广告图片">
                <template slot-scope="scope">
                    <img :src="scope.row.imageUrl" alt="" style="width:100px;height:auto;" />
                </template>
            </el-table-column>
            <el-table-column header-align="center" :formatter="startAt" align="center" :show-overflow-tooltip="true" min-width="100" label="上线时间"> </el-table-column>
            <el-table-column :formatter="endAt" header-align="center" align="center" :show-overflow-tooltip="true" min-width="100" label="下线时间"> </el-table-column>
            <el-table-column prop="status" header-align="center" :formatter="formatStatus" align="center" label="状态"> </el-table-column>
            <el-table-column header-align="center" align="center" width="220" label="操作">
                <template slot-scope="scope">
                    <el-button type="success" plain size="mini" @click="setTop(scope.row.id)">置顶</el-button>
                    <el-button type="danger" plain size="mini" @click="deleteHandle(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="pageNum"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
        >
        </el-pagination>
        <!-- 弹窗, 新增 -->
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    </div>
</template>

<script>
import commonFunc from '@/assets/common.js';
import AddOrUpdate from './advlist-add-or-update';
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
            pageSize: 10,
            pageNum: 1,
            total: 0,
            advStatuList: [{value: null, label: '全部'}, {value: 2, label: '上线'}, {value: 1, label: '下线'}, {value: 3, label: '已过期'}],
            advTypeList: [{value: 1, label: '轮播图'}, {value: 2, label: '全屏广告'}],
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
        getDataListFun() {
            this.pageNum = 1;
            this.getDataList();
        },
        getDataList() {
            this.dataListLoading = true;
            this.$http({
                url: this.$http.adornUrl('/v1/visitor/advertisements'),
                method: 'get',
                params: this.$http.adornParams({
                    pageSize: this.pageSize,
                    pageNum: this.pageNum,
                    title: this.dataForm.title,
                    type: this.dataForm.type,
                    status: this.dataForm.status,
                }),
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.dataList = data.data.list;
                    this.total = data.data.total;
                } else {
                    this.dataList = [];
                }
                this.dataListLoading = false;
            });
        },
        // 每页数
        sizeChangeHandle(val) {
            this.pageSize = val;
            this.pageNum = 1;
            this.getDataList();
        },
        // 当前页
        currentChangeHandle(val) {
            this.pageNum = val;
            this.getDataList();
        },
        // 置顶
        setTop(id) {
            this.$http({
                url: this.$http.adornUrl('/v1/visitor/advertisements/' + id + '/settop'),
                method: 'put',
            }).then(({data}) => {
                if (data && data.code === 201) {
                    this.getDataList();
                }
            });
        },
        // 新增 / 修改
        addOrUpdateHandle() {
            this.addOrUpdateVisible = true;
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init();
            });
        },
        // 删除
        deleteHandle(id) {
            this.$confirm(`确定进行删除操作?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    this.$http({
                        url: this.$http.adornUrl('/v1/visitor/advertisements/' + id),
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
        // formatType(row,column){
        //   switch(row.jumpType){
        //         case 1:
        //           return "H5"
        //         break;
        //         case 2:
        //           return "不跳转"
        //         break;
        //     }
        // }
    },
};
</script>
