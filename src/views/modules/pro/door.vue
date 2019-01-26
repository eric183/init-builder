<template>
    <div class="mod-user">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" size="small">
            <el-form-item>
                <el-select v-model="dataForm.buildingId" placeholder="楼栋" @change="buildChange(dataForm.buildingId)">
                    <el-option v-for="item in buildinglist" :key="item.buildingId" :label="item.name" :value="item.buildingId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" v-if="isAuth('building:doorplates:page')" @click="getDataList()">查询</el-button>
                <el-button size="small" v-if="isAuth('building:doorplates:save')" type="success" @click="addOrUpdateHandle()">新增</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
            <el-table-column type="index" header-align="center" align="center" width="50" label="序号"> </el-table-column>
            <el-table-column prop="name" header-align="center" align="center" label="门牌号"> </el-table-column>
            <el-table-column prop="totalArea" header-align="center" align="center" label="门牌面积(m2)"> </el-table-column>
            <el-table-column prop="orient" header-align="center" align="center" label="朝向"> </el-table-column>
            <el-table-column prop="floorName" header-align="center" align="center" label="所在楼层"> </el-table-column>
            <el-table-column prop="status" :formatter="formatStatu" header-align="center" align="center" width="180" label="门牌状态"> </el-table-column>
            <el-table-column header-align="center" align="center" width="150" label="操作">
                <template slot-scope="scope">
                    <el-button type="success" v-if="isAuth('building:doorplates:getById')" plain size="mini" @click="addOrUpdateHandle(scope.row.doorplateId)">修改</el-button>
                    <el-button type="danger" v-if="isAuth('building:doorplates:delete')" plain size="mini" @click="deleteHandle(scope.row.doorplateId)">删除</el-button>
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
import AddOrUpdate from './door-add-or-update';
export default {
    data() {
        return {
            buildinglist: [], //楼栋列表
            buildingId: 0,
            dataForm: {
                buildingId: null,
            },
            dataList: [],
            pageIndex: 1,
            pageSize: 10,
            totalPage: 0,
            dataListLoading: false,
            dataListSelections: [],
            addOrUpdateVisible: false,
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
                    //console.log(this.buildinglist)
                    if (this.buildinglist.length > 0) {
                        this.buildingId = data.data.list[0].buildingId;
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
                url: this.$http.adornUrl('/v1/building/doorplates'),
                method: 'get',
                params: this.$http.adornParams({
                    pageNum: this.pageIndex,
                    pageSize: this.pageSize,
                    buildingId: this.buildingId,
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
        // 楼栋下拉将楼栋id存起来
        buildChange(value) {
            this.dataForm.buildingId = value;
            this.buildingId = value;
            this.pageIndex = 1;
            this.getDataList();
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
        addOrUpdateHandle(doorplateId) {
            this.addOrUpdateVisible = true;
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init(doorplateId);
            });
        },
        // 删除
        deleteHandle(id) {
            var floorId = id
                ? [id]
                : this.dataListSelections.map(item => {
                      return item.floorId;
                  });
            this.$confirm(`确定对[id=${floorId.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    this.$http({
                        url: this.$http.adornUrl('/v1/baseDoorplate/' + floorId),
                        method: 'delete',
                        // data: this.$http.adornData(projectId, false)
                    }).then(({data}) => {
                        if (data && data.code === 200) {
                            this.$message({
                                message: '操作成功',
                                type: 'success',
                                duration: 1500,
                                onClose: () => {
                                    this.getDataList();
                                },
                            });
                        }
                    });
                })
                .catch(() => {});
        },
        // 后端返回的数字，转换成中文
        formatStatu(row, column) {
            switch (row.status) {
                case 1:
                    return '出租';
                    break;
                case 2:
                    return '已售';
                    break;
                case 3:
                    return '自用';
                    break;
                case 4:
                    return '待租';
                    break;
                case 5:
                    return '待售';
                    break;
                case 6:
                    return '其他';
                    break;
                case 7:
                    return '停用';
                    break;
            }
        },
    },
};
</script>
