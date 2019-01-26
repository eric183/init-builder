<template>
    <el-dialog :title="'详情'" :close-on-click-modal="false" :visible.sync="visible">
        <el-card class="box-card">
            <div class="text item"><label>收费名称:</label>{{ dataForm.name }}</div>
            <div class="text item"><label>标识:</label>{{ dataForm.mark }}</div>
            <div class="text item"><label>收费类型:</label>{{ chargeType(dataForm) }}</div>
            <div class="text item"><label>标准单价:</label>{{ dataForm.price / 100 }}</div>
            <div class="text item"><label>计量方式:</label>{{ chargeMode(dataForm) }}</div>
            <div class="text item lastdiv"><label>备注:</label>{{ dataForm.remark }}</div>
        </el-card>
        <span slot="footer" class="dialog-footer"> <el-button size="small" type="primary" @click="visible = false">确定</el-button> </span>
    </el-dialog>
</template>

<script>
import commonFunc from '@/assets/common.js';
export default {
    data() {
        return {
            dataForm: {
                name: '',
                mark: '',
                chargeType: '',
                chargeMode: '',
                price: '',
                remark: '',
            },
            visible: false,
        };
    },
    methods: {
        init(id) {
            this.visible = true;
            this.$http({
                url: this.$http.adornUrl(`/v1/pm/charge/rules/${id}`),
                method: 'get',
            }).then(({data}) => {
                if (data && data.code === 200) {
                    (this.dataForm.name = data.data.name),
                        (this.dataForm.mark = data.data.mark),
                        (this.dataForm.chargeType = data.data.chargeType),
                        (this.dataForm.chargeMode = data.data.chargeMode),
                        (this.dataForm.price = data.data.price),
                        (this.dataForm.remark = data.data.remark);
                }
            });
        },
        chargeMode(item) {
            switch (item.chargeMode) {
                case 1:
                    return '出租面积';
                    break;
                case 2:
                    return '使用量';
                    break;
            }
        },
        chargeType(item) {
            switch (item.chargeType) {
                case 1:
                    return '周期性固定收费';
                    break;
                case 2:
                    return '抄表类型标准收费';
                    break;
                case 3:
                    return '抄表类分时段收费';
                    break;
            }
        },
    },
};
</script>
<style lang="scss" scoped>
.box-card {
    div {
        padding: 10px 0;
        border-bottom: 1px solid #ebeef5;
        label {
            display: inline-block;
            width: 80px;
        }
    }
    .lastdiv {
        border-bottom: none;
    }
}

</style>
