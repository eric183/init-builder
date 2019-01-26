<template>
    <el-row>
        <!-- 预约列表 -->
        <MultiFunctionTable ref="configTable" :config="multiConfig"></MultiFunctionTable>
    </el-row>
</template>
<script>
import MultiFunctionTable from '@/views/compontents/MultiFunctionTable';
export default {
    components: {MultiFunctionTable},
    data() {
        return {
            multiConfig: {
                allUrl: this.$http.adornUrl('/v2/customized/dinings'),
                selectFormData: {
                    forms: [
                        {
                            type: 'input',
                            label: '姓名',
                            name: 'realname',
                        },
                        {
                            type: 'select',
                            label: '类型',
                            name: 'bookingType',
                            options: [{label: '全部', value: 0}, {label: '早餐', value: 1}, {label: '午餐', value: 2}, {label: '晚餐', value: 3}],
                        },
                        {
                            type: 'daterange',
                            label: '日期',
                            names: ['startTime', 'endTime'],
                            format: 'yyyy-MM-dd',
                        },
                    ],
                },
                tableConf: {
                    params: {},
                    pageName: '预约记录',
                    colConf: [
                        {
                            type: 'index',
                            lab: '序号',
                            width: 50,
                        },
                        {
                            prop: 'bookingType',
                            lab: '预定类型',
                            filter: val => {
                                if (val === 1) {
                                    return '早餐';
                                } else if (val === 2) {
                                    return '午餐';
                                } else if (val === 3) {
                                    return '晚餐';
                                }
                                return '未知';
                            },
                        },
                        {
                            prop: 'bookingTime',
                            lab: '预定日期',
                            type: 'timestamp',
                            format: 'yyyy-MM-dd',
                        },
                        {
                            prop: 'realname',
                            lab: '姓名',
                        },
                        {
                            prop: 'phone',
                            lab: '电话',
                        },
                        {
                            prop: 'departmentName',
                            lab: '部门',
                        },
                        {
                            prop: 'employeeNo',
                            lab: '工号',
                        },
                    ],
                },
            },
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.$refs.configTable.refresh();
        });
    },
};
</script>

<style scoped></style>
