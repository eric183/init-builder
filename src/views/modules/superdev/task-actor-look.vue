<template>
    <el-dialog title="协作者" :close-on-click-modal="false" :visible.sync="visible">
        <ul>
            <li v-for="(item, index) in userList" :key="index">
                <span>{{ item.assistantDept }}：</span> <span class="ml10">{{ item.assistantName }}</span>
            </li>
        </ul>
        <span slot="footer" class="dialog-footer"> <el-button size="small" type="primary" @click="visible = false">确定</el-button> </span>
    </el-dialog>
</template>

<script>
export default {
    data() {
        return {
            visible: false,
            taskId: null,
            userList: [], //协作者数据列表
        };
    },
    methods: {
        init(id) {
            this.visible = true;
            this.taskId = id;
            this.$nextTick(() => {
                this.getDataList();
            });
        },
        // 查询协作者数据列表
        getDataList(id) {
            this.$http({
                url: this.$http.adornUrl('/v1/pm/check/tasks/' + this.taskId + '/assistants'),
                method: 'get',
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.userList = data.data.assistants;
                } else {
                    this.userList = [];
                }
            });
        },
    },
};
</script>
<style lang="scss" scoped>
ul {
    li {
        span:nth-child(1) {
            display: inline-block;
            width: 100px;
        }
    }
}
</style>
