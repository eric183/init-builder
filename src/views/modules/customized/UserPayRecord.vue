<template>
    <el-row>
        <el-row>
            <dynamic-form v-model="dataForm" :form-config="dynamicFormData">
                <el-form-item> <el-button type="primary" @click="selectData()">查询</el-button> </el-form-item>
            </dynamic-form>
        </el-row>
        <el-row> <div id="dataShow" class="echar_style"></div> </el-row>
    </el-row>
</template>

<script>
import echarts from 'echarts';
export default {
    computed: {
        dynamicFormData() {
            let fromData = {
                inline: true,
                labelPosition: 'right',
                labelWidth: '80px',
                size: 'mini',
                statusIcon: true,
                layout: false,
                formItemList: [
                    {
                        type: 'daterange',
                        label: '日期',
                        names: ['startTime', 'endTime'],
                        format: 'yyyy-MM-dd',
                        defaultValue: [new Date(new Date().getTime() - 7 * 24 * 3600 * 1000), new Date()],
                    },
                ],
            };
            return fromData;
        },
    },
    data() {
        return {
            dataForm: {
                startTime: new Date(new Date().getTime() - 7 * 24 * 3600 * 1000).Format('yyyy-MM-dd'),
                endTime: new Date().Format('yyyy-MM-dd'),
            },
            dataEchar: null,
        };
    },
    mounted: function() {
        let dataDiv = document.getElementById('dataShow');
        var dataE = echarts.init(dataDiv);
        this.dataEchar = dataE;
        this.$nextTick(function() {
            this.selectData();
        });
    },
    methods: {
        selectData() {
            this.$http({
                url: this.$http.adornUrl('/v1/cm/userPayRecords/count'),
                method: 'get',
                params: this.$http.adornParams({
                    startTime: this.dataForm.startTime,
                    endTime: this.dataForm.endTime,
                }),
            }).then(({data}) => {
                if (data && data.code === 200) {
                    let list = data.data;
                    let xData = [];
                    let breakfasts = [];
                    let lunchs = [];
                    let dinners = [];
                    for (let index in list) {
                        xData.push(list[index].recordTime);
                        breakfasts.push(list[index].breakfast);
                        lunchs.push(list[index].lunch);
                        dinners.push(list[index].dinner);
                    }
                    this.initEchar(xData, breakfasts, lunchs, dinners);
                }
            });
        },
        initEchar(xData, breakfasts, lunchs, dinners) {
            let option = {
                color: ['#E66B1A', '#33CC52', '#BB44BB'],
                legend: {
                    data: ['早', '午', '晚'],
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
                    },
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true,
                },
                xAxis: [
                    {
                        type: 'category',
                        data: xData,
                        name: '日期',
                        axisTick: {
                            alignWithLabel: true,
                        },
                    },
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '刷卡数量',
                    },
                ],
                series: [
                    {
                        name: '早',
                        type: 'bar',
                        barGap: 0,
                        data: breakfasts,
                    },
                    {
                        name: '午',
                        type: 'bar',
                        barGap: 0,
                        data: lunchs,
                    },
                    {
                        name: '晚',
                        type: 'bar',
                        barGap: 0,
                        data: dinners,
                    },
                ],
            };
            this.dataEchar.setOption(option);
        },
    },
};
</script>

<style scoped>
.echar_style {
    width: 90%;
    height: 500px;
    margin: 5px auto 0;
}
</style>
