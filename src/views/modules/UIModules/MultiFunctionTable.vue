<template>
    <el-row>
        <FormTable ref="formTable" :conf="tablePageData"></FormTable>
        <DialogFromPage v-if="dialogFormPageShow" :form-config="editFormConfig" ref="editFormPage" v-on:callbackFn="refresh"></DialogFromPage>
    </el-row>
</template>

<script>
import FormTable from '@/views/modules/UIModules/FormTable';
import DialogFromPage from '@/views/modules/UIModules/DialogFromPage';

export default {
    props: ['config'],
    components: {DialogFromPage, FormTable},
    computed: {
        editFormConfig: {
            get() {
                return this.initEditFormConfig();
            },
            set(value) {

            }
        },
        tablePageData() {
            let tablePageConf = {
                url: '',
                formData: {
                    forms: [],
                    buttons: [],
                },
                tableConf: {
                    params: {},
                    colConf: [],
                    pageName: '',
                },
            };
            if (this.config.listUrl === undefined) {
                tablePageConf.url = this.config.allUrl;
            } else {
                tablePageConf.url = this.config.listUrl;
            }
            tablePageConf.formData.forms = this.config.selectFormData.forms;
            if (this.config.add !== undefined) {
                tablePageConf.formData.buttons = [
                    {
                        size: 'mini',
                        text: '新增',
                        type: 'success',
                        event: () => {
                            this.add();
                        },
                    },
                ];
            }
            for (let index in this.config.selectFormData.buttons) {
                tablePageConf.formData.buttons.push(this.config.selectFormData.buttons[index]);
            }
            tablePageConf.tableConf.params = this.config.tableConf.params;
            tablePageConf.tableConf.colConf = this.config.tableConf.colConf;
            tablePageConf.tableConf.pageName = this.config.tableConf.pageName;
            let buttons = {
                type: 'button',
                lab: '操作',
                width: 200,
                sub_conf: [],
            };
            if (this.config.update !== undefined) {
                buttons.sub_conf.push({
                    size: 'mini',
                    text: '修改',
                    event: data => {
                        let that = this;
                        let url = that.config.update.getUrl;
                        url = url.replace('KEY', data.scope.row[this.config.keyName]);
                        this.$http({
                            url: url,
                            method: 'GET',
                        }).then(sData => {
                            for (let index in that.editFormConfig.formItems) {
                                if (sData.data.data[that.editFormConfig.formItems[index].name] !== undefined) {
                                    that.editFormConfig.formItems[index].value = sData.data.data[that.editFormConfig.formItems[index].name];
                                } else {
                                    that.editFormConfig.formItems[index].value = null;
                                }
                            }
                            if (that.config.update === undefined) {
                                that.editFormConfig.httpMothod = 'PUT';
                                that.editFormConfig.url = that.config.allUrl;
                            } else {
                                that.editFormConfig.httpMothod = that.config.update.method;
                                that.editFormConfig.url = that.config.update.url;
                            }

                            this.dialogFormPageShow = true;
                            this.$nextTick(() => {
                                this.$refs.editFormPage.init();
                            });
                        });
                    },
                });
            }
            if (this.config.deleteOne !== undefined) {
                buttons.sub_conf.push({
                    size: 'mini',
                    text: '删除',
                    type: 'danger',
                    event: data => {
                        let that = this;
                        let url = that.config.deleteOne.url;
                        url = url.replace('KEY', data.scope.row[this.config.keyName]);
                        let method;
                        if (that.config.deleteOne === undefined) {
                            method = 'DELETE';
                        } else {
                            method = that.config.deleteOne.method;
                        }
                        this.$confirm('确定删除？').then(() => {
                            this.$http({
                                url: url,
                                method: method,
                            }).then(data => {
                                that.$refs.formTable.requestTableData();
                            });
                        });
                    },
                });
            }

            if (this.config.update !== undefined || this.config.deleteOne !== undefined) {
                tablePageConf.tableConf.colConf.push(buttons);
            }

            return tablePageConf;
        },
    },
    data() {
        return {
            dialogFormPageShow: false,
        };
    },
    created() {
        this.$nextTick(() => {
            this.$refs.formTable.queryTable();
        });
    },
    methods: {
        init() {},
        initEditFormConfig(edit) {
            let editForm = {
                url: '',
                httpMothod: 'POST',
                formItems: [],
            };
            if (this.config.add === undefined) {
                editForm.url = this.config.allUrl;
            } else {
                editForm.url = this.config.add.url;
            }
            if (this.config.add === undefined) {
                editForm.httpMothod = 'POST';
            } else {
                editForm.httpMothod = this.config.add.method;
            }
            editForm.formItems = [];
            if (edit === 2 || edit === undefined) {
                for (let index in this.config.formItems) {
                    if (this.config.formItems[index].update === undefined || this.config.formItems[index].update === false) {
                        editForm.formItems.push(this.config.formItems[index]);
                    }
                }
            } else {
                for (let index in this.config.formItems) {
                    if (this.config.formItems[index].add === undefined || this.config.formItems[index].add === false) {
                        editForm.formItems.push(this.config.formItems[index]);
                    }
                }
            }
            return editForm;
        },
        add() {
            this.editFormConfig = this.initEditFormConfig();
            for (let index in this.editFormConfig.formItems) {
                this.editFormConfig.httpMothod = 'POST';
                if (this.editFormConfig.formItems[index].defaultValue !== undefined) {
                    this.editFormConfig.formItems[index].value = this.editFormConfig.formItems[index].defaultValue;
                } else {
                    this.editFormConfig.formItems[index].value = null;
                }
            }
            this.dialogFormPageShow = true;
            this.$nextTick(() => {
                this.$refs.editFormPage.init();
            });
        },
        refresh() {
            this.$nextTick(() => {
                this.$refs.formTable.requestTableData();
            });
        },
    },
};
</script>

<style scoped></style>
