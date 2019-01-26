<template>
    <el-dialog :title="'详情'" :close-on-click-modal="false" :visible.sync="visible">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span class="mr30">到访时间：{{ createdAt(dataForm.arriveTime) }}</span> <span v-if="dataForm.source == 3">登记时间：{{ createdAt(dataForm.createdAt) }}</span>
            </div>
            <div class="text item"><label>姓名:</label>{{ dataForm.name }}</div>
            <div class="text item"><label>手机号码:</label>{{ dataForm.phone }}</div>
            <div class="text item"><label>性别:</label>{{ gender(dataForm.gender) }}</div>
            <div class="text item"><label>身份证号:</label>{{ dataForm.idCard }}</div>
            <div class="text item"><label>到访公司:</label>{{ dataForm.companyName }}</div>
            <div class="text item"><label>到访楼层:</label>{{ dataForm.floorName }}</div>
            <div class="text item"><label>到访事由:</label>{{ dataForm.reason }}</div>
        </el-card>
        <span slot="footer" class="dialog-footer"> <el-button size="small" type="primary" @click="visible = false">确定</el-button> </span>
    </el-dialog>
</template>

<script>
import {commonFunc} from '@/utils/resources/index.js';
export default {
    data() {
        return {
            dataForm: {},
            visible: false,
        };
    },
    methods: {
        init(obj) {
            this.visible = true;
            this.dataForm = obj;
        },
        // 性别转换
        gender(item) {
            switch (item) {
                case 1:
                    return '男';
                    break;
                case 2:
                    return '女';
                    break;
            }
        },
        createdAt(item) {
            return commonFunc(item);
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
