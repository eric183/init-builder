<template>
    <el-row>
        <MultiFunctionTable :config="multiConfig"></MultiFunctionTable>
        <BlacklistDeviceRef v-if="blacklistDeviceShow" ref="blacklistDevice"></BlacklistDeviceRef>
    </el-row>
</template>

<script>
import {blacklistFaceMkdir} from '@/assets/imgjs.js';
import MultiFunctionTable from '@/views/modules/UIModules/MultiFunctionTable';
import BlacklistDeviceRef from '@/views/modules/faceDevice/blacklistDeviceRef';
export default {
    components: {MultiFunctionTable, BlacklistDeviceRef},
    data() {
        return {
            blacklistPageShow: false,
            blacklistDeviceShow: false,
            multiConfig: {
                allUrl: this.$http.adornUrl4('/v1/face/blacklists'),
                add: {
                    url: this.$http.adornUrl4('/v1/face/blacklists'),
                    method: 'POST',
                },
                update: {
                    url: this.$http.adornUrl4('/v1/face/blacklists'),
                    getUrl: this.$http.adornUrl4('/v1/face/blacklists/KEY'),
                    method: 'PUT',
                },
                deleteOne: {
                    url: this.$http.adornUrl4('/v1/face/blacklists/KEY'),
                    method: 'DELETE',
                },
                keyName: 'userId',
                addMothod: 'POST',
                updateMothod: 'PUT',
                deleteMothod: 'DELETE',
                formItems: [
                    {
                        type: 'hidden',
                        name: 'userId',
                        label: '用户ID',
                    },
                    {
                        type: 'input',
                        name: 'userName',
                        label: '用户名',
                        placeholder: '请输入用户名',
                    },
                    {
                        type: 'input',
                        name: 'phone',
                        label: '电话',
                        placeholder: '请输入电话',
                    },
                    {
                        type: 'input',
                        name: 'idCard',
                        label: '身份证号',
                        placeholder: '请输入身份证号',
                    },
                    {
                        type: 'input',
                        name: 'companyName',
                        label: '企业名称',
                        placeholder: '请输入企业名称',
                    },
                    {
                        type: 'input',
                        name: 'floorName',
                        label: '楼层',
                        placeholder: '请输入企业楼层',
                    },
                    {
                        type: 'radio',
                        name: 'gender',
                        label: '性别',
                        defaultValue: 1,
                        options: [
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
                    {
                        type: 'ossfileone',
                        name: 'faceUser',
                        label: '人脸头像',
                        httpPath: this.$http.adornUrl4('/v1/oss/tokens'),
                        imagePath: blacklistFaceMkdir,
                    },
                ],
                selectFormData: {
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
                    ],
                },
                tableConf: {
                    params: {},
                    colConf: [
                        {
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
                            prop: 'idCard',
                            lab: '身份证号',
                        },
                        {
                            type: 'img',
                            prop: 'faceUser',
                            lab: '人脸头像',
                            sub_conf: {},
                        },
                        {
                            prop: 'gender',
                            lab: '性别',
                            filter: val => {
                                let sex = '未知性别';
                                if (val === 1) {
                                    sex = '男';
                                } else if (val === 2) {
                                    sex = '女';
                                } else {
                                    sex = '未知性别';
                                }
                                return sex;
                            },
                        },
                        {
                            prop: 'companyName',
                            lab: '企业名称',
                        },
                        {
                            type: 'button',
                            lab: '设备操作',
                            width: 150,
                            sub_conf: [
                                {
                                    size: 'mini',
                                    text: '绑定设备',
                                    type: 'success',
                                    event: data => {
                                        this.blacklistDeviceShow = true;
                                        this.$nextTick(() => {
                                            this.$refs.blacklistDevice.init(data.scope.row.userId);
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
};
</script>

<style scoped></style>
