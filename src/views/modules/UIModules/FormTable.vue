<template>
    <div>
        <el-row v-if="conf.formData !== undefined">
            <dynamic-form v-model="dataForm" :form-config="dynamicFormData">
                <el-form-item>
                    <el-button type="primary" @click="queryTable()">查询</el-button>
                    <el-button
                        v-if="formButtons"
                        v-for="(button_conf, index) in formButtons"
                        :key="index"
                        :style="button_conf.style"
                        :size="button_conf.size || 'small'"
                        :type="button_conf.type || 'primary'"
                        @click="button_event({button_conf, index})"
                        >{{ button_conf.text || '' }}</el-button
                    >
                </el-form-item>
            </dynamic-form>
        </el-row>
        <el-row>
            <el-table :data="tableData" border>
                <el-table-column align="center" v-for="(col, index) in filterConf.colConf" :key="index" :prop="col.prop" :label="col.lab" :width="col.width || null">
                    <template slot-scope="scope">
                        <el-row>
                            <el-row v-if="col.type == 'index'"> {{ (pageInfo.pageNum - 1) * pageInfo.pageSize + scope.$index + 1 }} </el-row>
                            <el-row v-else-if="col.type == 'button'">
                                <el-button
                                    v-for="(button_conf, index) in col.sub_conf"
                                    :key="index"
                                    :style="button_conf.style"
                                    :size="button_conf.size || 'small'"
                                    :type="button_conf.type || 'primary'"
                                    @click="button_event({button_conf, scope, index})"
                                    >{{ button_conf.text || '' }}</el-button
                                >
                            </el-row>
                            <el-row v-else-if="col.type == 'img'">
                                <el-popover v-if="scope.row[col.prop] != ''" :placement="col.sub_conf.direction || 'right'" :trigger="col.sub_conf.trigger || 'click'">
                                    <img :src="scope.row[col.prop]" :style="col.sub_conf.scaleStyle || {maxWidth: '720px', maxHeight: '600px'}" />
                                    <img slot="reference" :src="scope.row[col.prop]" :style="col.sub_conf.style || {maxWidth: '130px', maxHeight: '50px'}" />
                                </el-popover>
                            </el-row>
                            <el-row v-else-if="col.type == 'switch'">
                                <el-switch
                                    @change="trigger_event({col, scope})"
                                    v-model="scope.row[col.prop]"
                                    :width="col.sub_conf.width || 35"
                                    :active-text="col.sub_conf.activeText || '启用'"
                                    :active-value="col.sub_conf.activeValue || 1"
                                    :inactive-text="col.sub_conf.inactiveText || '禁用'"
                                    :inactive-value="col.sub_conf.inactiveValue || 2"
                                >
                                </el-switch>
                            </el-row>
                            <el-row v-else-if="col.type == 'timestamp'"> {{ formatDate(new Date(scope.row[scope.column.property]), col.format || 'yyyy-MM-dd HH:mm:ss') }} </el-row>
                            <el-row v-else>
                                <div v-if="col.filter">{{ col.filter(scope.row[scope.column.property]) }}</div>
                                <div v-else>{{ scope.row[scope.column.property] }}</div>
                            </el-row>
                        </el-row>
                    </template>
                </el-table-column>
            </el-table>
            <div class="block">
                <el-pagination
                    v-if="!filterConf.hide_split_page"
                    @size-change="sizeChange"
                    @current-change="numChange"
                    :current-page="pageInfo.pageNum"
                    :page-sizes="[10, 20, 30, 40, 50, 100]"
                    :page-size="pageInfo.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="pageInfo.total"
                >
                </el-pagination>
                <span class="demonstration" v-if="filterConf.pageName">{{ filterConf.pageName }}</span>
            </div>
        </el-row>
    </div>
</template>

<script>
import Vue from 'vue';
export default {
    props: ['conf'],
    computed: {
        dynamicFormData() {
            let fromData = {
                inline: true,
                labelPosition: 'right',
                labelWidth: '80px',
                size: 'mini',
                statusIcon: true,
                layout: false,
                formItemList: [],
            };
            fromData.formItemList = this.conf.formData.forms;
            return fromData;
        },
        formButtons() {
            return this.conf.formData.buttons;
        },
        filterConf() {
            this.tableData = this.conf.tableConf.data;
            return this.conf.tableConf;
        },
    },
    data() {
        return {
            dataForm: {},
            tableData: [],
            swich_val: false,
            first: false,
            pageInfo: {
                pageNum: 1,
                pageSize: 10,
                total: 100,
            },
        };
    },
    methods: {
        handleInput(val, key) {
            // 这里element-ui没有上报event，直接就是value了
            this.$emit('input', {...this.value, [key]: val});
        },
        formQuery() {
            console.info(this.dataForm);
        },
        sizeChange(val) {
            this.pageInfo.pageSize = val;
            this.requestTableData();
        },
        numChange(val) {
            this.pageInfo.pageNum = val;
            this.requestTableData();
        },
        trigger_event(opt) {
            if (opt.col.sub_conf.event) {
                opt['vm'] = this;
                opt.col.sub_conf.event(opt);
            } else if (opt.col.sub_conf.event_name) {
                this.$store.dispatch('sendEvent', {
                    event_name: opt.col.sub_conf.event_name,
                    extra: opt,
                });
            } else {
                console.warn('未设置按钮点击事件');
            }
        },
        button_event(opt) {
            if (opt.button_conf.event) {
                opt['vm'] = this;
                opt.button_conf.event(opt);
            } else if (opt.button_conf.event_name) {
                this.$store.dispatch('sendEvent', {
                    event_name: opt.button_conf.event_name,
                    extra: opt,
                });
            } else {
                console.warn('未设置按钮点击事件');
            }
        },
        requestTableData() {
            // if (!this.URL) return false;
            let that = this;
            let obj = Object.assign(
                {
                    pageNum: this.pageInfo.pageNum,
                    pageSize: this.pageInfo.pageSize,
                },
                this.filterConf.params
            );
            for (let key in obj) {
                if (!obj[key]) {
                    obj[key] = null;
                }
            }
            let url = this.conf.url;
            if (!this.conf.url && !this.URL) return false;
            this.$http({
                url,
                method: 'get',
                params: this.$http.adornParams(obj),
            }).then(data => {
                data = data.data;
                console.info(data);
                if (data && data.code === 200) {
                    that.tableData = data.data.list;
                    this.pageInfo.total = data.data.total;
                } else {
                    this.dataList = [];
                    this.totalPage = 0;
                }
            });
        },
        refresh() {
            this.pageInfo.pageNum = 1;
            this.requestTableData();
            console.log('request data');
        },
        queryTable() {
            this.filterConf.params = this.dataForm;
            this.pageInfo.pageNum = 1;
            this.requestTableData();
        },
        formatDate(date, fmt) {
            if (/(y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
            }
            let o = {
                'M+': date.getMonth() + 1,
                'd+': date.getDate(),
                'H+': date.getHours(),
                'h+': date.getHours() % 12,
                'm+': date.getMinutes(),
                's+': date.getSeconds(),
            };
            for (let k in o) {
                if (new RegExp(`(${k})`).test(fmt)) {
                    let str = o[k] + '';
                    fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : this.padLeftZero(str));
                }
            }
            return fmt;
        },
        padLeftZero(str) {
            return ('00' + str).substr(str.length);
        },
    },
    mounted() {},
};
</script>

<style scoped>
.demonstration {
    float: right;
    margin-top: 18px;
    height: 28px;
    line-height: 28px;
    font-weight: bold;
}
.el-pagination {
    float: right;
}
</style>
