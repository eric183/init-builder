<template>
    <el-dialog :title="translate_type[_type].title" :visible.sync="dialogVisible">
        <el-form :model="formData">
            <el-form-item :label="translate_type[_type].sub_title" style="margin-bottom: 0;"> <ExcutorSelect ref="select" :formData="formData"></ExcutorSelect> </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close" size="small">取 消</el-button>
            <el-button type="primary" @click="confirm" size="small">提 交</el-button>
        </div>
    </el-dialog>
</template>

<script>
import ExcutorSelect from '@/views/modules/UIModules/ExcutorSelect';
export default {
    props: ['type'],
    components: {
        ExcutorSelect,
    },
    data() {
        return {
            translate_type: {
                default: {
                    title: '添加协作者',
                    sub_title: '协作者',
                    place_1: '请选择协作部门',
                    place_2: '请选择协作者',
                    event_name: () => {
                        return this.$route.name + '_teamworker';
                    },
                },
                translate: {
                    title: '',
                    sub_title: '执行人',
                    place_1: '请选择部门',
                    place_2: '请选择执行人',
                    event_name: () => {
                        return this.$route.name + '_translate';
                    },
                },
            },
            dialogVisible: false,
            formData: {
                executor: '',
                departmentName: [],
                realName: '',
                selectedOptions: [],
            },
        };
    },
    computed: {
        _type() {
            return this.type || 'default';
        },
    },
    methods: {
        filter(val) {},
        show() {
            this.dialogVisible = true;
        },
        close() {
            this.$refs.select.clearLabelText();
            this.dialogVisible = false;
        },
        confirm() {
            this.close();
            let event_name = this.translate_type[this._type].event_name();
            this.$store.dispatch('sendEvent', {
                event_name,
                extra: this.formData,
            });
        },
    },
    mounted() {},
};
</script>

<style></style>
