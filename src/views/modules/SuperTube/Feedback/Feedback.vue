<template>
    <!-- 内容运营/意见反馈管理 -->
    <div class="mod-user">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataListFun()" size="small">
            <el-form-item label="反馈人:"> <el-input v-model="dataForm.userName" placeholder="请输入反馈人姓名" clearable></el-input> </el-form-item>
            <el-form-item label="账号:" class="ml10"> <el-input v-model="dataForm.userAccount" placeholder="请输入反馈人账号" clearable></el-input> </el-form-item>
            <el-form-item label="提交时间:" class="ml10">
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
            <el-form-item> <el-button type="primary" @click="getDataListFun()">查询</el-button> </el-form-item>
        </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
            <el-table-column type="index" header-align="center" align="center" width="50" label="序号"> </el-table-column>
            <el-table-column prop="content" header-align="center" align="center" :show-overflow-tooltip="true" label="反馈内容"> </el-table-column>
            <el-table-column prop="image" header-align="center" align="center" min-width="100" label="图片">
                <template slot-scope="scope">
                    <span v-for="(item, index) in scope.row.image" :key="index" class="ml10">
                        <el-popover placement="right" trigger="click">
                            <img :src="item" style="max-width:720px;max-height:600px;" /> <img slot="reference" :src="item" style="width:50px;height:50px;" />
                        </el-popover>
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="feedbackAt" header-align="center" align="center" :formatter="feedbackAt" :show-overflow-tooltip="true" label="提交时间"> </el-table-column>
            <el-table-column prop="userName" header-align="center" align="center" label="反馈人"> </el-table-column>
            <el-table-column prop="userAccount" header-align="center" align="center" label="账号"> </el-table-column>
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
import commonFunc from '@/assets/common.js';
export default {
    data() {
        return {
            dataForm: {
                userName: '',
                userAccount: '',
                startTime: '',
                endTime: '',
                origin: 2, //来源物管app  对应物管后台的意见反馈页面
            },
            searchDate: [new Date(), new Date()], //日期查询
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
    mounted() {
        this.data();
    },
    methods: {
        //  初始化时间
        data() {
            const end = new Date();
            this.searchDate = [end, end];
            this.dataForm.startTime = commonFunc.commonFunc2(end.getTime());
            this.dataForm.endTime = commonFunc.commonFunc2(end.getTime());
        },
        getDataListFun() {
            this.pageNum = 1;
            this.getDataList();
        },
        // 获取数据列表
        getDataList() {
            this.dataListLoading = true;
            this.$http({
                url: this.$http.adornUrl('/v1/info/feedback'),
                method: 'get',
                params: this.$http.adornParams({
                    userName: this.dataForm.userName,
                    userAccount: this.dataForm.userAccount,
                    origin: this.dataForm.origin,
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    startTime: this.dataForm.startTime,
                    endTime: this.dataForm.endTime,
                }),
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.dataList = data.data.list;
                    this.totalPage = data.data.total;
                    // 后端返回的图片字符串转换成数组
                    this.getArray(this.dataList);
                } else {
                    this.dataList = [];
                }
                this.dataListLoading = false;
            });
        },
        // 后端返回的图片字符串转换成数组
        getArray(fun) {
            for (var i in fun) {
                if (fun[i].image == '') {
                    fun[i].image = [];
                } else {
                    if (fun[i].image.indexOf(',') != -1) {
                        fun[i].image = fun[i].image.split(',');
                    } else {
                        var list = [];
                        list.push(fun[i].image);
                        fun[i].image = list;
                    }
                }
            }
        },
        //   时间转换
        getTime(val) {
            if (val) {
                for (let i = 0; i < val.length; i++) {
                    this.dataForm.startTime = val[0];
                    this.dataForm.endTime = val[1];
                }
            } else {
                (this.dataForm.startTime = ''), (this.dataForm.endTime = '');
            }
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
        // 后端返回的数字，转换成中文
        feedbackAt(item) {
            return commonFunc.commonFunc(item.feedbackTime);
        },
    },
};
</script>
<style scoped>
/* img { 
      transform: scale(1); 
      transition: all ease 0.5s; 
    } 
    img:hover { 
      transform: scale(2); 
      position: relative; 
      z-index: 9999; 
    } */
</style>
