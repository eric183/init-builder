<template>
    <el-row>
        <el-table :data="subjectList" border style="width: 100%;">
            <el-table-column type="index" header-align="center" align="center" label="序号"> </el-table-column>
            <el-table-column prop="subjectId" header-align="center" align="center" label="专题ID"> </el-table-column>
            <el-table-column prop="deviceNo" header-align="center" align="center" label="专题banner"> </el-table-column>
            <el-table-column prop="subjectName" header-align="center" align="center" label="专题名称"> </el-table-column>
            <el-table-column header-align="center" align="center" label="专题位置"> </el-table-column>
            <el-table-column prop="address" header-align="center" align="center" label="启用状态"> </el-table-column>
            <el-table-column prop="remark" header-align="center" align="center" label="创建时间"> </el-table-column>
            <el-table-column header-align="center" align="center" width="100" label="操作">
                <template slot-scope="scope">
                    <el-button type="success" plain size="mini" @click="$router.push({name: 'Special-shopList', query: {id: scope.row.subjectId}})">商品</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-row>
</template>

<script>
export default {
    data() {
        return {
            subjectList: [],
            dataListLoading: false,
            specialShopListAble: false,
            pageIndex: 1,
            pageSize: 10,
            totalPage: 0,
        };
    },
    activated() {
        this.getDataList();
    },
    methods: {
        // 获取数据列表
        getDataList() {
            this.dataListLoading = true;
            this.$http({
                url: this.$http.adornUrl5('/v1/ops/subjects'),
                method: 'get',
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.subjectList = data.data.list;
                }
            });
        },
    },
};
</script>
