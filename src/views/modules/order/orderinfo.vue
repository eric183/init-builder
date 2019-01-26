<template>
    <div class="order">
        <!-- 订单详情 -->
        <div class="order-list">
            <div class="order-top">
                <div class="order-status">
                    <div class="status-txt">
                        <div class="status-txtinfo">
                            <label>当前订单状态：</label> <span>{{ orderStatusTxt(tableData.orderStatus) }}</span>
                        </div>
                        <div class="status-txtinfo" v-show="closeDesc(tableData.orderStatus)">
                            <label>订单关闭原因：</label> <span>{{ tableData.closedTypeDesc }}</span>
                        </div>
                    </div>
                    <div class="status-operation">
                        <el-button size="mini" type="success" @click="$router.go(-1)">返回列表</el-button>
                        <el-button type="primary" size="mini" @click="orderOpreation(tableData.orderStatus, 1)" v-if="isAuth('transaction:orders:updateOrder')" v-show="btnShow(tableData.orderStatus)">
                            {{ btnTxtBtn(tableData.orderStatus) }}
                        </el-button>
                        <el-button
                            type="danger"
                            size="mini"
                            @click="orderOpreation(tableData.orderStatus, 2)"
                            v-if="isAuth('transaction:orders:updateOrder')"
                            v-show="btnShowInfo(tableData.orderStatus)"
                        >
                            {{ btnTxt(tableData.orderStatus) }}
                        </el-button>
                    </div>
                </div>
                <ul class="order-info">
                    <li>
                        <p class="order-title">订单编号</p>
                        <p class="order-txt">{{ tableData.orderSn }}</p>
                    </li>
                    <li>
                        <p class="order-title">下单时间</p>
                        <p class="order-txt">{{ tableData.orderTime }}</p>
                    </li>
                    <li>
                        <p class="order-title">付款时间</p>
                        <p class="order-txt">{{ tableData.payTime }}</p>
                    </li>
                    <li>
                        <p class="order-title">付款方式</p>
                        <p class="order-txt">{{ tableData.payType }}</p>
                    </li>
                    <li>
                        <p class="order-title">用户账号</p>
                        <p class="order-txt">{{ tableData.userAccount }}</p>
                    </li>
                </ul>
            </div>
            <div class="order-good">
                <p class="order-text">商品信息:</p>
                <el-table :data="orderDetails" itemscope style="width: 100%">
                    <el-table-column align="center" prop="coverImg" label="商品图片" min-width="100">
                        <template slot-scope="scope">
                            <img :src="scope.row.coverImg" alt="" style="width: auto;height: 50px" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="goodsName" label="商品名称" align="center"> </el-table-column>
                    <el-table-column prop="salePrice" label="销售价(元)" align="center"> </el-table-column>
                    <el-table-column prop="discountPrice" label="活动价(元)" align="center"> </el-table-column>
                    <el-table-column prop="goodsNum" label="购买数量" align="center"> </el-table-column>
                    <el-table-column :formatter="totalMoney" label="小计" align="center"> </el-table-column>
                </el-table>
                <div class="order-total">
                    <span class="total-deliver"
                        >配送费: <em>{{ deliveryPrice }}</em>
                    </span>
                    <span class="total-money"
                        >合计: <em>{{ payPrice }}</em>
                    </span>
                </div>
            </div>
            <div class="order-person logistics">
                <p class="order-text">收货人信息:</p>
                <ul class="order-info order-person mt0">
                    <li>
                        <p class="order-title">联系人</p>
                        <p class="order-txt">{{ tableData.receiverName }}</p>
                    </li>
                    <li>
                        <p class="order-title">联系电话</p>
                        <p class="order-txt">{{ tableData.receiverContact }}</p>
                    </li>
                    <li>
                        <p class="order-title">送货地址</p>
                        <p class="order-txt">{{ tableData.receiverAddress }}</p>
                    </li>
                    <li>
                        <p class="order-title">用户留言信息</p>
                        <p class="order-txt">{{ tableData.customerRemark }}</p>
                    </li>
                </ul>
            </div>
            <div class="order-person logistics" v-if="tableData.expressOrderSn || tableData.expressCompanyName" key="receiverName">
                <p class="order-text">物流信息:</p>
                <ul class="order-info order-person mt0">
                    <li>
                        <p class="order-title">快递公司</p>
                        <p class="order-txt">{{ tableData.expressCompanyName }}</p>
                    </li>
                    <li>
                        <p class="order-title">快递单号</p>
                        <p class="order-txt">{{ tableData.expressOrderSn }}</p>
                    </li>
                </ul>
            </div>
        </div>
        <el-dialog title="原因" :visible.sync="dialogVisible" @close="closeFun" width="30%">
            <el-form label-width="50px">
                <div class="dialogbox">
                    <el-form-item label="原因"> <el-input type="textarea" v-model="textarea" :autosize="{minRows: 2, maxRows: 4}" placeholder="请输入原因"> </el-input> </el-form-item>
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="refund">确 定</el-button>
            </span>
        </el-dialog>
        <sendGoods ref="sendGoods" @refreshDataList="orderList"></sendGoods>
    </div>
</template>

<script>
import commonFunc from '@/assets/common.js';
import sendGoods from './sendGoods';
export default {
    components: {
        sendGoods,
    },
    data() {
        return {
            orderId: null, //订单id
            tableData: [], //订单详情
            orderDetails: [], //购买商品列表
            dialogVisible: false,
            orderType: {},
            textarea: '', //订单关闭
            refundState: false, //退款处理（运营角色看不到退款处理）
            orderIsNum: null, //退款等按钮的点击的状态--用来打开原因的弹框的
        };
    },
    methods: {
        //
        closeDesc(item) {
            if (item === 6) {
                return true;
            } else {
                return false;
            }
        },
        orderStatusTxt(item) {
            switch (item) {
                case 1:
                    return '待付款';
                    break;
                case 2:
                    return '待接单';
                    break;
                case 3:
                    return '待发货';
                    break;
                case 4:
                    return '待收货';
                    break;
                case 5:
                    return '已完成';
                    break;
                case 6:
                    return '已关闭';
                    break;
                default:
                    return '';
                    break;
            }
        },
        //立即接单--订单发货--退款处理
        btnTxtBtn(item) {
            if (item === 2) {
                return '立即接单';
            } else if (item === 3) {
                return '订单发货';
            } else if (item === 5) {
                return '退款处理';
            }
        },
        //拒绝接单--取消订单
        btnTxt(item) {
            if (item === 2) {
                return '拒绝接单';
            } else if (item === 3) {
                return '取消订单';
            } else {
                return '123';
            }
        },
        btnShow(item) {
            if (item == 2) {
                return true;
            } else if (item == 3) {
                return true;
            } else if (item == 5) {
                return true;
            }
            return false;
        },
        btnShowInfo(item) {
            if (item == 2) {
                return true;
            } else if (item == 3) {
                return true;
            }
            // return false;
        },

        //立即接单--订单发货--退款处理事件
        orderOpreation(item, type) {
            const that = this;
            if (type === 1) {
                if (item === 2) {
                    this.orderType.type = 1;
                    //console.log('--立即接单--')
                    this.orderDispose(this.orderId, this.orderType);
                } else if (item === 3) {
                    this.orderType.type = 4;
                    this.$refs.sendGoods.init(this.orderId);

                    //console.log('--订单发货--')
                    //this.orderDispose(this.orderId, this.orderType);
                } else {
                    //console.log('--退款处理--')
                    this.orderIsNum = 5;
                    this.dialogVisible = true;
                }
            } else {
                if (item === 2) {
                    //console.log('--拒绝接单--')
                    this.orderType.type = 2;
                    this.orderIsNum = 2;
                    this.dialogVisible = true;
                } else if (item === 3) {
                    //console.log('--取消订单--')
                    this.orderType.type = 3;
                    this.orderIsNum = 3;
                    this.dialogVisible = true;
                }
            }
        },
        //订单处理
        orderDispose(item, typeObj) {
            //console.log(item,typeObj)
            const that = this;
            that.$http.put(this.$http.adornUrl2('/v1/transaction/orders/' + item), typeObj).then(res => {
                //console.log(res.data)
                if (res.data.code == 201) {
                    that.orderList();
                    that.dialogVisible = false;
                }
            });
        },
        refund() {
            //console.log('--退款处理--')
            //console.log(this.orderIsNum);
            if (this.orderIsNum == 5) {
                this.orderType.type = 5;
            }
            if (this.orderIsNum == 3) {
                this.orderType.type = 3;
            }
            if (this.orderIsNum == 2) {
                this.orderType.type = 2;
            }
            if (this.textarea.length == 0) {
                this.$message({
                    type: 'error',
                    message: '请输入原因!',
                });
                return false;
            } else {
                this.orderType.reason = this.textarea;
                this.orderDispose(this.orderId, this.orderType);
            }
        },
        // 退款等原因的弹框关闭的回调事件--情况弹框
        closeFun() {
            this.textarea = '';
        },
        //订单详情
        orderList() {
            const that = this;
            //  that.orderId
            this.$http
                .get(this.$http.adornUrl2('/v1/transaction/orders/' + that.orderId + '/details'))
                .then(res => {
                    //console.log(res.data)
                    that.tableData = res.data.data;
                    that.tableData.orderTime = commonFunc.commonFunc(that.tableData.orderTime);
                    that.tableData.payTime = commonFunc.commonFunc(that.tableData.payTime);
                    //订单状态
                    const status = that.tableData.orderStatus;
                    //付款方式
                    if (that.tableData.payType === 10) {
                        that.tableData.payType = '微信支付';
                    } else if (that.tableData.payType === 20) {
                        that.tableData.payType = '支付宝支付';
                    } else {
                        that.tableData.payType = '';
                    }
                    //商品小计
                    that.orderDetails = that.tableData.orderDetails;
                    for (let i = 0; i < that.orderDetails.length; i++) {
                        that.orderDetails[i].discountPrice = that.orderDetails[i].discountPrice / 100;
                        that.orderDetails[i].salePrice = that.orderDetails[i].salePrice / 100;
                    }
                })
                .catch(function(error) {
                    that.$message.error(error);
                });
        },
        //小计金额
        totalMoney(item) {
            return this.$math.format(
                this.$math
                    .chain(this.$math.bignumber(item.discountPrice))
                    .multiply(this.$math.bignumber(item.goodsNum))
                    .done()
            );
        },
        // 从本地存储取出店铺id和角色信息
        getShopInfo() {
            this.shops = JSON.parse(sessionStorage.getItem('shops') || '[]');
            // 店主的角色
            if (this.shops.length > 0) {
                this.refundState = true;
            } else {
                this.refundState = false; //运营的身份
            }
        },
    },
    computed: {
        //配送金额
        deliveryPrice() {
            const price = '￥' + this.tableData.deliveryFee / 100;
            return price;
        },
        //合计金额
        payPrice() {
            const payPrice = '￥' + this.tableData.payAmount / 100;
            return payPrice;
        },
        discountPrice() {
            return this.orderDetails.discountPrice / 100;
        },
    },
    activated() {
        this.orderId = this.$route.query.orderId;
        this.getShopInfo();
        this.orderList();
    },
};
</script>
<style lang="stylus" scoped>
.order >>> .el-table td, .order >>> .el-table th {
  border-left: 1px solid #ebeef5;
}

.order >>> .el-table td:last-child {
  border-right: 1px solid #ebeef5;
}

.order >>> .el-table th:nth-child(6) {
  border-right: 1px solid #ebeef5;
}

.order >>> .el-table thead.is-group th {
  background: #fff;
}

.order {
  .order-status {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    padding: 10px 30px;
    height: 60px;
    line-height: 60px;
    background: #fff;

    .status-txtinfo {
      display: inline-block;
      margin-right: 40px;

      label {
        font-size: 14px;
      }

      span {
        color: #67c23a;
        font-size: 14px;
      }
    }
  }

  .order-info {
    overflow: hidden;
    margin-bottom: 20px;
    background: #fff;
    text-align: center;
    display: flex;
    justify-content: space-between;
    padding: 0;

    li {
      font-size: 12px;
      width: 20%;
      height: 80px;
      border: 1px solid #ebeef5;
      color: #909399;
      font-weight: 600;

      p {
        line-height: 40px;
        margin: 0;
      }

      p:last-child {
        overflow: hidden;
        padding: 0 15px;
        text-overflow: ellipsis;
        font-weight: 400;
        border-top: 1px solid #ebeef5;
      }
    }
  }

  .order-person {
    border-top: none;

    li:first-child {
      width: 250px;
    }

    li:nth-child(2) {
      width: 350px;
    }

    li:nth-child(3) {
      width: 600px;
    }

    li:nth-child(4) {
      width: 488px;
    }
  }

  .order-text {
    height: 50px;
    line-height: 50px;
    padding-left: 30px;
    font-size: 14px;
    border: 1px solid #ebeef5;
    background: #fff;
    margin-bottom: 0;
  }

  .order-good {
    margin-bottom: 20px;

    .order-total {
      background: #fff;
      height: 50px;
      line-height: 50px;
      text-align: right;

      span {
        margin-right: 50px;
        color: #666;
      }

      em {
        font-style: normal;
        font-weight: 700px;
        margin-left: 5px;
        color: #666;
      }
    }
  }
}

.logistics {
  li {
    width: 50% !important;
    border-top: 0 !important;
  }
}
</style>
