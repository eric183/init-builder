<template>
    <el-row>
        <form-table :formConf="formConf"></form-table>
        <conf-table ref="table" :tableConf="tableConf" :URL="'/v1/pm/devices/' + $route.query.deviceId + '/records'"></conf-table>
    </el-row>
</template>

<script>
import commonFunc from '@/assets/common.js';
import formTable from '../ConfigModule/FormTable';
import confTable from '../ConfigModule/Table';
import {download} from '@/utils/resources/index.js';
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
                    type: 'date',
                    labe: '抄表时间',
                    prop: 'dateTime',
                },
                {
                    type: 'button',
                    button_cof: [
                        {
                            text: '查询',
                            size: 'small',
                            color: 'success',
                            event: data => {
                                if (data.dateTime) {
                                    this.tableConf.params.startTime = data.dateTime[0];
                                    this.tableConf.params.endTime = data.dateTime[1];
                                }
                                Object.assign(this.tableConf.params, data);
                                this.$refs.table.getDataList();
                            },
                        },
                        {
                            text: '导出',
                            size: 'small',
                            color: 'primary',
                            event: data => {
                                this.$http({
                                    url: this.$http.adornUrl('/v1/pm/devices/' + this.$route.query.deviceId + '/records/excels'),
                                    method: 'get',
                                    responseType: 'blob',
                                })
                                    .then(response => {
                                        download(response.data, '设备抄表excel.xls');
                                    })
                                    .catch(err => {
                                        console.log(err);
                                    });
                            },
                        },
                    ],
                },
            ],
            tableConf: {
                params: {
                    deviceId: null,
                    startTime: '',
                    endTime: '',
                },
                conf_col: [
                    {
                        type: 'index',
                        name: '序号',
                        width: 50,
                    },
                    {
                        name: '设备编号',
                        prop: 'deviceSn',
                    },
                    {
                        name: '抄表时间',
                        prop: 'recordTime',
                        filter: val => {
                            return commonFunc.commonFunc(val);
                        },
                    },
                    {
                        name: '抄表人员',
                        prop: 'realname',
                    },
                    {
                        name: '抄表人员联系方式',
                        prop: 'phone',
                    },
                    {
                        name: '图片',
                        prop: 'image',
                        type: 'imge',
                    },
                    {
                        name: '抄表读数',
                        prop: 'deviceValue',
                        addProp: 'unitSymbol', //字段组合
                        type: 'formate',
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
                                text: '删除',
                                type: 'danger',
                                event: data => {
                                    this.$confirm(`确定进行删除?`, '提示', {
                                        confirmButtonText: '确定',
                                        cancelButtonText: '取消',
                                        type: 'warning',
                                    })
                                        .then(() => {
                                            this.$http({
                                                url: this.$http.adornUrl('/v1/pm/devices/records/' + data.scope.row.recordId),
                                                method: 'delete',
                                            }).then(({data}) => {
                                                this.$refs.table.getDataList();
                                            });
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
    mounted() {
        this.tableConf.params.deviceId = this.$route.query.deviceId;
    },
    methods: {},
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.$refs.table.refresh();
        });
    },
};
</script>
