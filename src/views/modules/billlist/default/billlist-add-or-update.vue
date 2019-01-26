<template>
    <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
        <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter.native="dataFormSubmit()" label-width="100px" size="small" label-position="top">
            <div class="box box1">
                <el-form-item label="账单日期" prop="billDate"> <el-date-picker v-model="dataForm.billDate" type="month" value-format="yyyy-MM" placeholder="选择月"> </el-date-picker> </el-form-item>
                <el-form-item label="企业名称" v-show="!this.dataForm.id">
                    <el-select v-model="dataForm.companyId" placeholder="选择企业" :filterable="true" @change="selectGet">
                        <el-option v-for="item in companylist" :key="item.companyId" :label="item.name" :value="item.companyId"></el-option>
                    </el-select>
                </el-form-item>
                <span class="zhanwei1"></span>
            </div>
            <div class="box">
                <el-form-item label="项目名称" prop="name"> <el-input v-model="dataForm.name" :max="30"></el-input> </el-form-item>
                <el-form-item label="标准单价" prop="unitPrice"> <el-input v-model="dataForm.unitPrice" placeholder="1.00"></el-input> </el-form-item>
                <span class="zhanwei"></span>
            </div>
            <div class="box">
                <el-form-item label="上月读数" prop="previousValue"> <el-input v-model="dataForm.previousValue"></el-input> </el-form-item>
                <el-form-item label="本月读数" prop="currentValue"> <el-input v-model="dataForm.currentValue"></el-input> </el-form-item>
                <span class="zhanwei"></span>
            </div>
            <div class="box">
                <el-form-item label="本月费用" prop="currentFee"> <el-input v-model="dataForm.currentFee"></el-input> </el-form-item>
                <el-form-item label="往月欠缴" prop="formerArrearage"> <el-input v-model="dataForm.formerArrearage"></el-input> </el-form-item>
                <el-form-item label="滞纳金" prop="delayCharge"> <el-input v-model="dataForm.delayCharge"></el-input> </el-form-item>
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
                id: 0,
                companyId: null,
                billDate: '',
                previousValue: '',
                usedValue: '',
                currentValue: '',
                name: '',
                unitPrice: '',
                currentFee: '',
                formerArrearage: '',
                delayCharge: '',
                companyName: '',
            },
            companylist: [],
            dataRule: {
                companyId: [{required: true, message: '请选择公司', trigger: 'blur'}],
                name: [{required: true, message: '请输入收费项目', trigger: 'blur'}],
                unitPrice: [{required: true, message: '请输入标准单价', trigger: 'blur'}],
                currentFee: [{required: true, message: '请输入本期费用', trigger: 'blur'}],
                comment: [{min: 2, max: 50, message: '请输入收费项目', trigger: 'blur'}],
            },
        };
    },

    methods: {
        init(id) {
            this.dataForm.id = id || 0;
            this.visible = true;
            this.$nextTick(() => {
                this.$refs['dataFormRef'].resetFields();
                if (this.dataForm.id) {
                    this.$http({
                        url: this.$http.adornUrl(`/v2/pm/property/details/` + this.dataForm.id),
                        method: 'get',
                    }).then(({data}) => {
                        if (data && data.code === 200) {
                            this.dataForm.name = data.data.name;
                            this.dataForm.billDate = data.data.billDate;
                            this.dataForm.currentValue = data.data.currentValue;
                            this.dataForm.previousValue = data.data.previousValue;
                            this.dataForm.usedValue = data.data.currentValue - data.data.previousValue;
                            this.dataForm.unitPrice = data.data.unitPrice / 100;
                            this.dataForm.formerArrearage = data.data.formerArrearage / 100;
                            this.dataForm.payableFee = data.data.payableFee / 100;
                            this.dataForm.delayCharge = data.data.delayCharge / 100;
                            this.dataForm.currentFee = data.data.currentFee / 100;
                        }
                    });
                } else {
                    //   企业列表
                    this.$http({
                        url: this.$http.adornUrl(`/v1/user/companys`),
                        method: 'get',
                        params: this.$http.adornParams({
                            pageNum: 1,
                            pageSize: 1000,
                        }),
                    }).then(({data}) => {
                        if (data && data.code === 200) {
                            this.companylist = data.data.list;
                        }
                    });
                }
            });
        },
        // 获取公司id和公司name
        selectGet(value) {
            let obj = {};
            obj = this.companylist.find(item => {
                //这里的userList就是上面遍历的数据源
                return item.companyId === value; //筛选出匹配数据
            });
            this.dataForm.companyName = obj.name;
            this.dataForm.companyId = obj.companyId;
        },
        // 表单提交
        dataFormSubmit() {
            this.$refs['dataFormRef'].validate(valid => {
                if (valid) {
                    this.$http({
                        url: this.$http.adornUrl(this.dataForm.id == 0 ? `/v2/pm/property/details` : `/v2/pm/property/details/` + this.dataForm.id),
                        method: this.dataForm.id == 0 ? 'post' : 'put',
                        data: this.$http.adornData({
                            name: this.dataForm.name,
                            billDate: this.dataForm.billDate,
                            previousValue: Number(this.dataForm.previousValue),
                            currentValue: Number(this.dataForm.currentValue),
                            usedValue: Number(this.dataForm.usedValue),
                            unitPrice: Number(this.dataForm.unitPrice) * 100,
                            currentFee: Number(this.dataForm.currentFee) * 100,
                            formerArrearage: Number(this.dataForm.formerArrearage) * 100,
                            delayCharge: Number(this.dataForm.delayCharge) * 100,
                            companyId: this.dataForm.id == 0 ? this.dataForm.companyId : undefined,
                            companyName: this.dataForm.id == 0 ? this.dataForm.companyName : undefined,
                        }),
                    }).then(({data}) => {
                        if (data && data.code === 201) {
                            this.isclick = true;
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
<style lang="scss" scoped>
.box {
    display: flex;
    justify-content: space-between;
}
.box1 {
    .el-select {
        width: 300px;
    }
}
.el-input {
    width: 200px;
}
.zhanwei {
    display: inline-block;
    width: 200px;
}
.zhanwei1 {
    display: inline-block;
    width: 100px;
}
</style>
