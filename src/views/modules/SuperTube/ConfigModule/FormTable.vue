<template>
    <el-row>
        <el-form :inline="true" :model="formData" size="small">
            <el-form-item v-for="(item, index) in formConf" :key="index" :label="item.labe">
                <el-row v-if="item.type == 'input'"> <el-input v-model="formData[item.prop]" :placeholder="item.labe" clearable></el-input> </el-row>
                <el-row v-else-if="item.type == 'date'">
                    <el-date-picker v-model="formData[item.prop]" type="daterange" value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
                </el-row>
                <el-row v-else-if="item.type == 'button'">
                    <el-button v-for="(conf, i) in item.button_cof" :key="i" :size="conf.size" :type="conf.color" @click="button_event({conf, i})">{{ conf.text }}</el-button>
                </el-row>
            </el-form-item>
        </el-form>
    </el-row>
</template>
<script>
export default {
    props: {
        formConf: {
            type: Array,
        },
    },
    data() {
        return {
            formData: {},
        };
    },
    methods: {
        button_event(opt) {
            if (opt.conf.event) {
                opt['vm'] = this;
                opt.conf.event(this.formData);
            } else {
                console.warn('未设置按钮点击事件');
            }
        },
    },
};
</script>
