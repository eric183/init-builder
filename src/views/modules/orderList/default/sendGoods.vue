<template>
    <el-dialog title="发货" :close-on-click-modal="false" :visible.sync="visible">
        <el-form :model="dataForm" ref="dataForm" :rules="dataRule" label-width="80px" size="small">
            <!-- 发货 -->
            <el-form-item label="选择类型" prop="radio">
                <el-radio v-model="dataForm.radio" label="1">直接派送</el-radio>
                <el-radio v-model="dataForm.radio" label="2">物流服务</el-radio>
            </el-form-item>
            <div v-if="dataForm.radio == '2'">
                <el-form-item label="物流公司" prop="expressCompanyName">
                    <div class="express_company">
                        <el-input placeholder="请输入内容" v-model="dataForm.expressCompanyName" class="input-with-select">
                            <el-select v-model="dataForm.expressCompanyName" placeholder="请选择" slot="prepend">
                                <el-option v-for="item in expressCompanyList" :key="item.id" :label="item.name" :value="item.name"></el-option>
                            </el-select>
                        </el-input>
                    </div>
                </el-form-item>
                <el-form-item label="物流单号" prop="expressOrderSn"> <el-input v-model="dataForm.expressOrderSn" placeholder="请输入物流单号" clearable></el-input> </el-form-item>
            </div>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="visible = false">取消</el-button>
            <el-button size="small" type="primary" @click="dataFormSubmit()">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    data() {
        return {
            visible: false,
            dataForm: {
                radio: '1',
                expressCompanyName: '',
                expressOrderSn: '',
                name: '',
            },
            orderId: null,
            expressCompanyList: [],
            dataRule: {
                expressCompanyName: [{required: true, message: '必填', trigger: 'blur'}],
                expressOrderSn: [{required: true, message: '必填', trigger: 'blur'}],
            },
        };
    },
    methods: {
        init(id) {
            this.visible = true;
            this.orderId = id;
            this.$nextTick(() => {
                this.$refs['dataForm'].resetFields();
            });
            this.getCompany();
        },
        // 查询物流公司的下拉数据
        getCompany() {
            this.$http({
                url: this.$http.adornUrl2('/v1/transaction/expressCompanies'),
                method: 'get',
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.expressCompanyList = data.data.companies;
                }
            });
        },
        // 确认发货
        dataFormSubmit() {
            this.$refs['dataForm'].validate(valid => {
                if (valid) {
                    this.$http({
                        url: this.$http.adornUrl2('/v1/transaction/orders/' + this.orderId),
                        method: 'put',
                        data: this.$http.adornData(
                            this.dataForm.radio == 2
                                ? {
                                      type: 4,
                                      expressOrderSn: this.dataForm.expressOrderSn,
                                      expressCompanyName: this.dataForm.expressCompanyName,
                                  }
                                : {type: 4}
                        ),
                    }).then(({data}) => {
                        if (data && data.code === 201) {
                            this.$message({
                                message: '操作成功',
                                type: 'success',
                                duration: 1500,
                                onClose: () => {
                                    this.visible = false;
                                    this.$emit('refreshDataList');
                                },
                            });
                        }
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
