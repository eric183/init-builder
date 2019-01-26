<template>
    <el-dialog title="推送号码" :visible.sync="phoneVisable">
        <el-card class="box-card">
            <div v-for="(item, index) in phoneList" :key="index" class="text item">{{ item }}</div>
        </el-card>
        <el-row class="total-num">
            <span>共 {{ total }} 条</span>
        </el-row>
    </el-dialog>
</template>
<script>
export default {
    data() {
        return {
            phoneVisable: false,
            total: 0,
            phoneList: [],
        };
    },
    methods: {
        init(id) {
            (this.phoneVisable = true),
                this.$nextTick(() => {
                    this.$http({
                        url: this.$http.adornUrl('/v1/note/messages/' + id + '/phones'),
                        method: 'get',
                        params: this.$http.adornParams(),
                    }).then(({data}) => {
                        if (data && data.code === 200) {
                            this.phoneList = data.data.phones;
                            this.total = data.data.phones.length;
                        }
                    });
                });
        },
    },
};
</script>
<style lang="scss" scoped>
.total-num {
    padding: 5px;
}
</style>
