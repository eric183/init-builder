<template>
    <el-row>
        <el-table :data="dataList.data" border style="width:100%">
            <el-table-column
                v-for="(item, index) in dataList.conf_col"
                :key="index"
                :prop="item.prop || null"
                :label="item.name"
                :width="item.width || null"
                :min-width="item.minWidth || null"
                header-align="center"
                :align="item.algin || 'center'"
            >
                <template slot-scope="scope">
                    <el-row v-if="item.type === 'button'">
                        <el-button v-for="(obj, i) in item.tab_conf" :key="i" :size="obj.size" :type="obj.type" @click="button_event({obj, scope, i})"> {{ obj.text }} </el-button>
                    </el-row>
                    <el-row v-else-if="item.type === 'imge'">
                        <el-popover placement="right" trigger="click">
                            <img :src="scope.row[scope.column.property]" style="max-width:720px;max-height:600px;" />
                            <img slot="reference" :src="scope.row[scope.column.property]" style="width:50px;height:50px;" />
                        </el-popover>
                    </el-row>
                    <el-row v-else-if="item.type === 'formate'"> {{ scope.row[scope.column.property] + scope.row[item.addProp] }} </el-row>
                    <el-row v-else-if="item.type === 'messageContent'">
                        {{ scope.row[scope.column.addInfoUrl] }}
                        <el-popover v-if="scope.row[item.addImg]" placement="right" trigger="click">
                            <img :src="scope.row[item.addImg]" style="max-width:720px;max-height:600px;" />
                            <img slot="reference" :src="scope.row[item.addImg]" style="width:50px;height:50px;vertical-align:middle" />
                        </el-popover>
                        <span>{{ scope.row[scope.column.property] }}</span> <span style="color:#3E8EF7">{{ scope.row[item.addInfoUrl] }}</span>
                        <!-- <a :href="scope.row[item.addInfoUrl]">{{scope.row[item.addInfoUrl]}}</a> -->
                    </el-row>
                    <el-row v-else-if="item.type === 'click'">
                        {{ item.filter(scope.row[scope.column.property]) }}
                        <span v-if="scope.row[scope.column.property] == 2" style="color:#3E8EF7;cursor: pointer;" @click="click_event({item, scope})">(查看)</span>
                    </el-row>
                    <el-row v-else-if="item.type === 'index'"> {{ scope.$index + 1 }} </el-row>
                    <el-row v-else>
                        <div v-if="item.filter">{{ item.filter(scope.row[scope.column.property]) }}</div>
                        <div v-else>{{ scope.row[scope.column.property] }}</div>
                    </el-row>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="pageInfo.pageNum"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageInfo.pageSize"
            :total="pageInfo.total"
            layout="total, sizes, prev, pager, next, jumper"
        >
        </el-pagination>
    </el-row>
</template>
<script>
export default {
    props: ['tableConf', 'URL', 'OtherUrl'],
    data() {
        return {
            pageInfo: {
                pageNum: 1,
                pageSize: 10,
                total: 0,
            },
        };
    },
    computed: {
        dataList() {
            return this.tableConf;
        },
    },
    methods: {
        sizeChangeHandle(val) {
            this.pageInfo.pageSize = val;
            this.getDataList();
        },
        currentChangeHandle(val) {
            this.pageInfo.pageNum = val;
            this.getDataList();
        },
        getDataList() {
            let obj = Object.assign(
                {
                    pageNum: this.pageInfo.pageNum,
                    pageSize: this.pageInfo.pageSize,
                },
                this.dataList.params
            );

            let url = this.URL ? this.$http.adornUrl(this.URL) : this.$http.adornUrl3(this.OtherUrl);
            if (!url) return false;
            this.$http({
                url: url,
                method: 'get',
                params: this.$http.adornParams(obj),
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.$set(this.dataList, 'data', data.data.list);
                    this.pageInfo.total = data.data.total;
                } else {
                    this.dataList = [];
                    this.total = 0;
                }
            });
        },
        // 刷新
        refresh() {
            (this.pageInfo.pageNum = 1), this.getDataList();
        },
        button_event(opt) {
            opt.obj.event(opt);
        },
        click_event(opt) {
            opt.item.event(opt);
        },
    },
};
</script>
