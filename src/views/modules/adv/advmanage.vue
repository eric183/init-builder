<template>
    <div class="mod-user">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" size="small">
            <el-form-item> <el-input v-model="dataForm.title" placeholder="广告名称" clearable></el-input> </el-form-item>
            <el-form-item label="状态:" class="ml10">
                <el-select v-model="dataForm.status"> <el-option v-for="item in advStatuList" :key="item.value" :label="item.label" :value="item.value"></el-option> </el-select>
            </el-form-item>
            <el-form-item label="广告位置:" class="ml10">
                <el-select v-model="dataForm.type"> <el-option v-for="item in advTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option> </el-select>
            </el-form-item>
            <el-form-item>
                <el-button v-if="isAuth('mkt:advertisements:page')" type="primary" @click="getDataListFun()">查询</el-button>
                <el-button v-if="isAuth('mkt:advertisements:save')" type="success" @click="addOrUpdateHandle()">新增</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
            <el-table-column type="index" header-align="center" align="center" width="50" label="序号"> </el-table-column>
            <el-table-column prop="title" header-align="center" :show-overflow-tooltip="true" align="center" label="广告名称"> </el-table-column>
            <el-table-column prop="imageUrl" header-align="center" align="center" width="100" label="广告图片">
                <template slot-scope="scope">
                    <el-popover v-if="scope.row.imageUrl != ''" placement="right" trigger="click">
                        <img :src="scope.row.imageUrl" style="max-width:720px;max-height:600px;" /> <img slot="reference" :src="scope.row.imageUrl" style="max-height: 50px;max-width: 130px" />
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column prop="jumpType" header-align="center" align="center" :formatter="formatType" label="跳转类型"> </el-table-column>
            <el-table-column prop="infoUrl" header-align="center" :formatter="inforUrlShow" align="center" label="跳转去向"> </el-table-column>
            <el-table-column prop="comment" header-align="center" align="center" label="描述"> </el-table-column>
            <el-table-column header-align="center" :formatter="startAt" align="center" :show-overflow-tooltip="true" label="上线时间"> </el-table-column>
            <el-table-column :formatter="endAt" header-align="center" align="center" :show-overflow-tooltip="true" label="下线时间"> </el-table-column>
            <el-table-column prop="status" header-align="center" width="50" :formatter="formatStatus" align="center" label="状态"> </el-table-column>
            <el-table-column
                header-align="center"
                v-if="isAuth('mkt:advertisements:update') || isAuth('mkt:advertisements:settop') || isAuth('mkt:advertisements:delete')"
                align="center"
                width="220"
                label="操作"
            >
                <template slot-scope="scope">
                    <el-button type="success" v-if="isAuth('mkt:advertisements:update')" plain size="mini" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
                    <el-button type="success" v-if="isAuth('mkt:advertisements:settop')" plain size="mini" @click="setTop(scope.row.id)">置顶</el-button>
                    <el-button type="danger" v-if="isAuth('mkt:advertisements:delete')" plain size="mini" @click="deleteHandle(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="pageNum"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            :total="totalPage"
            layout="total, sizes, prev, pager, next, jumper"
        >
        </el-pagination>
        <!-- 弹窗, 新增 / 修改 -->
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataListFun"></add-or-update>
    </div>
</template>

<script>
import commonFunc from '@/assets/common.js';
import AddOrUpdate from './advmanage-add-or-update';
export default {
    data() {
        return {
            dataForm: {
                title: '',
                type: 1,
                status: 2,
            },
            pageNum: 1,
            pageSize: 10,
            totalPage: 0,
            // 表格数据展示
            dataList: [],
            advStatuList: [{value: 1, label: '下线'}, {value: 2, label: '上线'}, {value: 3, label: '已过期'}, {value: null, label: '全部'}],
            advTypeList: [{value: 1, label: 'app首页轮播'}, {value: 2, label: '美食主页轮播'}, {value: 3, label: '商城主页轮播'}, {value: 4, label: '门禁广告'}, {value: 5, label: 'APP启动页广告'}],
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
                return data.infoUrl;
            } else {
                return data.jumpId;
            }
        },
        getDataListFun() {
            this.pageNum = 1;
            this.getDataList();
        },
        getDataList() {
            this.dataListLoading = true;
            this.$http({
                url: this.$http.adornUrl('/v1/mkt/advertisements'),
                method: 'get',
                params: this.$http.adornParams({
                    title: this.dataForm.title,
                    type: this.dataForm.type,
                    status: this.dataForm.status,
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                }),
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.dataList = data.data.list;
                    this.totalPage = data.data.total;
                } else {
                    this.dataList = [];
                }
                this.dataListLoading = false;
            });
        },
        // 每页数
        sizeChangeHandle(val) {
            this.pageSize = val;
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
                url: this.$http.adornUrl('/v1/mkt/advertisements/' + id + '/settop'),
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
            this.$confirm(`确定对[id=${id.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    this.$http({
                        url: this.$http.adornUrl('/v1/mkt/advertisements/' + id),
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
                case 7:
                    return '互动型活动详情';
                    break;
                case 8:
                    return '报名签到型活动详情';
                    break;
            }
        },
    },
};
</script>
