<template>
    <el-row>
        <form-table :formConf="formConf"></form-table>
        <conf-table ref="table" :tableConf="tableConf" :URL="'/v1/pm/devices'"></conf-table>
    </el-row>
</template>

<script>
import commonFunc from '@/assets/common.js';
import formTable from '../ConfigModule/FormTable';
import confTable from '../ConfigModule/Table';
export default {
    components: {
        formTable,
        confTable,
    },
    data() {
        return {
            pageNum: 1,
            pageSize: 10,
            total: 0,
            dataList: [],
            formConf: [
                {
                    type: 'input',
                    labe: '设备编号',
                    prop: 'deviceSn',
                },
                {
                    type: 'input',
                    labe: '关联门牌',
                    prop: 'doorplateName',
                },
                {
                    type: 'input',
                    labe: '设备安装楼层',
                    prop: 'floorName',
                },
                {
                    type: 'button',
                    button_cof: [
                        {
                            text: '查询',
                            size: 'small',
                            color: 'success',
                            event: data => {
                                Object.assign(this.tableConf.params, data);
                                this.$refs.table.getDataList();
                            },
                        },
                    ],
                },
            ],
            tableConf: {
                params: {
                    type: 3,
                },
                conf_col: [
                    {
                        type: 'index',
                        name: '序号',
                        width: 50,
                    },
                    {
                        name: '名称',
                        prop: 'name',
                    },
                    {
                        name: '设备编号',
                        prop: 'deviceSn',
                    },
                    {
                        name: '设备型号',
                        prop: 'model',
                    },
                    {
                        name: '设备安装楼层',
                        prop: 'floorName',
                    },
                    {
                        name: '具体位置',
                        prop: 'position',
                    },
                    {
                        name: '安装日期',
                        prop: 'installationTime',
                        filter: val => {
                            return commonFunc.commonFunc(val);
                        },
                    },
                    {
                        name: '关联门牌',
                        prop: 'doorplateName',
                    },
                    {
                        name: '操作',
                        type: 'button',
                        width: '100',
                        tab_conf: [
                            {
                                size: 'mini',
                                text: '读数记录',
                                type: 'success',
                                event: data => {
                                    this.$router.push({name: 's-record', query: {deviceId: data.scope.row.deviceId}});
                                },
                            },
                        ],
                    },
                ],
            },
        };
    },
    methods: {},
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.$refs.table.refresh();
        });
    },
};
</script>
