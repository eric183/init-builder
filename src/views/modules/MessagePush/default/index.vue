<template>
    <el-row>
        <el-row class="mt10 mb10">
            <el-radio-group v-model="tableConf.params.type" @change="radio_change">
                <el-radio v-for="(item, index) in radio_list" :key="index" :label="item.value">{{ item.text }}</el-radio>
            </el-radio-group>
            <el-button class="button_add" type="success" size="mini" @click="addMessage">新增</el-button>
        </el-row>
        <conf-table ref="table" :tableConf="tableConf" :URL="'/v1/note/messages'"></conf-table>
        <message-phone v-if="messageVisable" ref="message"></message-phone>
    </el-row>
</template>
<script>
import confTable from '@/views/compontents/Table';
import messagePhone from './MessagePhone';
import {commonFunc} from '@/utils/resources/index.js';
export default {
    components: {
        confTable,
        messagePhone,
    },
    data() {
        return {
            messageVisable: false,
            radio_list: [
                {
                    text: '电商消息',
                    value: 2,
                },
                {
                    text: '系统消息',
                    value: 1,
                },
                {
                    text: '活动消息',
                    value: 3,
                },
            ],
            tableConf: {
                params: {
                    type: 2,
                },
                conf_col: [
                    {
                        type: 'index',
                        name: '序号',
                        width: 50,
                    },
                    {
                        name: '消息内容',
                        minWidth: 300,
                        algin: 'left',
                        prop: 'content',
                        addImg: 'imageUrl', //字段组合
                        addInfoUrl: 'infoUrl', //字段组合
                        type: 'messageContent',
                    },
                    {
                        name: '推送方式',
                        prop: 'type',
                        filter: val => {
                            var text = '';
                            switch (val) {
                                case 1:
                                    text = '系统';
                                    break;
                                case 2:
                                    text = '电商';
                                    break;
                                case 3:
                                    text = '活动';
                                    break;
                            }
                            return text;
                        },
                    },
                    {
                        name: '推送类型',
                        prop: 'pushType',
                        type: 'click',
                        filter: val => {
                            var text = '';
                            switch (val) {
                                case 1:
                                    text = '所有用户';
                                    break;
                                case 2:
                                    text = '手机号推送';
                                    break;
                            }
                            return text;
                        },
                        event: data => {
                            this.messageVisable = true;
                            this.$nextTick(() => {
                                this.$refs.message.init(data.scope.row.messageId);
                            });
                        },
                    },
                    {
                        name: '操作账号',
                        prop: 'operator',
                    },
                    {
                        name: '推送时间',
                        prop: 'pushTime',
                        filter: val => {
                            return commonFunc(val);
                        },
                    },
                ],
            },
        };
    },
    methods: {
        radio_change() {
            this.$refs.table.refresh();
        },
        addMessage() {
            this.$router.push({name: 'adv-message', query: {type: this.tableConf.params.type}});
        },
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.$refs.table.refresh();
        });
    },
};
</script>
<style lang="scss" scoped>
.button_add {
    float: right;
}
</style>
