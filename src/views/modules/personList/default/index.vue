<template>
    <el-row>
        <FormTable ref="table" :conf="tablePageData"></FormTable>
        <personAdd v-if="personAdd" ref="personAdd"></personAdd> <personDele v-if="personDele" ref="personDele"></personDele> <personEdit v-if="personEditPageShow" ref="personEdit"></personEdit>
        <DialogFromPage v-if="dialogFromPageShow" :form-config="addFormConfig" ref="dialogFromPage"></DialogFromPage>
    </el-row>
</template>

<script>
import ZZTable from '@/views/compontents/Table';
import FormTable from '@/views/compontents/FormTable';
import DialogFromPage from '@/views/compontents/DialogFromPage';
import personAdd from './person-add-device';
import personDele from './person-dele-device';
import personEdit from './personEdit';
import {faceurlMkdir} from '@/utils/resources/index.js';
export default {
    components: {
        ZZTable,
        FormTable,
        personDele,
        personAdd,
        personEdit,
        DialogFromPage,
    },

    data() {
        return {
            personEditPageShow: false,
            dialogFromPageShow: false,
            personDele: false,
            personAdd: false,
            addFormConfig: {
                url: this.$http.adornUrl4('/v1/face/users'),
                httpMothod: 'POST',
                formItems: [
                    {
                        type: 'input',
                        name: 'name',
                        label: '姓名',
                        placeholder: '请输入姓名',
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
                        type: 'radio',
                        name: 'gender',
                        label: '性别',
                        value: 1,
                        placeholder: '性别',
                        options: [{label: '男', value: 1}, {label: '女', value: 2}],
                    },
                    {
                        type: 'radio',
                        name: 'status',
                        label: '性别',
                        value: 1,
                        placeholder: '性别',
                        options: [{label: '启用', value: 1}, {label: '禁用', value: 2}],
                    },
                    {
                        type: 'aliossone',
                        name: 'faceUser',
                        label: '人脸图片',
                        imagePath: faceurlMkdir,
                        httpPath: this.$http.adornUrl4('/v1/oss/tokens'),
                    },
                ],
            },
            tablePageData: {
                url: this.$http.adornUrl4('/v1/face/users'),
                formData: {
                    forms: [
                        {
                            type: 'input',
                            span: 24,
                            label: '姓名',
                            placeholder: '请输入姓名',
                            name: 'name',
                        },
                        {
                            type: 'input',
                            span: 24,
                            label: '电话',
                            placeholder: '请输入电话',
                            name: 'phone',
                        },
                        {
                            type: 'select',
                            span: 24,
                            label: '性别',
                            name: 'gender',
                            options: [{label: '全部', value: null}, {label: '男', value: 1}, {label: '女', value: 2}],
                        },
                        {
                            type: 'select',
                            span: 2,
                            label: '是否启用',
                            name: 'status',
                            options: [{label: '全部', value: null}, {label: '启用', value: 1}, {label: '禁用', value: 2}],
                        },
                    ],
                    buttons: [
                        {
                            size: 'mini',
                            text: '新增',
                            type: 'success',
                            event: data => {
                                /*this.dialogFromPageShow = true
                  this.$nextTick(() => {
                    this.$refs.dialogFromPage.init()
                  })*/
                                this.personEditPageShow = true;
                                this.$nextTick(() => {
                                    this.personEditPageShow = true;
                                    this.$refs.personEdit.init();
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
                            prop: 'username',
                            lab: '姓名',
                        },
                        {
                            prop: 'phone',
                            lab: '手机号',
                        },
                        {
                            prop: 'idCard',
                            lab: '身份证号码',
                        },
                        {
                            prop: 'faceUser',
                            lab: '用户头像',
                            type: 'img',
                            sub_conf: {},
                        },
                        {
                            prop: 'gender',
                            lab: '性别',
                            filter: val => {
                                let sex = '默认';
                                switch (val) {
                                    case 1:
                                        sex = '男';
                                        break;
                                    case 2:
                                        sex = '女';
                                        break;
                                }
                                return sex;
                            },
                        },
                        {
                            prop: 'companyName',
                            lab: '企业名称',
                        },
                        {
                            prop: 'floorName',
                            lab: '楼层名称',
                        },
                        {
                            prop: 'actualFloorNo',
                            lab: '实际楼层',
                        },
                        {
                            prop: 'status',
                            lab: '是否启用',
                            type: 'switch',
                            sub_conf: {
                                width: 35,
                                activeText: '启用',
                                activeValue: 1,
                                inactiveText: '禁用',
                                inactiveValue: 2,
                                event: data => {
                                    // 是否启用--修改用户信息接口
                                    this.$http({
                                        url: this.$http.adornUrl4('/v1/face/users'),
                                        method: 'put',
                                        data: this.$http.adornData({
                                            userId: data.scope.row.userId,
                                            status: data.scope.row.status,
                                        }),
                                    }).then(({data}) => {
                                        if (data && data.code === 201) {
                                            this.$message({
                                                message: '操作成功',
                                                type: 'success',
                                                duration: 1500,
                                            });
                                            this.$refs.table.refresh();
                                        }
                                    });
                                },
                            },
                        },
                        {
                            type: 'button',
                            lab: '设备操作',
                            width: 200,
                            sub_conf: [
                                {
                                    size: 'mini',
                                    text: '添加设备',
                                    type: 'success',
                                    event: data => {
                                        this.personAdd = true;
                                        this.$nextTick(() => {
                                            this.$refs.personAdd.init(data.scope.row.userId);
                                        });
                                    },
                                },
                                {
                                    size: 'mini',
                                    text: '解绑设备',
                                    event: data => {
                                        this.personDele = true;
                                        this.$nextTick(() => {
                                            this.$refs.personDele.init(data.scope.row.userId);
                                        });
                                    },
                                },
                            ],
                        },
                        {
                            type: 'button',
                            lab: '操作',
                            width: 200,
                            sub_conf: [
                                {
                                    size: 'mini',
                                    text: '修改',
                                    event: data => {
                                        this.personEditPageShow = true;
                                        this.$nextTick(() => {
                                            this.$refs.personEdit.selectById(data.scope.row.userId);
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
                                                url: this.$http.adornUrl4('/v1/face/users/' + data.scope.row.userId),
                                                method: 'DELETE',
                                            }).then(data => {
                                                that.$refs.table.requestTableData();
                                            });
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
