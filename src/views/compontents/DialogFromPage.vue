<template>
    <el-dialog :title="pageTitle" :visible.sync="dialogVisible">
        <dynamic-form v-model="dynamicData" :form-config="formItems"> </dynamic-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submmit()">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    props: {
        formConfig: {
            type: Object,
            required: true,
        },
    },
    computed: {
        formItems() {
            let fromData = {
                inline: false,
                labelPosition: 'right',
                labelWidth: '80px',
                size: 'mini',
                statusIcon: true,
                layout: true,
                formItemList: [],
            };
            fromData.formItemList = this.formConfig.formItems;
            return fromData;
        },
    },
    created() {
        if (this.formConfig.formItems === undefined) {
            throw new Error(' formConfig must has formItems field');
        }
    },
    data() {
        return {
            dynamicData: {},
            pageTitle: '新增',
            dialogVisible: false,
        };
    },
    methods: {
        init: function() {
            if (this.formConfig.pageTitle !== undefined) {
                this.pageTitle = this.formConfig.pageTitle;
            }
            for (let index in this.formConfig.formItems) {
                if (this.formConfig.formItems[index].value !== undefined) {
                    this.dynamicData[this.formConfig.formItems[index].name] = this.formConfig.formItems[index].value;
                }
            }
            this.dialogVisible = true;
        },
        submmit: function() {
            let that = this;
            this.$http({
                url: this.formConfig.url,
                method: this.formConfig.httpMothod,
                data: this.$http.adornData(this.dynamicData),
            }).then(data => {
                if (data && data.data.code === 201) {
                    that.$emit('callbackFn', {});
                    that.dialogVisible = false;
                }
            });
        },
    },
};
</script>

<style scoped></style>
