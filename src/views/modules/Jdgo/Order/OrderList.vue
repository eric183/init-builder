<template>
    <el-row>
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" size="small">
            <el-form-item> <el-input style="width:200px" v-model="dataForm.jdOrderChild" placeholder="京东订单编号/平台订单编号" clearable></el-input> </el-form-item>
            <el-form-item> <el-input v-model="dataForm.receiverName" placeholder="收货人姓名" clearable></el-input> </el-form-item>
            <el-form-item> <el-input v-model="dataForm.receiverContact" placeholder="收货人手机号" clearable></el-input> </el-form-item>
            <el-form-item> <el-input v-model="dataForm.userPhone" placeholder="下单人手机号" clearable></el-input> </el-form-item>
            <el-form-item label="订单状态查询:" class="ml10">
                <el-select v-model="dataForm.status"> <el-option v-for="item in orderTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option> </el-select>
            </el-form-item>
            <el-form-item> <el-button type="primary" @click="getDataListFun()">查询</el-button> </el-form-item>
        </el-form>
        <el-table :data="dataList" border style="width: 100%;">
            <el-table-column type="index" header-align="center" align="center" label="序号"> </el-table-column>
            <el-table-column v-for="(item, index) in tableCof" :key="index" :prop="item.prop" :width="item.width" header-align="center" align="center" :label="item.label">
                <template slot-scope="scope">
                    <el-row v-if="item.type == 'price'">
                        <span>{{ scope.row[item.prop] | newPrice }}</span>
                    </el-row>
                    <el-row v-else-if="item.type == 'timeFormate'">
                        <span>{{ scope.row[item.prop] | timeFormate }}</span>
                    </el-row>
                    <el-row v-else-if="item.type == 'status'">
                        <span>{{ scope.row[item.prop] | orderStatus }}</span>
                    </el-row>
                    <el-row v-else-if="item.type == 'payType'">
                        <span>{{ scope.row[item.prop] | payType }}</span>
                    </el-row>
                    <el-row v-else>
                        <span>{{ scope.row[item.prop] }}</span>
                    </el-row>
                </template>
            </el-table-column>
            <el-table-column header-align="center" align="center" width="100" label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" plain size="mini" @click="$router.push({name: 'Order-OrderInfo', query: {id: scope.row.jdOrderChild}})">详情</el-button>
                    <!-- <el-button type="success" v-if="scope.row.status==2" plain size="mini" @click="sendGoods">发货</el-button> -->
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="pageNum"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
        >
        </el-pagination>
    </el-row>
</template>

<script>
export default {
    data() {
        return {
            dataForm: {
                status: null,
                jdOrderChild: '',
                receiverName: '',
                receiverContact: '',
                userPhone: '',
            },
            dataList: [],
            dataListLoading: false,
            pageNum: 1,
            pageSize: 10,
            total: 0,
            orderTypeList: [
                {value: null, label: '全部'},
                {value: 1, label: '待支付'},
                {value: 2, label: '待发货'},
                {value: 3, label: '待收货'},
                {value: 4, label: '已完成'},
                {value: 5, label: '已关闭'},
            ],
            tableCof: [
                {
                    label: '京东订单编号',
                    prop: 'jdOrderChild',
                },
                {
                    label: '平台订单编号',
                    prop: 'orderSn',
                },
                {
                    label: '下单时间',
                    prop: 'orderTime',
                    type: 'timeFormate',
                    width: '140',
                },
                {
                    label: '付款时间',
                    prop: 'payTime',
                    type: 'timeFormate',
                },
                {
                    label: '收件人',
                    prop: 'receiverName',
                },
                {
                    label: '收件人电话',
                    prop: 'receiverContact',
                },
                {
                    label: '下单人手机号',
                    prop: 'userPhone',
                },
                {
                    label: '订单总额/元',
                    prop: 'totalAmount',
                    type: 'price',
                },
                {
                    label: '快递费/元',
                    prop: 'deliveryFee',
                    type: 'price',
                },
                {
                    label: '订单状态',
                    prop: 'status',
                    type: 'status',
                },
                {
                    label: '支付方式',
                    prop: 'payType',
                    type: 'payType',
                },
            ],
        };
    },
    activated() {
        this.getDataList();
    },
    methods: {
        getDataListFun() {
            this.pageNum = 1;
            this.getDataList();
        },
        // 获取数据列表
        getDataList() {
            this.dataListLoading = true;
            this.$http({
                url: this.$http.adornUrl5('/v1/tra/orders'),
                method: 'get',
                params: this.$http.adornParams(
                    Object.assign(this.dataForm, {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    })
                ),
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.dataList = data.data.list;
                    this.total = data.data.total;
                }
            });
        },
        // 每页数
        sizeChangeHandle(val) {
            this.pageSize = val;
            this.getDataList();
        },
        // 当前页
        currentChangeHandle(val) {
            this.pageNum = val;
            this.getDataList();
        },
        // 发货
        sendGoods() {
            this.$message.success('发货功能开发中');
        },
    },
};
</script>
<style lang="scss" scoped>
.table_expand {
    display: flex;
    justify-content: space-around;
    .table_box {
        padding: 10px 0;
        width: 20%;
        text-align: center;
        label {
            color: #99a9bf;
        }
        span {
            margin-left: 20px;
        }
        .el-switch {
            margin-left: 20px;
        }
    }
}
</style>
