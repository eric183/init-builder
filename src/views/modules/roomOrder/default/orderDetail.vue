<template>
    <!-- 会议室/预约订单 -->
    <el-dialog :title="'详情'" :close-on-click-modal="false" :visible.sync="visible">
        <div class="roomorder">
            <p>
                <label>当前支付状态：</label> <span>{{ orderStatusTxt(dataObj.payStatus) }}</span>
            </p>
            <p><el-button size="small" v-if="dataObj.payStatus == 2" type="success" @click="refund(dataObj.orderId)">退款处理</el-button></p>
        </div>
        <ul>
            <li><span>下单时间</span> <span>用户账号</span> <span>预订日期</span> <span>预订时间</span> <span>用户备注</span></li>
            <li class="dataDetail">
                <span>{{ dataObj.payTime }}</span> <span>{{ dataObj.userAccount }}</span> <span>{{ dataObj.bookDate }}</span> <span>{{ dataObj.bookTime }}</span> <span></span>
            </li>
        </ul>
        <!-- <div>
        预订详情
    </div>
    <ul>
          <li>
            <span>会议室图片</span>
            <span>会议室名称</span>
            <span>容纳人数</span>
            <span>付费标准</span>
            <span>预订时长</span>
            <span>价格</span>
          </li>
          <li class="dataDetail">
            <span>{{dataObj.payTime}}</span>
            <span>{{dataObj.roomName}}</span>
            <span>{{dataObj.size}}</span>
            <span>{{dataObj.payTime}}</span>
            <span>{{dataObj.payTime}}</span>
            <span>{{dataObj.payTime}}</span>
          </li>
      </ul> -->
        <span slot="footer" class="dialog-footer"> <el-button size="small" type="primary" @click="confir()">确定</el-button> </span>
    </el-dialog>
</template>

<script>
import {commonFunc,commonFunc2} from '@/utils/resources/index.js';
export default {
    data() {
        return {
            // 表格数据展示
            dataList: [],
            visible: false,
            dataObj: {},
        };
    },
    methods: {
        init(obj) {
            this.visible = true;
            console.log(obj);
            this.dataObj = obj;
            this.dataObj.payTime = commonFunc(obj.payTime);
            this.dataObj.bookDate = commonFunc2(obj.bookDate);
            this.dataObj.bookTime = obj.startAt + ':00' + '  至  ' + obj.endAt + ':00';
        },
        // 退款处理
        refund(orderId) {
            this.$confirm(`确定进行退款操作?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    this.$http({
                        url: this.$http.adornUrl('/v1/meet/orders/' + orderId + '/refunds'),
                        method: 'post',
                    }).then(({data}) => {
                        if (data.code == 201) {
                            this.$message.success('退款成功');
                            this.$emit('refreshDataList');
                            this.visible = false;
                        }
                    });
                })
                .catch(() => {});
        },
        confir() {
            this.visible = false;
        },
        orderStatusTxt(item) {
            switch (item) {
                case 1:
                    return '待支付';
                    break;
                case 2:
                    return '已支付';
                    break;
                case 3:
                    return '已退款';
                    break;
            }
        },
    },
};
</script>
<style lang="scss" scoped>
.roomorder {
    display: flex;
    justify-content: space-between;
    span {
        color: #67c23a;
    }
}
ul {
    li {
        display: flex;
        span {
            width: 25%;
            text-align: center;
            border: 1px solid #ebeef5;
            padding: 10px 0;
        }
    }
    .dataDetail {
        span {
            border-top: 0;
        }
    }
}
</style>
