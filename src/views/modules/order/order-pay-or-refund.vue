<template>
    <el-dialog :title="dataForm.id == 2 ? '已支付' : '已退款'" :close-on-click-modal="false" :visible.sync="visible">
        <el-form :model="dataForm" ref="dataForm" :rules="dataRule" label-width="80px" size="small">
            <el-form-item label="选择店铺" prop="shopId">
                <el-select v-model="dataForm.shopId" style="width:350px">
                    <el-option value="全部">全部</el-option>
                    <el-option v-for="item in shopList" :key="item.shopId" :label="item.shopName" :value="item.shopId"> </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="选择时间" prop="searchDate">
                <el-date-picker v-model="dataForm.searchDate" type="daterange" value-format="yyyy-MM-dd" unlink-panels range-separator="-" start-placeholder="开始" end-placeholder="结束">
                </el-date-picker>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="visible = false">取消</el-button>
            <el-button size="small" type="primary" @click="dataFormSubmit()">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import {download} from '../customized/customized';
export default {
    data() {
        return {
            dataForm: {
                id: null,
                shopId: '',
                searchDate: '',
            },
            visible: false,
            shopList: [],
            dataRule: {
                shopId: [{required: true, message: '必填', trigger: 'blur'}],
                searchDate: [{required: true, message: '必填', trigger: 'blur'}],
            },
        };
    },
    methods: {
        init(id) {
            this.visible = true;
            this.dataForm.id = id;
            this.$nextTick(() => {
                this.$refs['dataForm'].resetFields();
            });
            this.getShopList();
        },
        // 查看店铺下拉列表
        getShopList() {
            this.$http.get(this.$http.adornUrl2('/v1/merchant/shops/options')).then(res => {
                if (res.data.code === 200) {
                    this.shopList = res.data.data.options;
                }
            });
        },
        // 确认发货
        dataFormSubmit() {
            this.$refs['dataForm'].validate(valid => {
                if (valid) {
                    this.$http({
                        url: this.$http.adornUrl2('/v1/transaction/orders/excels'),
                        method: 'get',
                        responseType: 'blob',
                        params: this.$http.adornParams({
                            shopId: this.dataForm.shopId == '全部' ? undefined : this.dataForm.shopId,
                            minTime: this.dataForm.searchDate[0],
                            maxTime: this.dataForm.searchDate[1],
                            payStatus: this.dataForm.id,
                        }),
                    })
                        .then(response => {
                            download(response.data, '订单.xls');
                        })
                        .catch(err => {
                            console.log(err);
                        });
                }
            });
        },
    },
};
</script>
<style scoped>
.express_company {
    display: flex;
}
</style>
