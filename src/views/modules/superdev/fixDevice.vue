<template>
    <el-row>
        <el-row>
            <el-form :inline="true" :model="formData" size="small">
                <el-form-item label="工单编号"> <el-input v-model="formData.ticketSn" placeholder="请输入工单编号" clearable></el-input> </el-form-item>
                <el-form-item label="设备编号"> <el-input v-model="formData.deviceSn" placeholder="请输入设备编号" clearable></el-input> </el-form-item>
                <el-form-item label="工单状态">
                    <el-select v-model="formData.status" placeholder="请选择工单状态">
                        <el-option v-for="(status, index) in fix_status" :key="index" :label="status" :value="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="工单来源">
                    <el-select v-model="formData.origin" placeholder="请选择工单来源">
                        <el-option v-for="(origin, index) in order_origin" :key="index" :label="origin" :value="index"></el-option>
                    </el-select>
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
                    <el-button size="small" type="success" @click="fixDeviceputData">新增</el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <ZZTable ref="table" :conf="tableConf" :URL="'/v1/pm/repairment/tickets'"></ZZTable>
    </el-row>
</template>

<script>
import ZZTable from '@/views/modules/UIModules/Table';
import LabelController from '@/views/modules/UIModules/LabelController';
import {prioritys, order_origin, fix_status} from '@/assets/js/Const';
export default {
    components: {
        ZZTable,
        LabelController,
    },
    data() {
        return {
            formData: {
                ticketSn: '',
                deviceSn: '',
                status: '',
                origin: '',
                startTime: '',
                endTime: '',
            },
            tableConf: {
                params: {},
                colConf: [
                    {
                        prop: 'date',
                        type: 'index',
                        lab: '序号',
                        width: 50,
                    },
                    {
                        prop: 'ticketSn',
                        lab: '工单编号',
                    },
                    {
                        prop: 'deviceName',
                        lab: '设备名称',
                    },
                    {
                        prop: 'deviceSn',
                        lab: '设备编号',
                    },
                    {
                        prop: 'floorName',
                        lab: '安装楼层',
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
                        prop: 'createdAt',
                        lab: '创建时间',
                        width: 160,
                        filter: val => {
                            return this.translateTimeStamp(val);
                        },
                    },
                    {
                        prop: 'origin',
                        lab: '工单来源',
                        filter: val => {
                            return order_origin[val];
                        },
                    },
                    {
                        prop: 'executorName',
                        lab: '处理人员',
                    },
                    {
                        prop: 'status',
                        lab: '维修状态',
                        filter: val => {
                            return fix_status[val];
                        },
                    },
                    {
                        prop: 'comment',
                        lab: '评价',
                    },
                    {
                        type: 'button',
                        lab: '操作',
                        sub_conf: [
                            {
                                size: 'mini',
                                text: '详情',
                                event: data => {
                                    this.go('/fixDevice-detail', {
                                        ticketId: data.scope.row.ticketId,
                                        status: data.scope.row.status,
                                    });
                                },
                            },
                        ],
                    },
                ],
            },
        };
    },
    computed: {
        order_origin() {
            return order_origin;
        },
        fix_status() {
            return fix_status;
        },
    },
    methods: $.extend(Methods, {
        searchData() {
            this.tableConf.params = this.formData;
            this.$refs.table.refresh();
            console.log('====');
        },
        fixDeviceputData() {
            this.$router.push('fixDevice-add');
        },
    }),
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.$refs.table.refresh();
            console.log('====++|+');
        });
    },
};
</script>

<style></style>
