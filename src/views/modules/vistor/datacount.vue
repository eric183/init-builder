<template>
    <!-- 数据统计 -->
    <div class="charts">
        <div>
            <div class="person">
                <p>访客人数统计</p>
                <p>
                    <el-date-picker
                        size="small"
                        v-model="value1"
                        type="daterange"
                        align="right"
                        unlink-panels
                        value-format="yyyy-MM-dd"
                        range-separator="-"
                        start-placeholder="开始"
                        end-placeholder="结束"
                        @change="getTime"
                    >
                    </el-date-picker>
                    <el-button type="primary" size="small" @click="vistor()">确定</el-button>
                </p>
            </div>
            <ul class="count">
                <li><span>访客申请人数</span> <span>审核通过人数</span> <span>拒绝访客人数</span></li>
                <li>
                    <span>{{ totalCount.total }}</span> <span>{{ totalCount.adoptTotal }}</span> <span>{{ totalCount.refuseTotal }}</span>
                </li>
            </ul>
            <div id="person_charts"></div>
            <span class="tip" v-show="isDataShow">暂无数据</span>
        </div>
        <div>
            <div class="reason">
                <p>来访事由统计</p>
                <p>
                    <el-date-picker
                        v-model="value2"
                        size="small"
                        type="daterange"
                        align="right"
                        unlink-panels
                        value-format="yyyy-MM-dd"
                        range-separator="-"
                        start-placeholder="开始"
                        end-placeholder="结束"
                        @change="getTime2"
                    >
                    </el-date-picker>
                    <el-button type="primary" size="small" @click="reason()">确定</el-button>
                </p>
            </div>
            <div id="reason_charts"></div>
            <span class="tip2" v-show="isDataShow2">暂无数据</span>
        </div>
    </div>
</template>

<script>
import commonFunc from '@/assets/common.js';
import echarts from 'echarts';
export default {
    name: 'datacount',
    data() {
        return {
            dataForm: {
                startTime: '',
                endTime: '',
            },
            value1: '',
            value2: '',
            // 商品看板的查询条件
            dataForm2: {
                startTime: '',
                endTime: '',
            },
            isDataShow: false, //审核通过人数图表--无数据提示文字
            isDataShow2: false, //来访事由统计--无数据提示文字
            totalCount: {
                total: 0,
                adoptTotal: 0,
                refuseTotal: 0,
            },
        };
    },
    activated() {
        this.initTime();
        this.getTotalCount();
        this.person();
        this.reason();
    },
    methods: {
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
        //获取查询时间
        getTime(val) {
            console.log(val);
            if (val) {
                for (let i = 0; i < val.length; i++) {
                    this.dataForm.startTime = val[0];
                    this.dataForm.endTime = val[1];
                }
            } else {
                (this.dataForm.startTime = ''), (this.dataForm.endTime = '');
            }
        },
        //获取查询时间
        getTime2(val) {
            console.log(val);
            if (val) {
                for (let i = 0; i < val.length; i++) {
                    this.dataForm2.startTime = val[0];
                    this.dataForm2.endTime = val[1];
                }
            } else {
                (this.dataForm2.startTime = ''), (this.dataForm2.endTime = '');
            }
        },
        // 访客总数统计
        getTotalCount() {
            this.$http({
                url: this.$http.adornUrl('/v1/visitor/records/totalCount'),
                method: 'get',
                params: this.$http.adornParams({
                    startTime: this.dataForm.startTime,
                    endTime: this.dataForm.endTime,
                }),
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.totalCount = data.data;
                }
            });
        },
        // 访客人数统计
        person() {
            let myChart = echarts.init(document.getElementById('person_charts'));
            this.$http({
                url: this.$http.adornUrl('/v1/visitor/records/totalCountTime'),
                method: 'get',
                params: this.$http.adornParams({
                    startTime: this.dataForm.startTime,
                    endTime: this.dataForm.endTime,
                }),
            }).then(({data}) => {
                if (data && data.code === 200) {
                    var option = {};
                    if (data.data.length == 0) {
                        option = {};
                        this.isDataShow = true;
                    } else {
                        this.isDataShow = false;
                        var xlist = [];
                        var ylist = [];
                        for (var i in data.data) {
                            xlist.push(data.data[i].date);
                            ylist.push(data.data[i].adoptTotal);
                        }
                        option = {
                            title: {
                                left: 'left',
                                text: '审核通过人数',
                                textStyle: {
                                    //文字颜色
                                    color: '#000',
                                    //字体风格,'normal','italic','oblique'
                                    fontStyle: 'normal',
                                    //字体粗细 'normal','bold','bolder','lighter',100 | 200 | 300 | 400...
                                    fontWeight: 'bold',
                                    //字体系列
                                    fontFamily: 'sans-serif',
                                    //字体大小
                                    fontSize: 14,
                                },
                            },
                            xAxis: {
                                type: 'category',
                                data: xlist,
                            },
                            yAxis: {
                                type: 'value',
                            },
                            series: [
                                {
                                    data: ylist,
                                    type: 'line',
                                },
                            ],
                        };
                    }
                    myChart.setOption(option, true);
                    myChart.resize();
                    window.addEventListener('resize', function() {
                        myChart.resize();
                    });
                }
            });
        },
        // 访客人数点击的那个确定按钮
        vistor() {
            this.getTotalCount();
            this.person();
        },
        // 来访事由统计
        reason() {
            let myChart1 = echarts.init(document.getElementById('reason_charts'));
            this.$http({
                url: this.$http.adornUrl('/v1/visitor/records/totalCountReason'),
                method: 'get',
                params: this.$http.adornParams({
                    startTime: this.dataForm2.startTime,
                    endTime: this.dataForm2.endTime,
                }),
            }).then(({data}) => {
                if (data && data.code === 200) {
                    var option = {};
                    if (data.data.length == 0) {
                        option = {};
                        this.isDataShow2 = true;
                    } else {
                        this.isDataShow2 = false;
                        var titleList = [];
                        var list = [];
                        for (var i in data.data) {
                            titleList.push(data.data[i].reason);
                            var obj = {};
                            obj.value = data.data[i].total;
                            obj.name = data.data[i].reason;
                            list.push(obj);
                        }
                        option = {
                            tooltip: {
                                trigger: 'item',
                                formatter: '{a} <br/>{b} : {c} ({d}%)',
                            },
                            legend: {
                                orient: 'vertical',
                                left: 'left',
                                data: titleList,
                            },
                            series: [
                                {
                                    name: '访问来源',
                                    type: 'pie',
                                    radius: '55%',
                                    center: ['50%', '60%'],
                                    // data:[
                                    //     {value:335, name:'商务'},
                                    //     {value:310, name:'服务'},
                                    //     {value:234, name:'面试'},
                                    //     {value:135, name:'入职'}
                                    // ],
                                    data: list,
                                    itemStyle: {
                                        emphasis: {
                                            shadowBlur: 10,
                                            shadowOffsetX: 0,
                                            shadowColor: 'rgba(0, 0, 0, 0.5)',
                                        },
                                        normal: {
                                            label: {
                                                show: true,
                                                formatter: '{d}%',
                                            },
                                            labelLine: {show: true},
                                        },
                                    },
                                },
                            ],
                        };
                    }
                    myChart1.setOption(option, true);
                    myChart1.resize();
                    window.addEventListener('resize', function() {
                        myChart1.resize();
                    });
                }
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.charts {
    margin: 0;
    padding: 0;
    position: relative;
    .person,
    .reason {
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #f1f4f5;
        border-radius: 4px;
        padding: 0 15px;
        p:nth-child(1) {
            font-size: 14px;
            font-weight: 700;
        }
    }
    ul.count {
        margin: 0;
        padding: 0;
        li {
            display: flex;
            border-bottom: 1px solid #f1f4f5;
            padding: 10px 0;
            span {
                width: 33.3%;
                text-align: center;
                padding: 5px 0;
            }
        }
        li:nth-child(1) {
            background-color: #f1f4f5;
        }
    }
    .saleRank {
        position: absolute;
        left: 400px;
        top: 90px;
        font-size: 16px;
    }
    #reason_charts {
        height: 300px;
    }
    #person_charts {
        height: 300px;
    }
}
.tip {
    position: absolute;
    z-index: 100;
    left: 45%;
    top: 34%;
    font-size: 20px;
}
.tip2 {
    position: absolute;
    z-index: 100;
    left: 45%;
    top: 84%;
    font-size: 20px;
}
</style>
