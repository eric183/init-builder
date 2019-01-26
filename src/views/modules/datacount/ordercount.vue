<template>
    <div>
        <div class="charts" v-show="isRole">
            <div>
                <div class="sale_block">
                    <p>销售额看板</p>
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
                <div id="box"><div id="sale_charts"></div></div>
                <span class="tip1" v-show="isData3">暂无数据</span>
            </div>
            <div>
                <div class="sale_block">
                    <p>订单看板</p>
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
                        <el-button type="primary" size="small" @click="orderLine()">确定</el-button>
                    </p>
                </div>
                <div id="box2"><div id="order_charts"></div></div>
                <span class="tip2" v-show="isData4">暂无数据</span>
            </div>
        </div>
        <div class="charts" v-show="!isRole">
            <div>
                <div class="sale_block">
                    <p>
                        <span>销售额看板</span>
                        <el-select v-model="dataForm3.dimension" size="small" @change="change(dataForm3.dimension)">
                            <el-option v-for="item in saleList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                        <el-select v-model="dataForm3.shopId" size="small" style="width:150px" v-if="shopName" placeholder="请选择店铺" @change="changeBtn(dataForm3.shopId)">
                            <el-option v-for="item in shopList" :key="item.shopId" :label="item.shopName" :value="item.shopId"></el-option>
                        </el-select>
                        <el-button type="primary" size="small" v-if="shopName" @click="drawLine2()" :disabled="isclick">确定</el-button>
                    </p>
                    <p>
                        <el-date-picker
                            v-model="value7"
                            type="daterange"
                            size="small"
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
                        <el-button type="primary" size="small" @click="drawLine2()">确定</el-button>
                    </p>
                </div>
                <div><div id="sale_charts2"></div></div>
                <span class="tip" v-show="isData">暂无数据</span>
            </div>
            <div>
                <div class="sale_block">
                    <p>
                        <span>订单看板</span>
                        <el-select v-model="dataForm4.dimension" size="small" @change="change2(dataForm4.dimension)">
                            <el-option v-for="item in orderList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                        <el-select v-model="dataForm4.shopId" size="small" style="width:150px" v-if="shopName2" placeholder="请选择店铺" @change="changeBtn2(dataForm4.shopId)">
                            <el-option v-for="item in shopList" :key="item.shopId" :label="item.shopName" :value="item.shopId"></el-option>
                        </el-select>
                        <el-button type="primary" size="small" v-if="shopName2" @click="orderLine2()" :disabled="isclick2">确定</el-button>
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
                        <el-button type="primary" size="small" @click="orderLine2()">确定</el-button>
                    </p>
                </div>
                <div id="order_charts2"></div>
                <span class="tip2" v-show="isData2">暂无数据</span>
            </div>
        </div>
    </div>
</template>

<script>
import commonFunc from '@/assets/common.js';
import echarts from 'echarts';
export default {
    name: 'ordercount',
    data() {
        return {
            // 销售额的查询条件
            dataForm: {
                startTime: '',
                endTime: '',
            },
            shopId: null, //店铺id
            dimension: null,
            isRole: true, //默认进来是店主角色
            value7: '',
            value8: '',
            value9: '',
            value10: '',
            // 订单的查询条件
            dataForm2: {
                startTime: '',
                endTime: '',
            },
            saleList: [{value: 2, label: '美食/优品销售额对比'}, {value: 3, label: '平台销售总额'}, {value: 1, label: '店铺销售额'}],
            orderList: [{value: 2, label: '美食/优品订单量对比'}, {value: 3, label: '平台订单总量'}, {value: 1, label: '店铺订单量'}],
            dataForm3: {
                dimension: 2, //默认显示对比
                shopId: null,
            },
            dataForm4: {
                dimension: 2, //默认显示对比
                shopId: null,
            },
            shopName: false,
            shopName2: false,
            shopList: [], //店铺下拉列表
            isclick: true, //店铺下拉之后的确定按钮默认你不能点击  --销售额
            isclick2: true, //店铺下拉之后的确定按钮默认你不能点击 --订单
            isData: false, //是否有数据的提示
            isData2: false,
            isData4: false,
            isData3: false,
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
                this.orderLine();
            } else {
                // 运营
                this.shopId = null;
                this.dimension = 2;
                this.isRole = false;
                this.drawLine2();
                this.orderLine2();
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
            this.dataForm.startTime = commonFunc.commonFunc2(start.getTime());
            this.dataForm.endTime = commonFunc.commonFunc2(end.getTime());
            this.dataForm2.startTime = commonFunc.commonFunc2(start.getTime());
            this.dataForm2.endTime = commonFunc.commonFunc2(end.getTime());
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
            var options = {};
            this.$http({
                url: this.$http.adornUrl2('/v1/statistics/orders/salesAmount'),
                method: 'get',
                params: this.$http.adornParams({
                    startTime: this.dataForm.startTime,
                    endTime: this.dataForm.endTime,
                    dimension: 1,
                    shopId: this.shopId,
                }),
            }).then(({data}) => {
                if (data && data.code === 200) {
                    if (data.data.categories.length == 0) {
                        this.isData3 = true;
                    } else {
                        this.isData3 = false;
                        // 绘制图表
                        options = {
                            tooltip: {},
                            xAxis: {
                                data: data.data.categories,
                                axisLabel: {
                                    rotate: 30,
                                },
                            },
                            grid: {right: '3%'},
                            yAxis: {
                                type: 'value',
                                name: '单位/元',
                            },
                            series: [
                                {
                                    name: '订单',
                                    type: 'bar',
                                    barMinWidth: 5,
                                    barMaxWidth: 40,
                                    data: data.data.shopSalesAmount,
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
                        myChart.setOption(options);
                        window.addEventListener('resize', function() {
                            myChart.resize();
                        });
                    }
                }
            });
        },
        orderLine() {
            let orderChart = echarts.init(document.getElementById('order_charts'));
            var options = {};
            this.$http({
                url: this.$http.adornUrl2('/v1/statistics/orders/orderNum'),
                method: 'get',
                params: this.$http.adornParams({
                    startTime: this.dataForm2.startTime,
                    endTime: this.dataForm2.endTime,
                    dimension: 1,
                    shopId: this.shopId,
                }),
            }).then(({data}) => {
                if (data && data.code === 200) {
                    // 绘制图表
                    if (data.data.categories.length == 0) {
                        this.isData4 = true;
                    } else {
                        this.isData4 = false;
                        options = {
                            tooltip: {},
                            xAxis: {
                                data: data.data.categories,
                                axisLabel: {
                                    rotate: 30,
                                },
                            },
                            yAxis: {
                                type: 'value',
                                name: '单位/件',
                            },
                            grid: {right: '3%'},
                            series: [
                                {
                                    name: '订单',
                                    type: 'line',
                                    barMinWidth: 5,
                                    barMaxWidth: 40,
                                    data: data.data.shopOrderNum,
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
                        orderChart.setOption(options);
                        window.addEventListener('resize', function() {
                            orderChart.resize();
                        });
                    }
                }
            });
        },
        drawLine2() {
            if (this.dataForm3.dimension == 1) {
                this.dimension = 1;
                this.shopId = this.dataForm3.shopId;
            }
            if (this.dataForm3.dimension == 2) {
                this.dimension = 2;
                this.shopId = null;
            }
            if (this.dataForm3.dimension == 3) {
                this.dimension = 2;
                this.shopId = null;
            }
            let myChart2 = echarts.init(document.getElementById('sale_charts2'));
            myChart2.clear();
            var options = {};
            this.$http({
                url: this.$http.adornUrl2('/v1/statistics/orders/salesAmount'),
                method: 'get',
                params: this.$http.adornParams({
                    startTime: this.dataForm.startTime,
                    endTime: this.dataForm.endTime,
                    dimension: this.dimension,
                    shopId: this.shopId,
                }),
            }).then(({data}) => {
                if (data && data.code === 200) {
                    // 对比绘图
                    if (data.data.categories.length == 0) {
                        this.isData = true;
                    } else {
                        this.isData = false;
                        //对比
                        if (this.dataForm3.dimension == 2) {
                            options = {
                                tooltip: {},
                                legend: {
                                    data: ['美食', '优品'],
                                },
                                xAxis: {
                                    data: data.data.categories,
                                    axisLabel: {
                                        rotate: 30,
                                    },
                                },
                                yAxis: {
                                    type: 'value',
                                    name: '单位/元',
                                },
                                grid: {right: '3%'},
                                series: [
                                    {
                                        name: '美食',
                                        type: 'bar',
                                        data: data.data.foodSalesAmount,
                                        barMinWidth: 5,
                                        barMaxWidth: 40,
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
                                            formatter: function(params) {
                                                if (params.value > 0) {
                                                    return params.value;
                                                } else {
                                                    return '';
                                                }
                                            },
                                        },
                                    },
                                    {
                                        name: '优品',
                                        type: 'bar',
                                        data: data.data.mallSalesAmount,
                                        barMinWidth: 5,
                                        barMaxWidth: 40,
                                        itemStyle: {
                                            normal: {
                                                color: '#67c23a',
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
                        // 全部绘图
                        if (this.dataForm3.dimension == 3) {
                            options = {
                                tooltip: {},
                                legend: {
                                    data: ['全部'],
                                },
                                xAxis: {
                                    data: data.data.categories,
                                    axisLabel: {
                                        rotate: 30,
                                    },
                                },
                                grid: {right: '3%'},
                                yAxis: {
                                    type: 'value',
                                    name: '单位/元',
                                },
                                series: [
                                    {
                                        name: '全部',
                                        type: 'bar',
                                        barMinWidth: 5,
                                        barMaxWidth: 40,
                                        data: data.data.totalSalesAmount,
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
                        // 定位店铺
                        if (this.dataForm3.dimension == 1) {
                            options = {
                                tooltip: {},
                                xAxis: {
                                    data: data.data.categories,
                                    axisLabel: {
                                        rotate: 30,
                                    },
                                },
                                yAxis: {
                                    type: 'value',
                                    name: '单位/元',
                                },
                                grid: {right: '3%'},
                                series: [
                                    {
                                        type: 'bar',
                                        barMinWidth: 5,
                                        barMaxWidth: 40,
                                        data: data.data.shopSalesAmount,
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
                    }
                }
            });
        },
        orderLine2() {
            if (this.dataForm4.dimension == 1) {
                this.dimension = 1;
                this.shopId = this.dataForm4.shopId;
            }
            if (this.dataForm4.dimension == 2) {
                this.dimension = 2;
                this.shopId = null;
            }
            if (this.dataForm4.dimension == 3) {
                this.dimension = 2;
                this.shopId = null;
            }
            let orderChart2 = echarts.init(document.getElementById('order_charts2'));
            orderChart2.clear();
            var options = {};
            this.$http({
                url: this.$http.adornUrl2('/v1/statistics/orders/orderNum'),
                method: 'get',
                params: this.$http.adornParams({
                    startTime: this.dataForm2.startTime,
                    endTime: this.dataForm2.endTime,
                    dimension: this.dimension,
                    shopId: this.shopId,
                }),
            }).then(({data}) => {
                if (data && data.code === 200) {
                    // 对比绘图
                    if (data.data.categories.length == 0) {
                        this.isData2 = true;
                    } else {
                        this.isData2 = false;
                        if (this.dataForm4.dimension == 2) {
                            options = {
                                tooltip: {},
                                legend: {
                                    data: ['美食', '优品'],
                                },
                                grid: {right: '3%'},
                                xAxis: {
                                    data: data.data.categories,
                                    axisLabel: {
                                        rotate: 30,
                                    },
                                },
                                yAxis: {
                                    type: 'value',
                                    name: '单位/件',
                                },
                                series: [
                                    {
                                        name: '美食',
                                        type: 'line',
                                        barMinWidth: 5,
                                        barMaxWidth: 40,
                                        data: data.data.foodOrderNum,
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
                                    {
                                        name: '优品',
                                        type: 'line',
                                        barMinWidth: 5,
                                        barMaxWidth: 40,
                                        data: data.data.mallOrderNum,
                                        itemStyle: {
                                            normal: {
                                                color: '#67c23a',
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
                        // 全部
                        if (this.dataForm4.dimension == 3) {
                            options = {
                                tooltip: {},
                                legend: {
                                    data: ['全部'],
                                },
                                xAxis: {
                                    data: data.data.categories,
                                    axisLabel: {
                                        rotate: 30,
                                    },
                                },
                                grid: {right: '3%'},
                                yAxis: {
                                    type: 'value',
                                    name: '单位/件',
                                },
                                series: [
                                    {
                                        name: '全部',
                                        type: 'line',
                                        barMinWidth: 5,
                                        barMaxWidth: 40,
                                        data: data.data.totalOrderNum,
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
                        // 定位
                        if (this.dataForm4.dimension == 1) {
                            options = {
                                tooltip: {},
                                xAxis: {
                                    data: data.data.categories,
                                    axisLabel: {
                                        rotate: 30,
                                    },
                                },
                                yAxis: {
                                    type: 'value',
                                    name: '单位/件',
                                },
                                grid: {right: '3%'},
                                series: [
                                    {
                                        type: 'line',
                                        barMinWidth: 5,
                                        barMaxWidth: 40,
                                        data: data.data.shopOrderNum,
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
                        orderChart2.setOption(options);
                        orderChart2.resize();
                        window.addEventListener('resize', function() {
                            orderChart2.resize();
                        });
                    }
                }
            });
        },
        changeBtn(value) {
            if (value) {
                this.isclick = false;
            }
        },
        changeBtn2(value) {
            if (value) {
                this.isclick2 = false;
            }
        },
        // 销售看板定位店铺
        change(value) {
            if (value == 1) {
                this.shopName = true;
            } else {
                this.shopName = false;
                this.drawLine2();
            }
        },
        // 订单看板定位店铺
        change2(value) {
            if (value == 1) {
                this.shopName2 = true;
            } else {
                this.shopName2 = false;
                this.orderLine2();
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
        // background: #f1f4f5;
        border-bottom: 1px solid #f1f4f5;
        border-radius: 4px;
        padding: 0 15px;
        p {
            padding-top: 10px;
        }
    }
    #sale_charts {
        // width: 1500px;
        height: 300px;
    }
    #order_charts {
        //width: 1500px;
        height: 300px;
    }
    #sale_charts2 {
        //width: 1500px;
        height: 300px;
    }
    #order_charts2 {
        // width: 1500px;
        height: 300px;
    }
    .tip {
        position: absolute;
        z-index: 100;
        left: 26%;
        top: 30%;
        font-size: 20px;
    }
    .tip2 {
        position: absolute;
        z-index: 100;
        left: 26%;
        top: 80%;
        font-size: 20px;
    }
}
</style>
