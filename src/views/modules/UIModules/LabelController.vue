<template>
    <el-row style="position: relative;">
        <el-col :span="6" class="label_left" style="max-width: 70px; text-align: right;margin-right: 16px;">过渡动画</el-col>
        <el-col :span="18"> <el-input placeholder="请输入内容" v-model="inputConf.val" clearable> </el-input> </el-col>
    </el-row>
</template>

<script>
export default {
    props: ['conf'],
    data() {
        return {};
    },
    computed: {
        filterConf() {
            return (this.conf && this.conf.filter ? this.conf.filter(this.conf) : this.conf) || new Object();
        },
        inputConf() {
            return this.filterConf.input || {};
        },
    },
};
</script>

<style>
.label_left {
    line-height: 40px;
    font-size: 14px;
    color: #333333;
}
</style>
