<template>
    <el-row>
        <el-row>
            <el-form :inline="true" :model="formData" size="small">
                <el-form-item label="工单编号"> <el-input v-model="formData.ticketSn" placeholder="请输入工单编号"></el-input> </el-form-item>
                <el-form-item label="工单状态">
                    <el-select v-model="formData.status" placeholder="请选择工单状态">
                        <el-option v-for="(status, index) in fix_status" :key="index" :label="status" :value="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="工单类型">
                    <el-select v-model="formData.type" placeholder="请选择工单类型"> <el-option v-for="(type, index) in order_type" :key="index" :label="type" :value="index"></el-option> </el-select>
                </el-form-item>
                <el-form-item label="创建时间">
                    <el-col :span="11">
                        <el-date-picker type="date" placeholder="选择起始日期" value-format="yyyy-MM-dd 00:00:00" v-model="formData.startTime" style="width: 100%;" clearable></el-date-picker>
                    </el-col>
                    <el-col class="line" :span="2" style="text-align: center;">-</el-col>
                    <el-col :span="11">
                        <el-date-picker type="date" placeholder="选择结束日期" value-format="yyyy-MM-dd 23:59:59" v-model="formData.endTime" style="width: 100%;" clearable></el-date-picker>
                    </el-col>
                </el-form-item>
                <el-form-item>
                    <el-button size="small" type="primary" @click="searchData">查询</el-button>
                    <el-button size="small" type="success" @click="putData">新增</el-button>
                    <el-popover placement="bottom" width="290" trigger="hover">
                        <el-button type="success" @click="pdf(1)">导出当前页</el-button>
                        <el-button type="success" @click="pdf(0)">导出全部</el-button>
                        <el-button slot="reference" type="success">导出</el-button>
                    </el-popover>
                </el-form-item>
            </el-form>
        </el-row>
        <ZZTable ref="table" :conf="tableConf" v-on:pageInfo="pageInfo" :URL="'/v1/pm/regularization/tickets'"></ZZTable>
        <cancel-dialog ref="cancelRef" @refreshDataList="searchData"></cancel-dialog>
    </el-row>
</template>

<script>
import ZZTable from '@/views/modules/UIModules/Table';
import cancelDialog from './cancelDialog';
import {order_type, prioritys, order_origin, fix_status} from '@/assets/js/Const';
import {download} from '../customized/customized';
export default {
    components: {
        ZZTable,
        cancelDialog,
    },
    data() {
        return {
            pageInfoObj: {
                pageNum: 1,
                pageSize: 10,
                total: 100,
            }, //子组件传过来
            formData: {
                ticketSn: '',
                status: '',
                type: '',
                startTime: '',
                endTime: '',
            },
            tableConf: {
                isExcel: true,
                params: {},
                colConf: [
                    {
                        prop: 'date',
                        type: 'index',
                        lab: '序号',
                        width: 80,
                    },
                    {
                        prop: 'ticketSn',
                        lab: '工单编号',
                    },
                    {
                        prop: 'creatorName',
                        lab: '创建人',
                    },
                    {
                        prop: 'contact',
                        lab: '联系方式',
                    },
                    {
                        prop: 'type',
                        lab: '工单类型',
                        filter: val => {
                            return order_type[val];
                        },
                    },
                    {
                        prop: 'content',
                        lab: '问题描述',
                    },
                    {
                        prop: 'importance',
                        lab: '严重度',
                        filter: val => {
                            return prioritys[val];
                        },
                    },
                    {
                        prop: 'priority',
                        lab: '紧急度',
                        filter: val => {
                            return prioritys[val];
                        },
                    },
                    {
                        prop: 'executorName',
                        lab: '执行人',
                    },
                    {
                        prop: 'status',
                        lab: '状态',
                        filter: val => {
                            return fix_status[val];
                        },
                    },
                    {
                        prop: 'createdAt',
                        lab: '创建时间',
                        width: 160,
                        filter: val => {
                            return this.translateTimeStamp(val);
                        },
                    },
                    {
                        type: 'button',
                        lab: '操作',
                        width: 150,
                        sub_conf: [
                            {
                                size: 'mini',
                                text: '详情',
                                event: data => {
                                    this.go('/workerOrder_detail', {ticketId: data.scope.row.ticketId, status: data.scope.row.status, detailId: data.scope.row.detailId});
                                },
                            },
                        ],
                        isShowButton: 1,
                        button_conf: [
                            {
                                size: 'mini',
                                type: 'danger',
                                text: '取消',
                                event: data => {
                                    this.$confirm(`确定取消?`, '提示', {
                                        confirmButtonText: '确定',
                                        cancelButtonText: '取消',
                                        type: 'warning',
                                    })
                                        .then(() => {
                                            this.$refs.cancelRef.init(data.scope.row.ticketId);
                                        })
                                        .catch(() => {});
                                },
                            },
                        ],
                    },
                ],
            },
        };
    },
    computed: {
        order_type() {
            return order_type;
        },
        fix_status() {
            return fix_status;
        },
    },
    methods: $.extend(Methods, {
        searchData() {
            this.tableConf.params = this.formData;
            this.$refs.table.refresh();
        },
        putData() {
            this.$router.push('workerOrder_add');
        },
        pageInfo(value) {
            this.pageInfoObj = value;
        },
        // 导出当前页
        pdf(value) {
            let pageInfo = {};
            if (value) {
                // 当前页
                pageInfo.pageNum = this.pageInfoObj.pageNum;
                pageInfo.pageSize = this.pageInfoObj.pageSize;
            } else {
                // 全部
                pageInfo.pageNum = 1;
                pageInfo.pageSize = this.pageInfoObj.total;
            }
            this.$http({
                url: this.$http.adornUrl('/v1/pm/regularization/tickets/excels'),
                method: 'get',
                responseType: 'blob',
                params: this.$http.adornParams(Object.assign(pageInfo, this.formData)),
            })
                .then(response => {
                    download(response.data, '订单.xls');
                })
                .catch(err => {
                    console.log(err);
                });
        },
    }),
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.$refs.table.refresh();
        });
    },
};
</script>

<style></style>
