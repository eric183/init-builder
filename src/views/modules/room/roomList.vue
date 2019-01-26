<template>
    <!-- 会议室/会议室列表 -->
    <div class="mod-user">
        <div class="topBtn"><el-button size="small" v-if="isAuth('meeting:room:saveRoom')" type="success" @click="addOrUpdateHandle()">新增</el-button></div>
        <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
            <el-table-column type="index" header-align="center" align="center" width="50" label="序号"> </el-table-column>
            <el-table-column prop="roomName" header-align="center" align="center" min-width="100" :show-overflow-tooltip="true" label="会议室名称"> </el-table-column>
            <el-table-column prop="cover" header-align="center" align="center" min-width="150" label="封面">
                <template slot-scope="scope">
                    <span v-for="(item, index) in scope.row.cover" :key="index" class="ml10">
                        <el-popover placement="right" trigger="click">
                            <img :src="item" style="max-width:720px;max-height:600px;" /> <img slot="reference" :src="item" style="width:50px;height:50px;" />
                        </el-popover>
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="size" header-align="center" align="center" label="容纳人数"> </el-table-column>
            <el-table-column prop="price" :formatter="price" header-align="center" align="center" label="收费标准(元/小时)"> </el-table-column>
            <el-table-column header-align="center" align="center" width="250" label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" plain size="mini" @click="detail(scope.row)">详情</el-button>
                    <el-button type="success" plain size="mini" v-if="isAuth('meeting:room:updateRoom')" @click="addOrUpdateHandle(scope.row)">编辑</el-button>
                    <el-button type="danger" plain size="mini" v-if="isAuth('meeting:room:deleteRoom')" @click="deleteBtn(scope.row.roomId)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 弹窗, 查看详情 -->
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
        <detail v-if="roomListDetail" ref="detail" @refreshDataList="getDataList"></detail>
    </div>
</template>

<script>
import AddOrUpdate from './roomList-add-or-update';
import detail from './roomList-detail';
export default {
    data() {
        return {
            // 表格数据展示
            dataList: [],
            dataListLoading: false,
            addOrUpdateVisible: false,
            roomListDetail: false,
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
                url: this.$http.adornUrl('/v1/meet/rooms'),
                method: 'get',
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.dataList = data.data.list;
                    // 后端返回的图片字符串转换成数组
                    this.getArray(this.dataList);
                } else {
                    this.dataList = [];
                }
                this.dataListLoading = false;
            });
        },
        // 新增 / 修改
        addOrUpdateHandle(obj) {
            //console.log(obj)
            this.addOrUpdateVisible = true;
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init(obj);
            });
        },
        // 后端返回的图片字符串转换成数组
        getArray(fun) {
            for (var i in fun) {
                if (fun[i].cover.indexOf(',') != -1) {
                    fun[i].cover = fun[i].cover.split(',');
                } else {
                    var list = [];
                    list.push(fun[i].cover);
                    fun[i].cover = list;
                }
            }
        },
        // 详情
        detail(obj) {
            this.roomListDetail = true;
            this.$nextTick(() => {
                this.$refs.detail.init(obj);
            });
        },
        // 删除
        deleteBtn(roomId) {
            this.$confirm(`确定对[id=${roomId}]进行[${roomId ? '删除' : '批量删除'}]操作?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    this.$http({
                        url: this.$http.adornUrl('/v1/meet/rooms/' + roomId),
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
        price(item) {
            return item.price / 100;
        },
    },
};
</script>
<style lang="scss" scoped>
.topBtn {
    text-align: right;
    margin: 10px 0;
}

</style>
