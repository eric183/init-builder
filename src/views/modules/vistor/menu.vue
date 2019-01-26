<template>
    <div class="mod-menu">
        <el-form :inline="true" :model="dataForm" size="small">
            <div style="text-align:right">
                <el-form-item> <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button> </el-form-item>
            </div>
        </el-form>
        <el-table :data="dataList" border style="width: 100%;">
            <el-table-column prop="menuId" header-align="center" align="center" width="50" label="ID"> </el-table-column>
            <table-tree-column prop="name" header-align="center" treeKey="menuId" width="150" label="名称"> </table-tree-column>
            <el-table-column prop="pname" header-align="center" align="center" width="120" label="上级菜单"> </el-table-column>
            <el-table-column prop="icon" header-align="center" align="center" label="图标">
                <template slot-scope="scope">
                    <icon-svg :name="scope.row.icon || ''"></icon-svg>
                </template>
            </el-table-column>
            <el-table-column prop="type" header-align="center" align="center" label="类型">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.type === 1" size="small">目录</el-tag>
                    <el-tag v-else-if="scope.row.type === 2" size="small" type="success">菜单</el-tag>
                    <el-tag v-else-if="scope.row.type === 3" size="small" type="info">按钮</el-tag>
                </template>
            </el-table-column>
            <el-table-column header-align="center" align="center" :formatter="userType" label="访问类型"> </el-table-column>
            <el-table-column prop="oindex" header-align="center" align="center" label="排序号"> </el-table-column>
            <el-table-column prop="url" header-align="center" align="center" min-width="120" :show-overflow-tooltip="true" label="菜单URL"> </el-table-column>
            <el-table-column prop="permit" header-align="center" align="center" min-width="120" :show-overflow-tooltip="true" label="授权标识"> </el-table-column>
            <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
                <template slot-scope="scope">
                    <el-button plain type="success" size="mini" @click="addOrUpdateHandle(scope.row.menuId)">修改</el-button>
                    <el-button plain type="danger" size="mini" @click="deleteHandle(scope.row.menuId)">删除</el-button>
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
import TableTreeColumn from '@/components/table-tree-column';
import AddOrUpdate from './menu-add-or-update';
import {treeDataTranslate} from '@/utils';
export default {
    data() {
        return {
            dataForm: {},
            dataList: [],
            pageIndex: 1,
            pageSize: 999,
            totalPage: 0,
            dataListLoading: false,
            addOrUpdateVisible: false,
        };
    },
    components: {
        TableTreeColumn,
        AddOrUpdate,
    },
    activated() {
        console.log(123);
        this.getDataList();
    },
    methods: {
        // 获取数据列表
        getDataList() {
            this.dataListLoading = true;
            this.$http({
                url: this.$http.adornUrl('/v1/visitor/menus'),
                method: 'get',
                params: this.$http.adornParams({
                    pageNum: this.pageIndex,
                    pageSize: this.pageSize,
                }),
            }).then(({data}) => {
                data = data.data;
                this.dataList = treeDataTranslate(data.list, 'menuId');
                this.totalPage = data.totalCount;
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
        // 新增 / 修改
        addOrUpdateHandle(id) {
            this.addOrUpdateVisible = true;
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init(id);
            });
        },
        // 删除
        deleteHandle(id) {
            this.$confirm(`确定对[id=${id}]进行[删除]操作?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    this.$http({
                        url: this.$http.adornUrl(`/v1/visitor/menus/` + id),
                        method: 'delete',
                    }).then(({data}) => {
                        this.getDataList();
                    });
                })
                .catch(() => {});
        },
        userType(item) {
            switch (item.userType) {
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
.el-form-item__content {
    text-align: right;
}
</style>
