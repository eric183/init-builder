<template>
    <div class="maxbox" :class="{isActive: index == 1}">
        <div class="iframe-con">
            <iframe
                id="doorDataIframe"
                width="100%"
                height="400"
                scrolling="no"
                src="https://bigaccess.louzm.cn/d/O2k0yYVmz/chu-neng-da-sha-zong-chu-ru-tong-ji-tu?refresh=5s&orgId=1&panelId=6&fullscreen&from=now-24h&to=now&kiosk"
            ></iframe>
        </div>
        <header class="header">
            <div class="head_left">
                <label>日期</label>
                <el-date-picker size="mini" v-model="dataForm.date" type="date" value-format="yyyy-MM-dd" @change="getTime()" placeholder="选择日期" :clearable="false"> </el-date-picker>
            </div>
            <div class="head_right">
                <div class="head_time">
                    <span>刷新时间:</span> <span>{{ count }}s</span>
                </div>
                <div class="head_creen"><i class="el-icon-rank" v-if="index == 0" @click="fullScreen()"></i> <i class="el-icon-rank" v-if="index == 1" @click="exitScreen()"></i></div>
            </div>
        </header>
        <div class="data_count">
            <div class="item-count">
                <div class="count-title"><p>美食</p></div>
                <div class="list-count">
                    <div class="li-count">
                        <div class="left-count"><i class="iconfont">&#xe667;</i></div>
                        <div class="right-count">
                            <h3 class="count-numinfo">{{ fineFood.foodOrderNum * 3 }}</h3>
                            <h4 class="count-titinfo">订单数</h4>
                        </div>
                    </div>
                    <div class="li-count">
                        <div class="left-count"><i class="iconfont">&#xe61e;</i></div>
                        <div class="right-count">
                            <h3 class="count-numinfo">{{ fineFood.foodRevenue * 3 }}</h3>
                            <h4 class="count-titinfo">营收金额(元)</h4>
                        </div>
                    </div>
                    <div class="li-count">
                        <div class="left-count"><i class="iconfont">&#xe64f;</i></div>
                        <div class="right-count">
                            <h3 class="count-numinfo">{{ fineFood.foodItemNum * 3 }}</h3>
                            <h4 class="count-titinfo">商品数量</h4>
                        </div>
                    </div>
                    <div class="li-count">
                        <div class="left-count"><i class="iconfont">&#xe603;</i></div>
                        <div class="right-count">
                            <h3 class="count-numinfo">{{ fineFood.foodDiscount * 3 }}</h3>
                            <h4 class="count-titinfo">优惠金额(元)</h4>
                        </div>
                    </div>
                </div>
            </div>
            <div class="item-count">
                <div class="count-title"><p>优品</p></div>
                <div class="list-count">
                    <div class="li-count">
                        <div class="left-count"><i class="iconfont">&#xe667;</i></div>
                        <div class="right-count">
                            <h3 class="count-numinfo">{{ superProduct.mallOrderNum * 3 }}</h3>
                            <h4 class="count-titinfo">订单数</h4>
                        </div>
                    </div>
                    <div class="li-count">
                        <div class="left-count"><i class="iconfont">&#xe61e;</i></div>
                        <div class="right-count">
                            <h3 class="count-numinfo">{{ superProduct.mallRevenue * 3 }}</h3>
                            <h4 class="count-titinfo">营收金额(元)</h4>
                        </div>
                    </div>
                    <div class="li-count">
                        <div class="left-count"><i class="iconfont">&#xe64f;</i></div>
                        <div class="right-count">
                            <h3 class="count-numinfo">{{ superProduct.mallItemNum * 3 }}</h3>
                            <h4 class="count-titinfo">商品数量</h4>
                        </div>
                    </div>
                    <div class="li-count">
                        <div class="left-count"><i class="iconfont">&#xe603;</i></div>
                        <div class="right-count">
                            <h3 class="count-numinfo">{{ superProduct.mallDiscount * 3 }}</h3>
                            <h4 class="count-titinfo">优惠金额(元)</h4>
                        </div>
                    </div>
                </div>
            </div>
            <div class="item-count">
                <div class="count-title"><p>停车缴费</p></div>
                <div class="list-count">
                    <div class="li-count">
                        <div class="left-count"><i class="iconfont">&#xe613;</i></div>
                        <div class="right-count">
                            <h3 class="count-numinfo">{{ parkPayment.parkingOrderNum }}</h3>
                            <h4 class="count-titinfo">订单数</h4>
                        </div>
                    </div>
                    <div class="li-count">
                        <div class="left-count"><i class="iconfont">&#xe603;</i></div>
                        <div class="right-count">
                            <h3 class="count-numinfo">{{ parkPayment.parkingRevenue }}</h3>
                            <h4 class="count-titinfo">营收金额(元)</h4>
                        </div>
                    </div>
                    <div class="li-count">
                        <div class="left-count"><i class="iconfont">&#xe67e;</i></div>
                        <div class="right-count">
                            <h3 class="count-numinfo">{{ nowParkSpace.used }}</h3>
                            <h4 class="count-titinfo">已用</h4>
                        </div>
                    </div>
                    <div class="li-count">
                        <div class="left-count"><i class="iconfont">&#xe6bd;</i></div>
                        <div class="right-count">
                            <h3 class="count-numinfo">{{ nowParkSpace.overplus }}</h3>
                            <h4 class="count-titinfo">剩余</h4>
                        </div>
                    </div>
                </div>
            </div>
            <div class="item-count">
                <div class="count-title"><p>APP统计</p></div>
                <div class="list-count">
                    <div class="li-count">
                        <div class="left-count"><i class="iconfont">&#xe601;</i></div>
                        <div class="right-count">
                            <h3 class="count-numinfo">{{ appDataList.newUser * 2 }}</h3>
                            <h4 class="count-titinfo">新增用户</h4>
                        </div>
                    </div>
                    <div class="li-count">
                        <div class="left-count"><i class="iconfont">&#xe657;</i></div>
                        <div class="right-count">
                            <h3 class="count-numinfo">{{ appDataList.totalUser }}</h3>
                            <h4 class="count-titinfo">累计用户</h4>
                        </div>
                    </div>
                    <div class="li-count">
                        <div class="left-count"><i class="iconfont">&#xe64d;</i></div>
                        <div class="right-count">
                            <h3 class="count-numinfo">{{ appDataList.dau }}</h3>
                            <h4 class="count-titinfo">日活用户</h4>
                        </div>
                    </div>
                    <div class="li-count">
                        <div class="left-count"><i class="iconfont">&#xe65b;</i></div>
                        <div class="right-count">
                            <h3 class="count-numinfo">{{ appDataList.startupTimes }}</h3>
                            <h4 class="count-titinfo">启动次数</h4>
                        </div>
                    </div>
                </div>
            </div>
            <div class="item-count">
                <div class="count-title"><p>用户量</p></div>
                <div class="list-count">
                    <div class="li-count">
                        <div class="left-count"><i class="iconfont">&#xe601;</i></div>
                        <div class="right-count">
                            <h3 class="count-numinfo">{{ userCount.newRegisteredUser * 3 }}</h3>
                            <h4 class="count-titinfo">新增注册用户</h4>
                        </div>
                    </div>
                    <div class="li-count">
                        <div class="left-count"><i class="iconfont">&#xe64f;</i></div>
                        <div class="right-count">
                            <h3 class="count-numinfo">{{ userCount.allRegisteredUser }}</h3>
                            <h4 class="count-titinfo">累计注册用户</h4>
                        </div>
                    </div>
                </div>
            </div>
            <div class="item-count">
                <div class="count-title"><p>快递</p></div>
                <div class="list-count">
                    <div class="li-count">
                        <div class="left-count"><i class="iconfont">&#xe601;</i></div>
                        <div class="right-count">
                            <h3 class="count-numinfo">{{ expressPayment.expressOrderNum * 3 }}</h3>
                            <h4 class="count-titinfo">寄件订单数量</h4>
                        </div>
                    </div>
                    <div class="li-count">
                        <div class="left-count"><i class="iconfont">&#xe64f;</i></div>
                        <div class="right-count">
                            <h3 class="count-numinfo">{{ expressPayment.expressRevenue * 3 }}</h3>
                            <h4 class="count-titinfo">寄件订单金额</h4>
                        </div>
                    </div>
                    <div class="li-count">
                        <div class="left-count"><i class="iconfont">&#xe64f;</i></div>
                        <div class="right-count">
                            <h3 class="count-numinfo">{{ expressPayment.expressDispatchNum * 3 }}</h3>
                            <h4 class="count-titinfo">派件数量</h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            index: 0,
            value1: '',
            value2: '',
            count: 30,
            state: true,
            dataTime: '',
            dataWeek: '',
            timer: null,
            dataForm: {
                date: '',
            },
            // app的数据
            appDataList: {},
            // 平台的数据
            userCount: {},
            expressPayment: {},
            fineFood: {},
            superProduct: {},
            parkPayment: {},
            nowParkSpace: {},
        };
    },

    activated() {
        this.timer = setInterval(this.countDown, 1000);
        this.showWeek();
        this.getAppData();
        this.getWebData();
    },
    methods: {
        //   加载app的实时数据
        getAppData() {
            this.$http({
                url: this.$http.adornUrl('/v1/statistics/appKeyDatas'),
                method: 'get',
                params: this.$http.adornParams({
                    date: this.dataForm.date,
                }),
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.appDataList = data.data;
                } else {
                    this.appDataList = {};
                }
            });
        },
        //  加载web实时数据
        getWebData() {
            this.$http({
                url: this.$http.adornUrl('/v1/statistics/platformKeyDatas'),
                method: 'get',
                params: this.$http.adornParams({
                    date: this.dataForm.date,
                }),
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.userCount = data.data.userCount;
                    this.fineFood = data.data.fineFood; // 美食
                    this.expressPayment = data.data.expressPayment; // 快递
                    this.superProduct = data.data.superProduct;
                    this.parkPayment = data.data.parkPayment;
                    this.nowParkSpace = data.data.nowParkSpace;
                } else {
                    this.userCount = {};
                    this.fineFood = {};
                    this.superProduct = {};
                    this.parkPayment = {};
                    this.nowParkSpace = {};
                }
            });
        },
        // 改变时间刷新数据
        getTime() {
            this.getAppData();
            this.getWebData();
            this.count = 30;
        },
        //   倒数计30s刷新
        countDown() {
            if (this.count != 0) {
                // 执行请求刷新数据
                this.count--;
            } else {
                this.getAppData();
                this.getWebData();
                this.count = 30;
            }
            this.showTime();
        },
        // 全屏
        fullScreen() {
            this.index = 1;
            this.state = false;
            var docElm = document.documentElement;
            // W3C
            if (docElm.requestFullscreen) {
                docElm.requestFullscreen();
            } else if (docElm.mozRequestFullScreen) {
                // FireFox
                docElm.mozRequestFullScreen();
            } else if (docElm.webkitRequestFullScreen) {
                // Chrome等
                docElm.webkitRequestFullScreen();
            } else if (elem.msRequestFullscreen) {
                // IE11
                elem.msRequestFullscreen();
            }
        },
        exitScreen() {
            this.index = 0;
            this.state = true;
            if (document.exitFullScreen) {
                document.exitFullscreen();
            }
            //          //兼容火狐
            //          console.log(document.mozExitFullScreen)
            if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            }
            //          //兼容谷歌等
            if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
            //          //兼容IE
            if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        },
        getWeek(dayOfWeek) {
            var day;
            switch (dayOfWeek) {
                case 0:
                    day = '日';
                    break;
                case 1:
                    day = '一';
                    break;
                case 2:
                    day = '二';
                    break;
                case 3:
                    day = '三';
                    break;
                case 4:
                    day = '四';
                    break;
                case 5:
                    day = '五';
                    break;
                case 6:
                    day = '六';
                    break;
            }
            return day;
        },
        // 显示当前时间
        showTime() {
            var myDate = new Date();
            var hour = myDate.getHours();
            var minutes = myDate.getMinutes() < 10 ? '0' + myDate.getMinutes() : myDate.getMinutes();
            var second = myDate.getSeconds() < 10 ? '0' + myDate.getSeconds() : myDate.getSeconds();
            this.dataTime = hour + ':' + minutes + ':' + second;
        },
        // 显示当前周几
        showWeek() {
            var myDate = new Date();
            var year = myDate.getFullYear();
            var month = myDate.getMonth() + 1;
            var day = myDate.getDate();
            var dayOfWeek = '星期' + this.getWeek(myDate.getDay());
            this.dataForm.date = year + '-' + month + '-' + day;
            this.dataWeek = year + '年' + month + '月' + day + '日' + ' ' + dayOfWeek;
        },
    },
    deactivated() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    },
};
</script>
<style lang="scss" scoped>
* {
    margin: 0;
    padding: 0;
}

.head_left {
    label {
        color: #333;
    }
}
.item-count {
    display: -webkit-box;
    padding: 0 2% 1%;
    margin-bottom: 1%;
    border-bottom: #ccc 1px dashed;
    .count-title {
        width: 12%;
        p {
            margin-top: 35px;
            padding-left: 20px;
            border-left: 4px solid #ff6600;
            border-radius: 2px;
            color: #333;
        }
    }
    .list-count {
        display: flex;
        // justify-content: space-between;
        flex-wrap: wrap;
        align-content: space-between;
        width: 88%;
        .li-count {
            display: -webkit-box;
            width: 20%;
            height: 100px;
            margin-right: 5%;
            border-radius: 6px;
            overflow: hidden;
            .left-count {
                width: 35%;
                text-align: center;
                line-height: 100px;
                background-color: rgb(45, 140, 240);
                overflow: hidden;
                i {
                    font-size: 36px;
                    color: #fff;
                }
            }
            .right-count {
                width: 65%;
                color: #ff6600;
                text-align: center;
                background-color: #efeff7;
                overflow: hidden;
                .count-numinfo {
                    margin-top: 16px;
                    font-size: 30px;
                    line-height: 40px;
                }
                .count-titinfo {
                    font-size: 14px;
                    line-height: 30px;
                }
            }
        }
        .li-count:nth-child(2) {
            .left-count {
                background-color: rgb(25, 190, 107);
            }
        }
        .li-count:nth-child(3) {
            .left-count {
                background-color: rgb(255, 153, 0);
            }
        }
        .li-count:nth-child(4) {
            .left-count {
                background-color: rgb(237, 63, 20);
            }
        }
    }
}
.maxbox.isActive {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
    z-index: 2000;
}

.maxbox {
    width: 100%;
    height: 100%;
    font-size: 26px;
    background-color: #fff;
    /* 标准的语法 */
    .iframe-con {
        height: 398px;
        overflow: hidden;
    }
    .header {
        display: flex;
        justify-content: space-between;
        padding: 20px 0;
        border-bottom: #ccc 1px dashed;
        margin-bottom: 1%;
        font-size: 20px;
        .head_right {
            margin-right: 30px;
            display: flex;
            .head_creen {
                margin-left: 10px;
                cursor: pointer;
            }
        }
        .head_left {
            margin-left: 30px;
        }
    }
    .data_count {
        ul:nth-child(1) {
            margin-top: 10px;
        }
        ul {
            border-top: 1px solid #999;
            padding: 10px 0;
            li {
                display: flex;
                justify-content: space-between;
                padding: 10px 0;
                span {
                    width: 20%;
                    i {
                        font-style: normal;
                        margin-left: 30px;
                    }
                }
            }
        }
    }
}
</style>
