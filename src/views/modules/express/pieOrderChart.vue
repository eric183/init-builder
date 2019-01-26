<template>
    <div class="pie_order_chart">
        <div class="top">
            <p>派件数量统计</p>
            <div class="pie_title">
                <p class="pl10">
                    <label>快递商：</label>
                    <el-select v-model="dataForm.expressCompanyCode" placeholder="请选择快递商" size="mini" @change="companyChange">
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="item in companyList" :key="item.expressCompanyCode" :label="item.expressCompanyName" :value="item.expressCompanyCode"></el-option>
                    </el-select>
                </p>
                <p>
                    <el-date-picker
                        size="mini"
                        v-model="value1"
                        type="daterange"
                        align="right"
                        unlink-panels
                        value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd"
                        range-separator="-"
                        start-placeholder="开始"
                        end-placeholder="结束"
                        :picker-options="pickerOptions"
                        :clearable="false"
                        @change="getTime"
                    >
                    </el-date-picker>
                    <el-button type="primary" size="mini" @click="pieNumFun()">确定</el-button>
                </p>
            </div>
            <div><div id="sale_charts"></div></div>
        </div>
        <div class="bottom top">
            <p>派件快递商占比统计</p>
            <div class="pie_title">
                <p></p>
                <p>
                    <el-date-picker
                        v-model="value2"
                        size="mini"
                        type="daterange"
                        align="right"
                        unlink-panels
                        value-format="yyyy-MM-dd"
                        range-separator="-"
                        start-placeholder="开始"
                        end-placeholder="结束"
                        :picker-options="pickerOptions"
                        :clearable="false"
                        @change="getTime2"
                    >
                    </el-date-picker>
                    <el-button type="primary" size="mini" @click="drawLine2()">确定</el-button>
                </p>
            </div>
            <div><div id="sale_charts2"></div></div>
        </div>
    </div>
</template>

<script>
import commonFunc from '@/assets/common.js';
import echarts from 'echarts';
export default {
    name: 'pieOrderChart',
    data() {
        return {
            dataForm: {
                startTime: '',
                endTime: '',
                expressCompanyCode: '',
            },
            companyList: [],
            value1: '',
            value2: '',
            dataForm2: {
                startTime: '',
                endTime: '',
            },
            pickerOptions: {
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
        this.getShopList();
        this.pieNumFun();
        this.drawLine2();
    },
    methods: {
        // 查看快递派件公司下拉列表
        getShopList() {
            this.$http.get(this.$http.adornUrl('/v1/express/dispatchCompanies')).then(res => {
                if (res.data.code === 200) {
                    this.companyList = res.data.data.options;
                }
            });
        },
        // 初始化时间
        initTime() {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            this.value1 = [start, end];
            this.value2 = [start, end];
            this.dataForm.startTime = commonFunc.commonFunc2(start.getTime());
            this.dataForm.endTime = commonFunc.commonFunc2(end.getTime());
            this.dataForm2.startTime = commonFunc.commonFunc2(start.getTime());
            this.dataForm2.endTime = commonFunc.commonFunc2(end.getTime());
        },
        timeChange(val, data) {
            data.startTime = val[0];
            data.endTime = val[1];
        },
        //获取查询时间
        getTime(val) {
            this.timeChange(val, this.dataForm);
        },
        getTime2(val) {
            this.timeChange(val, this.dataForm2);
        },
        pieNumFun() {
            // 基于准备好的dom，初始化echarts实例
            let myChart = echarts.init(document.getElementById('sale_charts'));
            this.$http({
                url: this.$http.adornUrl('/v1/express/dispatchNum'),
                method: 'get',
                params: this.$http.adornParams({
                    startTime: this.dataForm.startTime,
                    endTime: this.dataForm.endTime,
                    expressCompanyCode: this.dataForm.expressCompanyCode,
                }),
            }).then(({data}) => {
                if (data && data.code === 200) {
                    var options = {};
                    if (data.data.categories.length == 0) {
                        options = {};
                    } else {
                        options = {
                            tooltip: {},
                            xAxis: {
                                data: data.data.categories,
                                axisLabel: {
                                    rotate: 30,
                                },
                            },
                            grid: {right: '3%', bottom: '15%'},
                            yAxis: {
                                type: 'value',
                                name: '数量',
                            },
                            series: [
                                {
                                    name: '派件数量',
                                    type: 'line',
                                    data: data.data.expressDispatchNum,
                                    itemStyle: {
                                        normal: {
                                            color: '#17B3A3',
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
        companyChange() {
            this.pieNumFun();
        },
        drawLine2() {
            let myChart2 = echarts.init(document.getElementById('sale_charts2'));
            myChart2.clear();
            this.$http({
                url: this.$http.adornUrl('/v1/express/dispatchNumRank'),
                method: 'get',
                params: this.$http.adornParams({
                    startTime: this.dataForm2.startTime,
                    endTime: this.dataForm2.endTime,
                }),
            }).then(({data}) => {
                if (data && data.code === 200) {
                    var options = {};
                    if (data.data.categories.length == 0) {
                        options = {};
                    } else {
                        data.data.ranking.map(obj => {
                            obj.value = obj.expressDispatchNum;
                        });
                        options = {
                            tooltip: {
                                trigger: 'item',
                                formatter: '{a} <br/>{b} : {c} ({d}%)',
                            },
                            legend: {
                                orient: 'vertical',
                                right: '15%',
                                top: '0',
                                data: data.data.categories,
                                formatter: function(name) {
                                    var list = data.data.ranking;
                                    var total = 0;
                                    var target;
                                    for (var i = 0; i < list.length; i++) {
                                        total += list[i].expressDispatchNum;
                                        if (list[i].name == name) {
                                            target = list[i].expressDispatchNum;
                                        }
                                    }
                                    return name + ' ' + '  ' + target + '件' + '   ' + ((target / total) * 100).toFixed(2) + '%';
                                },
                            },
                            series: [
                                {
                                    name: '快递商',
                                    type: 'pie',
                                    radius: '55%',
                                    center: ['50%', '50%'],
                                    data: data.data.ranking,
                                    itemStyle: {
                                        normal: {
                                            label: {
                                                // position: 'inner',
                                                formatter: function(params) {
                                                    return params.name + (params.percent - 0).toFixed(2) + '%';
                                                },
                                            },
                                            labelLine: {
                                                show: true,
                                            },
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
.pie_order_chart {
    .top > p {
        background: #ebeef5;
        padding: 10px;
        color: #000;
        margin: 0;
    }
    .pie_title {
        display: flex;
        justify-content: space-between;
    }
    #sale_charts {
        height: 350px;
    }
    #sale_charts2 {
        height: 350px;
    }
}
</style>
