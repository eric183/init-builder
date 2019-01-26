<template>
    <div class="mod-user">
        <!-- 物业管理人员 -->
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataListFun()" size="small">
            <el-form-item> <el-input v-model="dataForm.name" placeholder="访客姓名" clearable></el-input> </el-form-item>
            <el-form-item> <el-input v-model="dataForm.companyName" placeholder="访问企业" clearable></el-input> </el-form-item>
            <el-form-item label="审核状态:" class="ml10">
                <el-select v-model="dataForm.status"> <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value"></el-option> </el-select>
            </el-form-item>
            <el-form-item label="到访时间:" class="ml10">
                <el-date-picker
                    v-model="searchDate"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    unlink-panels
                    range-separator="-"
                    start-placeholder="开始"
                    end-placeholder="结束"
                    @change="getTime"
                    clearable
                >
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getDataListFun()">查询</el-button>
                <el-popover placement="right" width="290" trigger="hover">
                    <el-button type="success" @click="pdfPart">导出当前页</el-button>
                    <el-button type="success" @click="pdfAll">导出当前条件下的全部</el-button>
                    <el-button slot="reference" type="success">导出</el-button>
                </el-popover>
            </el-form-item>
        </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
            <el-table-column type="index" header-align="center" align="center" width="50" label="序号"> </el-table-column>
            <el-table-column prop="name" header-align="center" align="center" label="姓名"> </el-table-column>
            <el-table-column :formatter="gender" header-align="center" align="center" label="性别"> </el-table-column>
            <el-table-column prop="phone" header-align="center" align="center" label="手机号"> </el-table-column>
            <el-table-column prop="companyName" header-align="center" align="center" :show-overflow-tooltip="true" label="访问企业"> </el-table-column>
            <el-table-column prop="floorName" header-align="center" align="center" label="访问楼层"> </el-table-column>
            <el-table-column prop="reason" header-align="center" align="center" label="来访事由"> </el-table-column>
            <el-table-column :formatter="createdAt" header-align="center" align="center" :show-overflow-tooltip="true" label="到访时间"> </el-table-column>
            <el-table-column header-align="center" :formatter="status" align="center" label="状态"> </el-table-column>
            <el-table-column header-align="center" align="center" min-width="80" label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" plain size="mini" @click="detail(scope.row)">详情</el-button>
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
        <detail v-if="userlistDetail" ref="detail" @refreshDataList="getDataList"></detail>
    </div>
</template>

<script>
import commonFunc from '@/assets/common.js';
import detail from './userlist-detail';
export default {
    data() {
        return {
            dataForm: {
                name: '',
                companyName: '',
                status: null,
                phone: '',
                idCard: '',
            },
            searchDate: [new Date(), new Date()], //日期查询
            startTime: '',
            endTime: '',
            dataList: [],
            pageIndex: 1,
            pageSize: 10,
            totalPage: 0,
            dataListLoading: false,
            userlistDetail: false,
            statusList: [{value: null, label: '全部'}, {value: 1, label: '待审核'}, {value: 2, label: '审核通过'}, {value: 3, label: '审核拒绝'}],
        };
    },
    components: {
        detail,
    },
    activated() {
        this.data();
        this.getDataList();
    },
    methods: {
        //  初始化时间
        data() {
            const end = new Date();
            this.searchDate = [end, end];
            this.startTime = commonFunc.commonFunc2(end.getTime());
            this.endTime = commonFunc.commonFunc2(end.getTime());
        },
        getDataListFun() {
            this.pageIndex = 1;
            this.getDataList();
        },
        // 获取数据列表
        getDataList() {
            this.dataListLoading = true;
            this.$http({
                url: this.$http.adornUrl('/v1/visitor/records'),
                method: 'get',
                params: this.$http.adornParams({
                    pageNum: this.pageIndex,
                    pageSize: this.pageSize,
                    name: this.dataForm.name,
                    companyName: this.dataForm.companyName,
                    status: this.dataForm.status,
                    startTime: this.startTime,
                    endTime: this.endTime,
                }),
            }).then(({data}) => {
                if (data.code == 200) {
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
            this.pageIndex = 1;
            this.getDataList();
        },
        // 当前页
        currentChangeHandle(val) {
            this.pageIndex = val;
            this.getDataList();
        },
        //获取查询时间
        getTime(val) {
            console.log(val);
            if (val) {
                for (let i = 0; i < val.length; i++) {
                    this.startTime = val[0];
                    this.endTime = val[1];
                }
            } else {
                (this.startTime = ''), (this.endTime = '');
            }
        },
        // 详情
        detail(obj) {
            this.userlistDetail = true;
            this.$nextTick(() => {
                this.$refs.detail.init(obj);
            });
        },
        status(item) {
            switch (item.status) {
                case 1:
                    return '待审核';
                    break;
                case 2:
                    return '审核通过';
                    break;
                case 3:
                    return '审核拒绝';
                    break;
            }
        },
        gender(item) {
            switch (item.gender) {
                case 1:
                    return '男';
                    break;
                case 2:
                    return '女';
                    break;
            }
        },
        // 修改访客状态
        switchChange(item, status) {
            this.$http({
                url: this.$http.adornUrl('/v1/visitor/records/' + item.recordId + '/status'),
                method: 'put',
                data: this.$http.adornData({
                    status: status,
                }),
            }).then(({data}) => {
                if (data && data.code === 201) {
                    this.$message({
                        message: '操作成功',
                        type: 'success',
                        duration: 1500,
                        onClose: () => {
                            this.visible = false;
                            this.getDataList();
                        },
                    });
                }
            });
        },
        createdAt(item) {
            return commonFunc.commonFunc(item.arriveTime);
        },
        // 导出当前页
        pdfPart() {
            if (this.dataForm.status) {
                window.location.href = this.$http.adornUrl(
                    '/v1/visitor/records/excels?pageSize=' +
                        this.pageSize +
                        '&pageNum=' +
                        this.pageIndex +
                        '&companyName=' +
                        this.dataForm.companyName +
                        '&status=' +
                        this.dataForm.status +
                        '&name=' +
                        this.dataForm.name +
                        '&startTime=' +
                        this.startTime +
                        '&endTime=' +
                        this.endTime
                );
            } else {
                window.location.href = this.$http.adornUrl(
                    '/v1/visitor/records/excels?pageSize=' +
                        this.pageSize +
                        '&pageNum=' +
                        this.pageIndex +
                        '&companyName=' +
                        this.dataForm.companyName +
                        '&name=' +
                        this.dataForm.name +
                        '&startTime=' +
                        this.startTime +
                        '&endTime=' +
                        this.endTime
                );
            }
        },
        //  导出当前条件下的全部
        pdfAll() {
            if (this.dataForm.status) {
                window.location.href = this.$http.adornUrl(
                    '/v1/visitor/records/excels?pageSize=' +
                        this.totalPage +
                        '&pageNum=' +
                        this.pageIndex +
                        '&companyName=' +
                        this.dataForm.companyName +
                        '&status=' +
                        this.dataForm.status +
                        '&name=' +
                        this.dataForm.name +
                        '&startTime=' +
                        this.startTime +
                        '&endTime=' +
                        this.endTime
                );
            } else {
                window.location.href = this.$http.adornUrl(
                    '/v1/visitor/records/excels?pageSize=' +
                        this.totalPage +
                        '&pageNum=' +
                        this.pageIndex +
                        '&companyName=' +
                        this.dataForm.companyName +
                        '&name=' +
                        this.dataForm.name +
                        '&startTime=' +
                        this.startTime +
                        '&endTime=' +
                        this.endTime
                );
            }
        },
    },
};
</script>
