<template>
    <div>
        <div class="textright mb10"><el-button type="primary" size="small" @click="addOrUpdateHandle()">新增</el-button></div>
        <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
            <el-table-column type="index" header-align="center" align="center" width="50" label="序号"> </el-table-column>
            <el-table-column prop="name" header-align="center" align="center" label="项目名称">
                <template slot-scope="scope">
                    <span class="color_name" @click="detail(scope.row.ruleId)">{{ scope.row.name }}</span>
                </template>
            </el-table-column>
            <el-table-column :formatter="chargeType" header-align="center" align="center" label="收费类型"> </el-table-column>
            <el-table-column :formatter="price" header-align="center" align="center" label="单价(元)"> </el-table-column>
            <el-table-column :formatter="chargeMode" header-align="center" align="center" label="计量方式"> </el-table-column>
            <el-table-column header-align="center" align="center" width="150" label="操作">
                <template slot-scope="scope">
                    <el-button type="success" plain size="mini" @click="addOrUpdateHandle(scope.row.ruleId)">编辑</el-button>
                    <el-button type="danger" plain size="mini" @click="deleteBtn(scope.row.ruleId)">删除</el-button>
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
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
        <!-- 详情 -->
        <detail v-if="ruleVisible" ref="detail"></detail>
    </div>
</template>

<script>
import AddOrUpdate from './stand-add-or-update';
import detail from './stand-detail';
export default {
    data() {
        return {
            // 表格数据展示
            dataList: [],
            pageNum: 1,
            pageSize: 10,
            totalPage: 0,
            dataListLoading: false,
            addOrUpdateVisible: false,
            ruleVisible: false,
        };
    },
    components: {
        AddOrUpdate,
        detail,
    },
    activated() {
        this.getDataList();
    },
    methods: {
        // 获取数据列表
        getDataList() {
            this.dataListLoading = true;
            this.$http({
                url: this.$http.adornUrl('/v1/pm/charge/rules'),
                method: 'get',
                params: this.$http.adornParams({
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
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
            this.getDataList();
        },
        // 当前页
        currentChangeHandle(val) {
            this.pageNum = val;
            this.getDataList();
        },
        // 新增 / 修改
        addOrUpdateHandle(ruleId) {
            this.addOrUpdateVisible = true;
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init(ruleId);
            });
        },
        // 详情
        detail(id) {
            this.ruleVisible = true;
            this.$nextTick(() => {
                this.$refs.detail.init(id);
            });
        },
        //   删除
        deleteBtn(ruleId) {
            this.$confirm(`确定进行删除操作?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    this.$http({
                        url: this.$http.adornUrl('/v1/pm/charge/rules/' + ruleId),
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
        // 单价-转换成元
        price(item) {
            return item.price / 100;
        },
        chargeMode(item) {
            switch (item.chargeMode) {
                case 1:
                    return '出租面积';
                    break;
                case 2:
                    return '使用量';
                    break;
            }
        },
        chargeType(item) {
            switch (item.chargeType) {
                case 1:
                    return '周期性固定收费';
                    break;
                case 2:
                    return '抄表类型标准收费';
                    break;
                case 3:
                    return '抄表类分时段收费';
                    break;
            }
        },
    },
};
</script>
