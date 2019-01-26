<template>
    <!-- 物业管理/物业报修 -->
    <div class="mod-user">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" size="small">
            <el-form-item label="反馈人账号:"> <el-input v-model="dataForm.userAccount" placeholder="请输入反馈人账号" clearable></el-input> </el-form-item>
            <el-form-item label="状态:">
                <el-select v-model="dataForm.status" placeholder="请选择状态"> <el-option v-for="item in statusArr" :key="item.value" :label="item.label" :value="item.value"></el-option> </el-select>
            </el-form-item>
            <!-- <el-form-item label="类型:">
        <el-select v-model="dataForm.type" placeholder="请选择类型">
          <el-option v-for="(status,index) in typeArr" :key="index" :label="status" :value="index"></el-option>
        </el-select>
      </el-form-item> -->
            <el-form-item> <el-button type="primary" @click="getDataList()">查询</el-button> </el-form-item>
        </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
            <el-table-column type="index" header-align="center" align="center" width="50" label="序号"> </el-table-column>
            <el-table-column prop="userName" header-align="center" align="center" label="反馈人姓名"> </el-table-column>
            <el-table-column prop="userAccount" header-align="center" align="center" label="反馈人账号"> </el-table-column>
            <el-table-column prop="content" header-align="center" align="center" min-width="150" label="反馈内容"> </el-table-column>
            <el-table-column prop="createdAt" header-align="center" align="center" :formatter="createdAt" label="反馈时间"> </el-table-column>
            <el-table-column prop="status" header-align="center" align="center" :formatter="status" label="状态"> </el-table-column>
            <el-table-column prop="score" header-align="center" align="center" label="评价"> </el-table-column>
            <el-table-column header-align="center" align="center" width="100" label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" plain size="mini" @click="detail(scope.row.serviceId)">详情</el-button>
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
    </div>
</template>

<script>
import {commonFunc} from '@/utils/resources/index.js';
export default {
    data() {
        return {
            dataForm: {
                userAccount: '',
                type: 2, //物业报修
                status: null,
            },
            statusArr: [{value: null, label: '全部'}, {value: 1, label: '待处理'}, {value: 2, label: '处理中'}, {value: 3, label: '已处理'}],
            // typeArr:[],
            pageSize: 10,
            pageNum: 1,
            totalPage: 0,
            // 表格数据展示
            dataList: [],
            dataListLoading: false,
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
                url: this.$http.adornUrl('/v2/prop/services'),
                method: 'get',
                params: this.$http.adornParams({
                    userAccount: this.dataForm.userAccount,
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
            this.pageNum = 1;
            this.getDataList();
        },
        // 当前页
        currentChangeHandle(val) {
            this.pageNum = val;
            this.getDataList();
        },
        detail(id) {
            this.$router.push({path: '/propertyService-detail', query: {id: id}});
        },
        // 后端返回的数字，转换成中文
        feedbackAt(item) {
            return commonFunc(item.feedbackAt);
        },
        createdAt(item) {
            return commonFunc(item.createdAt);
        },
        opinionType(item) {
            switch (item.opinionType) {
                case 1:
                    return '投诉';
                    break;
                case 2:
                    return '建议';
                    break;
            }
        },
        status(item) {
            switch (item.status) {
                case 1:
                    return '待处理';
                    break;
                case 2:
                    return '处理中';
                    break;
                case 3:
                    return '已处理';
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
            }
        },
    },
};
</script>
