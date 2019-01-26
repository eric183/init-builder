<template>
    <div class="plain_info">
        <!-- 计划详情页面 -->
        <div class="plain_box">
            <div class="title">计划详情:</div>
            <ul>
                <li>
                    <div>
                        <label>计划名称:</label><span>{{ planObj.name }}</span>
                    </div>
                    <div>
                        <label>工作类别:</label><span>{{ devicetype(planObj.type) }}</span>
                    </div>
                </li>
                <li>
                    <div>
                        <label>计划开始时间:</label><span>{{ time(planObj.startTime) }}</span>
                    </div>
                    <div>
                        <label>计划结束时间:</label><span>{{ time(planObj.endTime) }}</span>
                    </div>
                </li>
                <li>
                    <div>
                        <label>首次任务执行开始时间:</label><span>{{ time(planObj.firstExecuteTime) }}</span>
                    </div>
                    <div>
                        <label>任务响应超时时间:</label><span>{{ planObj.responseTimeout }}</span
                        ><span class="ml10" v-if="planObj.responseTimeout">分钟</span>
                    </div>
                    <div>
                        <label>任务处理超时时间:</label><span>{{ planObj.handleTimeout }}</span
                        ><span class="ml10" v-if="planObj.handleTimeout">分钟</span>
                    </div>
                </li>
                <li>
                    <div>
                        <label>计划规则:</label><span>{{ rule(planObj.rule) }}</span>
                    </div>
                    <div v-if="planObj.rule == 2">
                        <label>计划周期:</label><span>{{ planObj.cycleUnit }}</span
                        ><span class="ml10">{{ unit(planObj.cycle) }}</span>
                    </div>
                </li>
                <li>
                    <div>
                        <label>责任人:</label><span>{{ planObj.managerDept }}</span
                        ><span class="ml10">{{ planObj.managerName }}</span>
                    </div>
                    <div>
                        <label>执行人:</label><span>{{ planObj.executorDept }}</span
                        ><span class="ml10">{{ planObj.executorName }}</span>
                    </div>
                </li>
                <li>
                    <div>
                        <label>备注:</label><span>{{ planObj.remark }}</span>
                    </div>
                </li>
            </ul>
            <div class="btn_box"><el-button size="mini" type="primary" @click="$router.go(-1)">返回</el-button></div>
        </div>
        <p class="title"><span>设备信息:</span></p>
        <el-table :data="dataList" border style="width: 100%;">
            <el-table-column type="index" header-align="center" align="center" width="50" label="序号"> </el-table-column>
            <el-table-column prop="name" header-align="center" align="center" label="设备名称"> </el-table-column>
            <el-table-column prop="deviceSn" header-align="center" align="center" label="设备编号"> </el-table-column>
            <el-table-column prop="typeDesc" header-align="center" align="center" label="设备类型"> </el-table-column>
            <el-table-column prop="model" header-align="center" align="center" label="规格型号"> </el-table-column>
            <el-table-column prop="floorName" header-align="center" align="center" label="安装楼层"> </el-table-column>
            <el-table-column prop="position" header-align="center" align="center" label="具体位置"> </el-table-column>
            <el-table-column header-align="center" align="center" width="240" label="操作">
                <template slot-scope="scope">
                    <el-button type="danger" plain size="mini" @click="info(scope.row.deviceId)">详情</el-button>
                    <el-button type="success" plain size="mini" @click="test(scope.row.refId)">检测项</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 弹窗-检测项 -->
        <textList v-if="textVisible" ref="text"></textList>
    </div>
</template>

<script>
import commonFunc from '@/assets/common.js';
import textList from './text-list';
import {devicetype, rule} from '@/assets/statue.js';
export default {
    data() {
        return {
            planObj: {}, //详情页面的计划数据
            dataList: [], //设备列表的数据
            textVisible: false,
            planId: null,
        };
    },
    components: {
        textList,
    },
    activated() {
        this.getPlainInfo();
    },
    methods: {
        // 设备计划详情的数据
        getPlainInfo() {
            this.planId = this.$route.query.planId; //路由跳转拿到参数
            this.$http({
                url: this.$http.adornUrl(`/v1/pm/check/plans/` + this.planId),
                method: 'get',
                params: this.$http.adornParams(),
            }).then(({data}) => {
                if (data && data.code === 200) {
                    (this.planObj = data.data.plan), (this.dataList = data.data.devices);
                }
            });
        },
        // 设备详情
        info(deviceId) {
            this.$router.push({name: 'superdev-groupinfo', query: {id: deviceId}});
        },
        // 检测项
        test(refId) {
            this.textVisible = true;
            this.$nextTick(() => {
                this.$refs.text.init({id: refId, isTrue: 'false'});
            });
        },
        devicetype(type) {
            return devicetype(type);
        },
        rule(item) {
            return rule(item);
        },
        time(time) {
            return commonFunc.commonFunc(time);
        },
        unit(data) {
            switch (data) {
                case 1:
                    return '小时';
                    break;
                case 2:
                    return '日';
                    break;
                case 3:
                    return '周';
                    break;
                case 4:
                    return '半月度';
                    break;
                case 5:
                    return '月';
                    break;
                case 6:
                    return '季';
                    break;
                case 7:
                    return '半年度';
                    break;
                case 8:
                    return '年';
                    break;
            }
        },
    },
};
</script>
<style lang="scss" scoped>
.plain_info {
    .plain_box {
        position: relative;
        ul {
            li {
                display: flex;
                padding: 15px 0;
                div {
                    width: 30%;
                    label {
                        margin-right: 10px;
                    }
                    span {
                        text-decoration: underline;
                        color: #606266;
                    }
                }
            }
        }
        .btn_box {
            position: absolute;
            right: 10px;
            top: 0;
        }
    }
    .title {
        font-size: 14px;
        font-weight: 700;
    }
}
</style>
