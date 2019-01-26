<template>
    <div class="billdetail">
        <div class="head">
            <h1>{{ billTitle }}</h1>
            <p class="top_title">
                <label>客户名称:</label>
                <el-input placeholder="请输入公司" v-model="companyName" size="small" :readonly="true"></el-input>
            </p>
            <p class="top_title">
                <label>房间代码:</label>
                <el-input placeholder="请输入公司" v-model="doorplate" size="small"></el-input>
            </p>
            <!-- <p class="goback">
            <el-button type="primary" size="small" @click="$router.go(-1)">返回</el-button>
        </p> -->
        </div>
        <div>
            <ul class="datatable">
                <li>
                    <span>项目名称</span> <span>上月读数</span> <span>本月读数</span> <span>本月用量</span> <span>标准单价</span> <span>本月费用</span> <span>往月欠交</span> <span>滞纳金</span>
                    <span>应交合计</span>
                </li>
                <li v-for="(item, index) in dataList" :key="index">
                    <span>{{ item.name }}</span> <span>{{ item.previousValue }}</span> <span>{{ item.currentValue }}</span> <span>{{ item.usedValue }}</span> <span>{{ item.unitPrice / 100 }}</span>
                    <span>{{ item.currentFee / 100 }}</span> <span>{{ item.formerArrearage / 100 }}</span> <span>{{ item.delayCharge / 100 }}</span> <span>{{ item.payableFee / 100 }}</span>
                </li>
                <li class="total_small">
                    <span class="span_border">合计金额小写:</span> <span class="span_border"></span> <span class="span_border"></span> <span class="span_border"></span> <span></span>
                    <span>{{ totalcurrentFee / 100 }}</span> <span>{{ totalformerArrearage / 100 }}</span> <span>{{ totaldelayCharge / 100 }}</span> <span>{{ propertyFee / 100 }}</span>
                </li>
                <li class="total_big">
                    <span>合计金额大写:</span> <span>{{ propertyFeeChn }}</span>
                </li>
                <li class="remark">备注:</li>
                <li class="last"><el-input type="textarea" :rows="6" v-model="remark"></el-input></li>
            </ul>
            <p class="sub">
                <el-button type="primary" size="small" @click="$router.go(-1)">返回</el-button>
                <el-button type="success" size="small" @click="sub()">提交</el-button>
            </p>
        </div>
    </div>
</template>

<script>
import commonFunc from '@/assets/common.js';
export default {
    data() {
        return {
            billId: null,
            dataList: [],
            companyName: '',
            doorplate: '', //门牌信息
            remark: '',
            propertyFeeChn: '', //金额大写
            billTitle: '', //账单标题
            propertyFee: 0,
            totalcurrentFee: 0,
            totalformerArrearage: 0,
            totaldelayCharge: 0,
        };
    },
    activated() {
        this.billId = this.$route.query.billId; //路由跳转拿到参数
        this.getDataList();
    },
    methods: {
        // 获取数据列表
        getDataList() {
            this.$http({
                url: this.$http.adornUrl('/v2/pm/property/bills/' + this.billId),
                method: 'get',
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.dataList = data.data.details;
                    this.companyName = data.data.companyName;
                    this.doorplate = data.data.doorplate;
                    this.remark = data.data.remark;
                    this.propertyFee = data.data.propertyFee;
                    this.propertyFeeChn = data.data.propertyFeeChn;
                    this.billTitle = data.data.billTitle;
                    // 本月费用合计
                    this.totalcurrentFee = 0;
                    this.totalformerArrearage = 0;
                    this.totaldelayCharge = 0;
                    for (var i in this.dataList) {
                        this.totalcurrentFee += Number(this.dataList[i].currentFee);
                    }
                    // 往月欠交合计
                    for (var i in this.dataList) {
                        this.totalformerArrearage += Number(this.dataList[i].formerArrearage);
                    }
                    // 滞纳金合计
                    for (var i in this.dataList) {
                        this.totaldelayCharge += Number(this.dataList[i].delayCharge);
                    }
                } else {
                    this.dataList = [];
                }
            });
        },
        //   提交
        sub() {
            this.$http({
                url: this.$http.adornUrl(`/v2/pm/property/bills/` + this.billId),
                method: 'put',
                data: this.$http.adornData({
                    doorplate: this.doorplate,
                    remark: this.remark,
                }),
            }).then(({data}) => {
                if (data && data.code === 201) {
                    this.$message({
                        message: '操作成功',
                        type: 'success',
                        duration: 1500,
                        onClose: () => {
                            this.getDataList();
                        },
                    });
                }
            });
        },
    },
};
</script>
<style scoped>
.last >>> .el-textarea__inner {
    border: 0;
}
.top_title >>> .el-input__inner {
    border: 0;
}
</style>
