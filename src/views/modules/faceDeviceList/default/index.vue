<template>
    <div class="mod-role">
        <el-form :inline="true" :model="dataForm" size="small">
            <el-form-item label="设备编号"> <el-input v-model="dataForm.deviceId" placeholder="设备编号"></el-input> </el-form-item>
            <el-form-item label="名称"> <el-input v-model="dataForm.name" placeholder="名称"></el-input> </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="queryTable()">查询</el-button>
                <el-button type="success" @click="showAddPage()">新增</el-button>
            </el-form-item>
        </el-form>
        <el-row> <ZZTable ref="table" :conf="tableConf" :OtherUrl="'/v1/face/devices'"></ZZTable> </el-row>
        <DeviceEdit v-if="deviceEditShow" ref="deviceEdit"></DeviceEdit>
    </div>
</template>

<script>
import ZZTable from '@/views/compontents/Table';
import DeviceEdit from './deviceEdit';
export default {
    components: {
        ZZTable,
        DeviceEdit,
    },
    data() {
        return {
            deviceEditShow: false,
            dataForm: {
                name: '',
                deviceId: '',
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
                        prop: 'deviceId',
                        lab: '设备编号',
                    },
                    {
                        prop: 'name',
                        lab: '名称',
                    },
                    {
                        prop: 'type',
                        lab: '类型',
                        filter: val => {
                            switch (val) {
                                case 1:
                                    return '闸机';
                                    break;
                            }
                        },
                    },
                    {
                        prop: 'ip',
                        lab: 'ip地址',
                    },
                    {
                        prop: 'faceNum',
                        lab: '人脸数',
                    },
                    {
                        prop: 'version',
                        lab: '版本号',
                    },
                    {
                        prop: 'netStatus',
                        lab: '联网状态',
                        filter: val => {
                            switch (val) {
                                case 1:
                                    return '联网';
                                    break;
                                case 2:
                                    return '未联网';
                                    break;
                            }
                        },
                    },
                    {
                        prop: 'status',
                        lab: '设备状态',
                        filter: val => {
                            switch (val) {
                                case 1:
                                    return '启用';
                                    break;
                                case 2:
                                    return '停用';
                                    break;
                            }
                        },
                    },
                    {
                        prop: 'inout',
                        lab: '安装位置',
                        filter: val => {
                            switch (val) {
                                case 1:
                                    return '进入';
                                    break;
                                case 2:
                                    return '外出';
                                    break;
                                case 3:
                                    return '其它';
                                    break;
                            }
                        },
                    },
                    {
                        prop: 'brightness',
                        lab: '屏幕亮度',
                    },
                    {
                        prop: 'voice',
                        lab: '声音大小',
                    },
                    {
                        type: 'button',
                        lab: '操作',
                        width: 200,
                        sub_conf: [
                            {
                                size: 'mini',
                                text: '修改',
                                type: 'success',
                                event: data => {
                                    this.deviceEditShow = true;
                                    this.$nextTick(() => {
                                        this.$refs.deviceEdit.selectById(data.scope.row.deviceId);
                                    });
                                },
                            },
                            {
                                size: 'mini',
                                text: '删除',
                                type: 'danger',
                            },
                        ],
                    },
                ],
            },
        };
    },
    methods: {
        queryTable() {
            this.tableConf.params = this.dataForm;
            this.$refs.table.requestTableData();
        },
        showAddPage() {
            this.deviceEditShow = true;
            this.$nextTick(() => {
                this.$refs.deviceEdit.init();
            });
        },
    },
    computed: {},
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.$refs.table.refresh();
        });
    },
};
</script>

<style></style>
