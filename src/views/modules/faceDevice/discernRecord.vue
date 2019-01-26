<template>
    <FormTable ref="table" :conf="tablePageData"></FormTable>
</template>

<script>
import FormTable from '../UIModules/FormTable';
export default {
    components: {FormTable},
    data() {
        return {
            tablePageData: {
                url: this.$http.adornUrl4('/v1/face/discernRecords'),
                formData: {
                    forms: [
                        {
                            type: 'input',
                            label: '用户姓名',
                            name: 'userName',
                        },
                        {
                            type: 'input',
                            label: '电话',
                            name: 'phone',
                        },
                        {
                            type: 'select',
                            label: '识别状态',
                            name: 'status',
                            value: null,
                            options: [
                                {
                                    label: '全部',
                                    value: null,
                                },
                                {
                                    label: '成功',
                                    value: 1,
                                },
                                {
                                    label: '未成功',
                                    value: 2,
                                },
                            ],
                        },
                        {
                            type: 'datetimerange',
                            label: '识别时间',
                            names: ['startTime', 'endTime'],
                            format: 'yyyy-MM-dd HH:mm:ss',
                            defaultTime: ['00:00:00', '23:59:59'],
                        },
                    ],
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
                            prop: 'userName',
                            lab: '姓名',
                        },
                        {
                            prop: 'phone',
                            lab: '电话',
                        },
                        {
                            type: 'img',
                            prop: 'registerUrl',
                            lab: '注册时头像',
                            sub_conf: {},
                        },
                        {
                            type: 'img',
                            prop: 'faceUrl',
                            lab: '识别头像',
                            sub_conf: {},
                        },
                        {
                            prop: 'score',
                            lab: '识别分数',
                        },
                        {
                            prop: 'deviceId',
                            lab: '设备编号',
                        },
                        {
                            prop: 'thatTime',
                            lab: '识别时间',
                            format: 'yyyy-MM-dd HH:mm:ss',
                            type: 'timestamp',
                        },
                    ],
                },
            },
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.$refs.table.refresh();
        });
    },
};
</script>

<style scoped></style>
