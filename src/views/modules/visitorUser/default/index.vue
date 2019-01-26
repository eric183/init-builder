<template>
    <el-row>
        <FormTable ref="table" :conf="tablePageData"></FormTable>
        <VisitorUserEdit v-if="visitorUserShow" ref="visitorUserEdit"></VisitorUserEdit>
        <VisitorUserDeviceRef v-if="visitorUserDeviceShow" ref="visitorUserDevice"></VisitorUserDeviceRef>
    </el-row>
</template>

<script>
import FormTable from '@/views/compontents/FormTable';
import VisitorUserEdit from './visitorUserEdit';
import VisitorUserDeviceRef from './visitorUserDeviceRef';
export default {
    components: {FormTable, VisitorUserEdit, VisitorUserDeviceRef},
    data() {
        return {
            visitorUserShow: false,
            visitorUserDeviceShow: false,
            tablePageData: {
                url: this.$http.adornUrl4('/v1/face/visitorUsers'),
                formData: {
                    forms: [
                        {
                            type: 'input',
                            label: '访客姓名',
                            name: 'userName',
                        },
                        {
                            type: 'input',
                            label: '访客电话',
                            name: 'phone',
                        },
                        {
                            type: 'select',
                            label: '性别',
                            name: 'gender',
                            options: [
                                {
                                    label: '全部',
                                    value: null,
                                },
                                {
                                    label: '男',
                                    value: 1,
                                },
                                {
                                    label: '女',
                                    value: 2,
                                },
                            ],
                        },
                    ],
                    buttons: [
                        {
                            size: 'mini',
                            text: '新增',
                            type: 'success',
                            event: () => {
                                this.visitorUserShow = true;
                                this.$nextTick(() => {
                                    this.$refs.visitorUserEdit.init();
                                });
                            },
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
                            lab: '访客姓名',
                        },
                        {
                            prop: 'phone',
                            lab: '访客电话',
                        },
                        {
                            type: 'img',
                            prop: 'faceUser',
                            lab: '访客头像',
                            sub_conf: {},
                        },
                        {
                            prop: 'gender',
                            lab: '性别',
                            filter: val => {
                                let sex = '未知性别';
                                switch (val) {
                                    case 1:
                                        sex = '男';
                                        break;
                                    case 2:
                                        sex = '女';
                                        break;
                                    default:
                                        sex = '未知性别';
                                }
                                return sex;
                            },
                        },
                        {
                            prop: 'idCard',
                            lab: '身份证号码',
                        },
                        {
                            prop: 'userType',
                            lab: '访客类型',
                            filter: val => {
                                let type = '未知类型';
                                switch (val) {
                                    case 1:
                                        type = '普通访客';
                                        break;
                                    case 2:
                                        type = 'VIP';
                                        break;
                                    default:
                                        type = '未知性别';
                                }
                                return type;
                            },
                        },
                        {
                            prop: 'startTime',
                            lab: '有效开始时间',
                            format: 'yyyy-MM-dd HH:mm:ss',
                            type: 'timestamp',
                        },
                        {
                            prop: 'endTime',
                            lab: '有效结束时间',
                            format: 'yyyy-MM-dd HH:mm:ss',
                            type: 'timestamp',
                        },
                        {
                            prop: 'companyName',
                            lab: '拜访企业',
                        },
                        {
                            prop: 'floorName',
                            lab: '拜访楼层',
                        },
                        {
                            type: 'button',
                            lab: '操作',
                            width: 320,
                            sub_conf: [
                                {
                                    size: 'mini',
                                    text: '修改',
                                    type: 'success',
                                    event: data => {
                                        this.visitorUserShow = true;
                                        this.$nextTick(() => {
                                            this.$refs.visitorUserEdit.selectById(data.scope.row.userId);
                                        });
                                    },
                                },
                                {
                                    size: 'mini',
                                    text: '删除',
                                    type: 'danger',
                                    event: data => {
                                        let that = this;
                                        this.$confirm('确定删除？').then(() => {
                                            this.$http({
                                                url: this.$http.adornUrl4('/v1/face/visitorUsers/' + data.scope.row.userId),
                                                method: 'DELETE',
                                            }).then(data => {
                                                that.$refs.table.requestTableData();
                                            });
                                        });
                                    },
                                },
                                {
                                    size: 'mini',
                                    text: '绑定设备',
                                    type: 'success',
                                    event: data => {
                                        this.visitorUserDeviceShow = true;
                                        this.$nextTick(() => {
                                            this.$refs.visitorUserDevice.init(data.scope.row.userId);
                                        });
                                    },
                                },
                            ],
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
