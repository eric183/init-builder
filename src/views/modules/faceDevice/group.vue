<template>
    <el-row>
        <FormTable ref="table" :conf="tablePageData"></FormTable>
        <DialogFromPage v-if="groupAddShow" :form-config="addFormConfig" ref="addFormConfig"></DialogFromPage>
        <GroupDeviceRef v-if="groupDeviceRefShow" ref="groupDeviceRef"></GroupDeviceRef>
    </el-row>
</template>

<script>
import FormTable from '@/views/modules/UIModules/FormTable';
import DialogFromPage from '@/views/modules/UIModules/DialogFromPage';
import GroupDeviceRef from '@/views/modules/faceDevice/groupDeviceRef';
export default {
    components: {
        DialogFromPage,
        FormTable,
        GroupDeviceRef,
    },

    data() {
        return {
            personEditPageShow: false,
            groupAddShow: false,
            groupDeviceRefShow: false,
            personAdd: false,
            addFormConfig: {
                url: this.$http.adornUrl4('/v1/face/groups'),
                httpMothod: 'POST',
                formItems: [
                    {
                        type: 'input',
                        name: 'name',
                        label: '分组名称',
                        placeholder: '请输入分组名称',
                    },
                ],
            },
            tablePageData: {
                url: this.$http.adornUrl4('/v1/face/groups'),
                formData: {
                    forms: [
                        {
                            type: 'input',
                            label: '分组ID',
                            placeholder: '分组ID',
                            name: 'groupId',
                        },
                        {
                            type: 'input',
                            label: '分组名称',
                            placeholder: '分组名称',
                            name: 'name',
                        },
                    ],
                    buttons: [
                        {
                            size: 'mini',
                            text: '新增',
                            type: 'success',
                            event: data => {
                                this.$nextTick(() => {
                                    this.groupAddShow = true;
                                    this.addFormConfig = {
                                        url: this.$http.adornUrl4('/v1/face/groups'),
                                        httpMothod: 'POST',
                                        formItems: [
                                            {
                                                type: 'input',
                                                name: 'name',
                                                value: '',
                                                label: '分组名称',
                                                placeholder: '请输入分组名称',
                                            },
                                        ],
                                    };
                                    this.$nextTick(() => {
                                        this.$refs.addFormConfig.init();
                                    });
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
                            prop: 'groupId',
                            lab: '分组ID',
                        },
                        {
                            prop: 'name',
                            lab: '分组名称',
                        },
                        {
                            type: 'button',
                            lab: '操作',
                            width: 400,
                            sub_conf: [
                                {
                                    size: 'mini',
                                    text: '修改',
                                    event: rowData => {
                                        this.groupAddShow = true;
                                        let that = this;
                                        this.$http({
                                            url: this.$http.adornUrl4('/v1/face/groups/' + rowData.scope.row.groupId),
                                            method: 'GET',
                                        }).then(({data}) => {
                                            if (data && data.code === 200) {
                                                that.addFormConfig = {
                                                    url: that.$http.adornUrl4('/v1/face/groups'),
                                                    httpMothod: 'PUT',
                                                    pageTitle: '修改',
                                                    formItems: [
                                                        {
                                                            type: 'input',
                                                            name: 'groupId',
                                                            disabled: true,
                                                            readonly: true,
                                                            label: '分组ID',
                                                            value: data.data.groupId,
                                                            placeholder: '请输入分组ID',
                                                        },
                                                        {
                                                            type: 'input',
                                                            name: 'name',
                                                            label: '分组名称',
                                                            value: data.data.name,
                                                            placeholder: '请输入分组名称',
                                                        },
                                                    ],
                                                };
                                                this.$nextTick(() => {
                                                    this.$refs.addFormConfig.init();
                                                });
                                            }
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
                                                url: this.$http.adornUrl4('/v1/face/groups/' + data.scope.row.groupId),
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
                                        this.groupDeviceRefShow = true;
                                        this.$nextTick(() => {
                                            this.$refs.groupDeviceRef.init(data.scope.row.groupId);
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
    methods: {
        queryTable() {
            this.tableConf.params = this.dataForm;
            this.$refs.table.requestTableData();
        },
        addPage() {
            /* this.personEditPageShow = true
        this.$nextTick(() => {
          this.$refs.personEdit.init()
        }) */
            this.dialogFromPageShow = true;
            this.$nextTick(() => {
                this.$refs.dialogFromPage.init();
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
