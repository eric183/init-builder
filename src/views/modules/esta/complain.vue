<template>
    <!-- 物业管理/投诉建议 -->
    <div class="mod-user">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" size="small">
            <el-form-item label="反馈人账号:"> <el-input v-model="dataForm.userAccount" placeholder="请输入反馈人账号" clearable></el-input> </el-form-item>
            <el-form-item> <el-button v-if="isAuth('property:service:getProServices')" type="primary" @click="getDataList()">查询</el-button> </el-form-item>
        </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
            <el-table-column type="index" header-align="center" align="center" width="50" label="序号"> </el-table-column>
            <el-table-column prop="content" header-align="center" :show-overflow-tooltip="true" align="center" label="反馈内容"> </el-table-column>
            <el-table-column prop="image" header-align="center" align="center" min-width="50" label="图片">
                <template slot-scope="scope">
                    <span v-if="scope.row.image" v-for="(item, index) in scope.row.image" :key="index" class="ml10">
                        <el-popover placement="right" trigger="click">
                            <img :src="item" style="max-width:720px;max-height:600px;" /> <img slot="reference" :src="item" style="width:50px;height:50px;" />
                        </el-popover>
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="feedbackAt" header-align="center" align="center" :formatter="feedbackAt" min-width="50" label="反馈时间"> </el-table-column>
            <el-table-column prop="userAccount" header-align="center" align="center" min-width="50" label="反馈人账号"> </el-table-column>
            <el-table-column header-align="center" align="center" width="100" label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" plain size="mini" @click="detail(scope.row)">详情</el-button>
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
        <!-- 弹窗, 查看详情 -->
        <el-dialog :title="'详情'" :close-on-click-modal="false" @close="closeDialog" :visible.sync="visible">
            <div class="esta_detail esta_title">
                <p>问题描述:</p>
                <p class="esta_con">{{ dialogForm.content }}</p>
            </div>
            <div class="esta_detail">
                <p>图片详情:</p>
                <p class="esta_con2">
                    <span v-for="(item, index) in dialogForm.image" :key="index"> <img :src="item" alt="" style="width:60%;height:auto;" /> </span>
                </p>
            </div>
            <span slot="footer" class="dialog-footer"> <el-button size="small" type="primary" @click="visible = false">确定</el-button> </span>
        </el-dialog>
    </div>
</template>

<script>
import commonFunc from '@/assets/common.js';
export default {
    data() {
        return {
            dataForm: {
                userAccount: '',
                type: 3, //投诉建议
            },
            pageSize: 10,
            pageNum: 1,
            totalPage: 0,
            // 表格数据展示
            dataList: [],
            imgList: [],
            dataListLoading: false,
            visible: false,
            // 弹框内容
            dialogForm: {
                content: '',
            },
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
                url: this.$http.adornUrl('/v1/prop/services'),
                method: 'get',
                params: this.$http.adornParams({
                    userAccount: this.dataForm.userAccount,
                    type: this.dataForm.type,
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                }),
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.dataList = data.data.list;
                    this.totalPage = data.data.total;
                    // 后端返回的图片字符串转换成数组
                    for (var i in this.dataList) {
                        if (this.dataList[i].image == '') {
                            this.dataList[i].image = [];
                        } else {
                            if (this.dataList[i].image.indexOf(',') != -1) {
                                this.dataList[i].image = this.dataList[i].image.split(',');
                            } else {
                                var list = [];
                                list.push(this.dataList[i].image);
                                this.dataList[i].image = list;
                            }
                        }
                    }
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
        detail(obj) {
            this.visible = true; //打开弹框
            this.dialogForm = obj;
            if (this.dialogForm.image == '') {
                this.dialogForm.image = [];
            } else {
                if (this.dialogForm.image.indexOf(',') != -1) {
                    this.dialogForm.image = this.dialogForm.image.split(',');
                } else {
                    var list = [];
                    list.push(this.dialogForm.image);
                    this.dialogForm.image = list;
                }
            }
        },
        // 弹框关闭
        closeDialog() {},
        // 后端返回的数字，转换成中文
        feedbackAt(item) {
            return commonFunc.commonFunc(item.feedbackAt);
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
