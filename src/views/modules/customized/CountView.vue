<template>
    <el-row>
        <!-- 统计视图 -->
        <div class="charts">
            <div class="sale_block">
                <p>
                    <span>用餐类型</span>
                    <el-select v-model="userForm.bookingType" clearable size="small">
                        <el-option v-for="item in bookingTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </p>
                <p>
                    <el-date-picker
                        v-model="userData"
                        size="small"
                        type="daterange"
                        align="right"
                        unlink-panels
                        value-format="yyyy-MM-dd"
                        range-separator="-"
                        start-placeholder="开始"
                        end-placeholder="结束"
                        :picker-options="pickerOptions2"
                        @change="getTime"
                    >
                    </el-date-picker>
                    <el-button type="primary" size="small" @click="userCount()">确定</el-button>
                </p>
            </div>
            <div><div id="sale_charts"></div></div>
        </div>
        <div class="charts">
            <div class="sale_block">
                <p>
                    <span>用餐类型</span>
                    <el-select v-model="percentForm.bookingType" clearable size="small">
                        <el-option v-for="item in bookingTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </p>
                <p>
                    <el-date-picker
                        v-model="percentData"
                        size="small"
                        type="daterange"
                        align="right"
                        unlink-panels
                        value-format="yyyy-MM-dd"
                        range-separator="-"
                        start-placeholder="开始"
                        end-placeholder="结束"
                        :picker-options="pickerOptions2"
                        @change="getTime2"
                    >
                    </el-date-picker>
                    <el-button type="primary" size="small" @click="bookingType()">确定</el-button>
                </p>
            </div>
            <div><div id="sale_charts2"></div></div>
        </div>
    </el-row>
</template>

<script>
import {commonFunc2} from '@/utils/resources/index.js';
import echarts from 'echarts';
export default {
    name: 'CountView',
    data() {
        return {
            userForm: {
                startTime: '',
                endTime: '',
                bookingType: 0,
            },
            percentForm: {
                startTime: '',
                endTime: '',
                bookingType: 0,
            },
            userData: [],
            percentData: [],
            bookingTypeList: [{value: 0, label: '全部'}, {value: 1, label: '早餐'}, {value: 2, label: '午餐'}, {value: 3, label: '晚餐'}],
            pickerOptions2: {
                shortcuts: [
                    {
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        },
                    },
                    {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        },
                    },
                ],
            },
        };
    },
    activated() {
        this.initTime();
        this.userCount();
        this.bookingType();
    },
    methods: {
        // 初始化时间
        initTime() {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            this.userData = [start, end];
            this.percentData = [start, end];
            this.userForm.startTime = commonFunc2(start.getTime());
            console.log();
            this.userForm.endTime = commonFunc2(end.getTime());
            this.percentForm.startTime = commonFunc2(start.getTime());
            this.percentForm.endTime = commonFunc2(end.getTime());
        },
        //获取查询时间
        getTime(val) {
            if (val) {
                this.userForm.startTime = val[0];
                this.userForm.endTime = val[1];
            } else {
                (this.userForm.startTime = ''), (this.userForm.endTime = '');
            }
        },
        //获取查询时间
        getTime2(val) {
            if (val) {
                this.percentForm.startTime = val[0];
                this.percentForm.endTime = val[1];
            } else {
                (this.percentForm.startTime = ''), (this.percentForm.endTime = '');
            }
        },
        userCount() {
            // 基于准备好的dom，初始化echarts实例
            let myChart = echarts.init(document.getElementById('sale_charts'));
            myChart.showLoading();
            this.$http({
                url: this.$http.adornUrl('/v1/customized/statistics/summary'),
                method: 'get',
                params: this.$http.adornParams(this.userForm),
            }).then(({data}) => {
                if (data && data.code === 200) {
                    myChart.hideLoading();
                    var options = {};
                    if (data.data.categories.length == 0) {
                        options = {};
                    } else {
                        options = {
                            tooltip: {
                                trigger: 'axis',
                                axisPointer: {
                                    // 坐标轴指示器，坐标轴触发有效
                                    type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
                                },
                            },
                            legend: {
                                data: ['预约人数', '预约并就餐人数', '未预约就餐人数', '就餐总人数'],
                            },
                            xAxis: {
                                data: data.data.categories,
                                axisLabel: {
                                    rotate: 30,
                                },
                            },
                            grid: {right: '3%', bottom: '30%'},
                            yAxis: {
                                type: 'value',
                                name: '人数 / 个',
                            },
                            series: [
                                {
                                    name: '预约人数',
                                    type: 'bar',
                                    barMinWidth: 5,
                                    barMaxWidth: 40,
                                    data: data.data.appointmentNum,
                                    itemStyle: {
                                        normal: {
                                            color: '#FFCC00',
                                        },
                                    },
                                    label: {
                                        normal: {
                                            show: true,
                                            position: 'top',
                                        },
                                    },
                                },
                                {
                                    name: '预约并就餐人数',
                                    type: 'bar',
                                    barMinWidth: 5,
                                    barMaxWidth: 40,
                                    data: data.data.appointmentAndRepastNum,
                                    itemStyle: {
                                        normal: {
                                            color: '#9999FF',
                                        },
                                    },
                                    label: {
                                        normal: {
                                            show: true,
                                            position: 'top',
                                        },
                                    },
                                },
                                {
                                    name: '未预约就餐人数',
                                    type: 'bar',
                                    barMinWidth: 5,
                                    barMaxWidth: 40,
                                    data: data.data.noAppointmentButRepastNum,
                                    itemStyle: {
                                        normal: {
                                            color: '#99FF66',
                                        },
                                    },
                                    label: {
                                        normal: {
                                            show: true,
                                            position: 'top',
                                        },
                                    },
                                },
                                {
                                    name: '就餐总人数',
                                    type: 'bar',
                                    barMinWidth: 5,
                                    barMaxWidth: 40,
                                    data: data.data.repastNum,
                                    itemStyle: {
                                        normal: {
                                            color: '#CC6699',
                                        },
                                    },
                                    label: {
                                        normal: {
                                            show: true,
                                            position: 'top',
                                        },
                                    },
                                },
                            ],
                        };
                    }
                    myChart.setOption(options);
                    myChart.resize();
                    window.addEventListener('resize', function() {
                        myChart.resize();
                    });
                }
            });
        },
        bookingType() {
            let myChart2 = echarts.init(document.getElementById('sale_charts2'));
            myChart2.clear();
            this.$http({
                url: this.$http.adornUrl('/v1/customized/statistics/rate'),
                method: 'get',
                params: this.$http.adornParams(this.percentForm),
            }).then(({data}) => {
                if (data && data.code === 200) {
                    var options = {};
                    if (data.data.categories.length == 0) {
                        options = {};
                    } else {
                        options = {
                            title: {
                                subtext: '预约有效率：预约并就餐人数/预约人数  ;  预约就餐率：预约并就餐人数/实际就餐总人数 \n',
                                itemGap: 20,
                                left: 'center',
                            },
                            tooltip: {
                                trigger: 'axis',
                                axisPointer: {
                                    // 坐标轴指示器，坐标轴触发有效
                                    type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
                                },
                            },
                            legend: {
                                data: ['预约有效率', '预约就餐率'],
                            },
                            xAxis: {
                                data: data.data.categories,
                                axisLabel: {
                                    rotate: 30,
                                },
                            },
                            grid: {right: '3%', bottom: '30%'},
                            yAxis: {
                                type: 'value',
                                name: '比率 / %',
                            },
                            series: [
                                {
                                    name: '预约有效率',
                                    type: 'line',
                                    data: data.data.effectAppointmentRate,
                                    itemStyle: {
                                        normal: {
                                            color: '#4CC4B8',
                                        },
                                    },
                                    label: {
                                        normal: {
                                            show: true,
                                            position: 'top',
                                        },
                                    },
                                },
                                {
                                    name: '预约就餐率',
                                    type: 'line',
                                    data: data.data.appointmentAndRepastRate,
                                    itemStyle: {
                                        normal: {
                                            color: '#7DCA55',
                                        },
                                    },
                                    label: {
                                        normal: {
                                            show: true,
                                            position: 'top',
                                        },
                                    },
                                },
                            ],
                        };
                    }

                    myChart2.setOption(options);
                    myChart2.resize();
                    window.addEventListener('resize', function() {
                        myChart2.resize();
                    });
                } else {
                }
            });
        },
    },
};
</script>
<style lang="scss" scoped>
.charts {
    position: relative;
    .sale_block {
        display: flex;
        justify-content: space-between;
        // background: #f1f4f5;
        border-bottom: 1px solid #f1f4f5;
        border-radius: 4px;
        padding: 0 15px;
    }
    #sale_charts {
        height: 350px;
        // margin: auto;
    }
    #sale_charts2 {
        height: 350px;
    }
    .tip {
        position: absolute;
        z-index: 100;
        left: 20%;
        top: 60%;
        font-size: 20px;
    }
}
</style>
