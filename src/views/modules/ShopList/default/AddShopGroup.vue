<template>
    <el-dialog title="商品分组展示" :close-on-click-modal="false" :visible.sync="visible">
        <el-row>
            <span>关联商品到专题页</span>
            <el-select v-model="subjectId" filterable size="mini">
                <el-option v-for="item in subjectList" :key="item.subjectId" :label="item.subjectName" :value="item.subjectId"></el-option>
            </el-select>
            <el-button :disabled="subjectId == ''" type="primary" size="mini" @click="connect()">添加</el-button>
        </el-row>
    </el-dialog>
</template>
<script>
export default {
    data() {
        return {
            visible: false,
            subjectId: '',
            subjectList: [],
            skus: '',
        };
    },
    methods: {
        init(param) {
            this.skus = param.join(',');
            this.visible = true;
            this.$nextTick(() => {
                this.subjectId = '';
                this.$http({
                    url: this.$http.adornUrl5('/v1/ops/subjects'),
                    method: 'get',
                }).then(({data}) => {
                    if (data && data.code === 200) {
                        this.subjectList = data.data.list;
                    }
                });
            });
        },
        connect() {
            this.$http({
                url: this.$http.adornUrl5('/v1/ops/subjects/' + this.subjectId + '/goods'),
                method: 'post',
                data: this.$http.adornData({
                    skus: this.skus,
                }),
            }).then(({data}) => {
                if (data && data.code === 201) {
                    this.visible = false;
                    this.$message.success('操作成功');
                    this.$emit('refreshDataList');
                }
            });
        },
    },
};
</script>
