<template>
    <el-row>
        <el-table :data="filterConf.data" border>
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
                            <el-button
                                v-if="(col.isShowButton == 1 || 0) && scope.row.status == 1"
                                v-for="(button_conf, index) in col.button_conf"
                                :key="index"
                                :style="button_conf.style"
                                :size="button_conf.size || 'small'"
                                :type="button_conf.type || 'primary'"
                                @click="button_event({button_conf, scope, index})"
                                ><span>{{ button_conf.text || '' }}</span></el-button
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
                        <el-row v-else>
                            <div v-if="col.filter">{{ col.filter(scope.row[scope.column.property]) }}</div>
                            <div v-else>{{ scope.row[scope.column.property] }}</div>
                        </el-row>
                    </el-row>
                </template>
            </el-table-column>
        </el-table>
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
    </el-row>
</template>

<script>
import Vue from 'vue';
export default {
    props: ['conf', 'URL', 'OtherUrl'],
    data() {
        return {
            swich_val: false,
            first: false,
            pageInfo: {
                pageNum: 1,
                pageSize: 10,
                total: 100,
            },
        };
    },
    computed: {
        filterConf() {
            return this.conf;
        },
    },
    methods: {
        sizeChange(val) {
            this.pageInfo.pageSize = val;
            if (this.filterConf.isExcel == true) {
                this.$emit('pageInfo', this.pageInfo);
            }
            this.requestTableData();
        },
        numChange(val) {
            this.pageInfo.pageNum = val;
            if (this.filterConf.isExcel == true) {
                this.$emit('pageInfo', this.pageInfo);
            }
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
            let url = (this.OtherUrl && this.$http.adornUrl4(this.OtherUrl)) || this.$http.adornUrl(this.URL);
            if (!this.OtherUrl && !this.URL) return false;
            this.$http({
                url,
                method: 'get',
                params: this.$http.adornParams(obj),
            }).then(data => {
                data = data.data;
                if (data && data.code === 200) {
                    this.$set(this.filterConf, 'data', data.data.list);
                    this.pageInfo.total = data.data.total;
                    if (this.filterConf.isExcel == true) {
                        this.$emit('pageInfo', this.pageInfo);
                    }
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
    },
    mounted() {},
};
</script>

<style></style>
