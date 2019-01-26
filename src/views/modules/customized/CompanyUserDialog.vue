<template>
    <el-dialog :visible.sync="visable" title="新增人员">
        <!-- 添加人员的弹窗 -->
        <el-form :model="dataForm" :inline="true" size="small">
            <el-form-item prop="phone" label="手机号:"> <el-input v-model="dataForm.phone" placeholder="手机号" clearable></el-input> </el-form-item>
            <el-form-item prop="realName" label="姓名:"> <el-input v-model="dataForm.realName" placeholder="姓名" clearable></el-input> </el-form-item>
            <el-form-item>
                <el-button size="mini" type="primary" @click="getDataListFun()">查询</el-button>
                <el-button size="mini" type="success" @click="visable = false">关闭</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="dataList" border style="width: 100%;">
            <el-table-column type="index" header-align="center" align="center" width="50" label="序号"> </el-table-column>
            <el-table-column prop="realName" header-align="center" align="center" label="姓名"></el-table-column>
            <el-table-column prop="nickname" header-align="center" align="center" label="昵称"></el-table-column>
            <el-table-column prop="phone" header-align="center" align="center" label="手机号"></el-table-column>
            <el-table-column :formatter="genderType" header-align="center" align="center" label="性别"></el-table-column>
            <el-table-column prop="departmentName" header-align="center" align="center" label="部门"></el-table-column>
            <el-table-column header-align="center" align="center" width="100" label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" plain size="mini" @click="add(scope.row.userId)">添加</el-button>
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
        ></el-pagination>
    </el-dialog>
</template>

<script>
import {genderType} from '@/utils/resources/index.js';
export default {
    data() {
        return {
            dataForm: {
                realName: '',
                phone: '',
            },
            visable: false,
            pageNum: 1,
            pageSize: 10,
            total: 0,
            dataList: [],
        };
    },
    methods: {
        init(id) {
            this.getDataListFun();
            this.visable = true;
        },
        getDataListFun() {
            this.pageNum = 1;
            this.getDataList();
        },
        getDataList() {
            this.$http({
                url: this.$http.adornUrl('/v1/user/companys/employees'),
                method: 'get',
                params: this.$http.adornParams(
                    Object.assign(
                        {
                            pageNum: this.pageNum,
                            pageSize: this.pageSize,
                        },
                        this.dataForm
                    )
                ),
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.dataList = data.data.list;
                    this.total = data.data.total;
                }
            });
        },
        // 添加
        add(userId) {
            this.$http({
                url: this.$http.adornUrl('/v1/customized/canteenEmployees'),
                method: 'post',
                data: this.$http.adornData({
                    userId: userId,
                }),
            }).then(({data}) => {
                if (data && data.code === 201) {
                    this.visable = false;
                    this.$emit('refreshDataList');
                    this.$message.success('新增成功');
                }
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
        genderType(item) {
            return genderType(item.gender);
        },
    },
};
</script>
<style lang="scss" scoped>
.el-input,
.el-select {
    width: 110px;
}
.deviceSn {
    .el-input {
        width: 140px;
    }
}
</style>
