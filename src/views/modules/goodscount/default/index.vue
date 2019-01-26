<template>
    <div>
        <div class="charts" v-show="isRole">
            <div class="sale_block">
                <p>商品看板</p>
                <p>
                    <el-date-picker
                        v-model="value7"
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
                    <el-button type="primary" size="small" @click="drawLine()">确定</el-button>
                </p>
            </div>
            <div><div id="sale_charts"></div></div>
            <span class="tip" v-show="isData">暂无数据</span>
        </div>
        <div class="charts" v-show="!isRole">
            <div class="sale_block">
                <p>
                    <span>商品看板</span>
                    <el-select v-model="dataForm2.shopType" size="small" @change="change(dataForm2.shopType)">
                        <el-option v-for="item in saleList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <el-select v-model="dataForm2.shopId" size="small" style="width:150px" v-if="shopName" placeholder="店铺名称" @change="changeBtn(dataForm2.shopId)">
                        <el-option v-for="item in shopList" :key="item.shopId" :label="item.shopName" :value="item.shopId"></el-option>
                    </el-select>
                    <el-button type="primary" size="small" v-if="shopName" @click="drawLine2()" :disabled="isclick">确定</el-button>
                </p>
                <p>
                    <el-date-picker
                        v-model="value8"
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
                    <el-button type="primary" size="small" @click="drawLine2()">确定</el-button>
                </p>
            </div>
            <div><div id="sale_charts2"></div></div>
            <span class="tip" v-show="isData">暂无数据</span>
        </div>
    </div>
</template>

<script>
import {commonFunc2} from '@/utils/resources/index.js';
import echarts from 'echarts';
export default {
    name: 'ordercount',
    data() {
        return {
            dataForm: {
                startTime: '',
                endTime: '',
                dimension: 1,
                shopId: null, //默认店铺id没有
            },
            value7: '',
            value8: '',
            shopId: null,
            // 商品看板的查询条件
            dataForm2: {
                startTime: '',
                endTime: '',
                shopType: 1,
                dimension: 2,
                shopId: null, //默认店铺id没有
            },
            shopType: 1,
            value1: 1,
            salevalue: 1,
            ordervalue: 1,
            saleList: [{value: 1, label: '美食'}, {value: 2, label: '商城'}, {value: 3, label: '定位店铺'}],
            shopName: false,
            isRole: true, //默认进来是店主角色
            shopList: [], //店铺下拉列表
            isclick: true, //店铺下拉之后的确定按钮默认你不能点击  --销售额
            isData: false, //是否有数据的提示
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
        this.getStoreId();
    },
    methods: {
        // 获取店铺id信息
        getStoreId() {
            this.shops = JSON.parse(sessionStorage.getItem('shops') || '[]');
            if (this.shops.length > 0) {
                // 店主
                this.shopId = this.shops[0].shopId;
                this.dimension = 1;
                this.isRole = true;
                this.drawLine();
            } else {
                // 运营
                this.shopId = null;
                this.dimension = 2;
                this.isRole = false;
                this.drawLine2();
                this.getShopList();
            }
        },
        // 查看店铺下拉列表
        getShopList() {
            this.$http.get(this.$http.adornUrl2('/v1/merchant/shops/options')).then(res => {
                if (res.data.code === 200) {
                    this.shopList = res.data.data.options;
                }
            });
        },
        // 初始化时间
        initTime() {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            this.value7 = [start, end];
            this.value8 = [start, end];
            this.dataForm.startTime = commonFunc2(start.getTime());
            this.dataForm.endTime = commonFunc2(end.getTime());
            this.dataForm2.startTime = commonFunc2(start.getTime());
            this.dataForm2.endTime = commonFunc2(end.getTime());
        },
        //获取查询时间
        getTime(val) {
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
            if (val) {
                for (let i = 0; i < val.length; i++) {
                    this.dataForm2.startTime = val[0];
                    this.dataForm2.endTime = val[1];
                }
            } else {
                (this.dataForm2.startTime = ''), (this.dataForm2.endTime = '');
            }
        },
        drawLine() {
            // 基于准备好的dom，初始化echarts实例
            let myChart = echarts.init(document.getElementById('sale_charts'));
            myChart.showLoading();
            this.$http({
                url: this.$http.adornUrl2('/v1/statistics/goods/goodsNum'),
                method: 'get',
                params: this.$http.adornParams({
                    startTime: this.dataForm.startTime,
                    endTime: this.dataForm.endTime,
                    dimension: 1,
                    shopId: this.shopId,
                }),
            }).then(({data}) => {
                if (data && data.code === 200) {
                    myChart.hideLoading();
                    var options = {};
                    if (data.data.goodsNameList.length == 0) {
                        this.isData = true;
                        options = {};
                    } else {
                        this.isData = false;
                        options = {
                            tooltip: {
                                trigger: 'axis',
                                axisPointer: {
                                    // 坐标轴指示器，坐标轴触发有效
                                    type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
                                },
                                formatter: function(params) {
                                    return '销售总额:' + data.data.goodsSalesAmountList[params[0].dataIndex] + 'RMB';
                                },
                            },
                            xAxis: {
                                data: data.data.goodsNameList,
                                axisLabel: {
                                    rotate: 30,
                                },
                            },
                            grid: {right: '3%', bottom: '30%'},
                            yAxis: {
                                type: 'value',
                                name: '销量',
                            },
                            series: [
                                {
                                    name: '销量',
                                    type: 'bar',
                                    barMinWidth: 5,
                                    barMaxWidth: 40,
                                    data: data.data.goodsNumList,
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
                } else {
                }
            });
        },
        drawLine2() {
            if (this.dataForm2.shopType == 3) {
                this.shopType = null;
                this.dataForm2.dimension = 1;
            }
            if (this.dataForm2.shopType == 2) {
                this.shopType = 2;
                this.dataForm2.dimension = 2;
            }
            if (this.dataForm2.shopType == 1) {
                this.shopType = 1;
                this.dataForm2.dimension = 2;
            }
            let myChart2 = echarts.init(document.getElementById('sale_charts2'));
            myChart2.clear();
            this.$http({
                url: this.$http.adornUrl2('/v1/statistics/goods/goodsNum'),
                method: 'get',
                params: this.$http.adornParams({
                    startTime: this.dataForm2.startTime,
                    endTime: this.dataForm2.endTime,
                    dimension: this.dataForm2.dimension,
                    shopType: this.shopType,
                    shopId: this.dataForm2.shopId,
                }),
            }).then(({data}) => {
                if (data && data.code === 200) {
                    var options = {};
                    if (data.data.goodsNameList.length == 0) {
                        this.isData = true;
                        options = {};
                    } else {
                        this.isData = false;
                        options = {
                            tooltip: {
                                trigger: 'axis',
                                axisPointer: {
                                    // 坐标轴指示器，坐标轴触发有效
                                    type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
                                },
                                formatter: function(params) {
                                    return '销售总额' + '<br/>' + data.data.goodsSalesAmountList[params[0].dataIndex] + 'RMB';
                                },
                            },
                            xAxis: {
                                data: data.data.goodsNameList,
                                axisLabel: {
                                    rotate: 30,
                                },
                            },
                            grid: {right: '3%', bottom: '30%'},
                            yAxis: {
                                type: 'value',
                                name: '销量',
                            },
                            series: [
                                {
                                    name: '销量',
                                    type: 'bar',
                                    barMinWidth: 5,
                                    barMaxWidth: 40,
                                    data: data.data.goodsNumList,
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

                    myChart2.setOption(options);
                    myChart2.resize();
                    window.addEventListener('resize', function() {
                        myChart2.resize();
                    });
                } else {
                }
            });
        },
        // 商品看板定位店铺
        change(value) {
            if (value == 3) {
                this.shopName = true;
            } else {
                this.shopName = false;
                this.drawLine2();
            }
        },
        changeBtn(value) {
            if (value) {
                this.isclick = false;
            }
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
        border-bottom: 1px solid #f1f4f5;
        border-radius: 4px;
        padding: 0 15px;
        p {
            padding-top: 10px;
        }
    }
    #sale_charts {
        height: 700px;
        // margin: auto;
    }
    #sale_charts2 {
        height: 700px;
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
