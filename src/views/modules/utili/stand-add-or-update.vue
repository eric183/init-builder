<template>
    <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="90px" size="small">
            <el-form-item label="收费名称" prop="name"> <el-input v-model="dataForm.name" placeholder="收费名称"></el-input> </el-form-item>
            <el-form-item label="标识" prop="mark"> <el-input v-model="dataForm.mark" placeholder="标识"></el-input> </el-form-item>
            <el-form-item label="收费项类型" prop="chargeType">
                <el-select v-model="dataForm.chargeType"> <el-option v-for="item in chargeTypeList" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select>
            </el-form-item>
            <el-form-item label="单价(元)" prop="price"> <el-input v-model="dataForm.price" placeholder="单价"></el-input> </el-form-item>
            <el-form-item label="计量方式" prop="chargeMode">
                <el-select v-model="dataForm.chargeMode"> <el-option v-for="item in chargeModeList" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select>
            </el-form-item>
            <el-form-item label="备注" prop="remark"> <el-input type="textarea" v-model="dataForm.remark" placeholder="备注"></el-input> </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="visible = false">取消</el-button>
            <el-button size="small" type="primary" @click="dataFormSubmit()">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import {isEmail, isMobile} from '@/utils/validate';
export default {
    data() {
        return {
            dataForm: {
                id: 0,
                name: '',
                mark: '',
                chargeType: '',
                chargeMode: '',
                price: '',
                remark: '',
            },
            chargeTypeList: [{value: 1, label: '周期性固定收费'}, {value: 2, label: '抄表类型标准收费'}, {value: 3, label: '抄表类分时段收费'}],
            chargeModeList: [{value: 1, label: '出租面积'}, {value: 2, label: '使用量'}],
            visible: false,
            dataRule: {
                devicegroupName: [{required: true, message: '分组不能为空', trigger: 'blur'}],
                devicegroupCode: [{required: true, message: '分组编号为空', trigger: 'blur'}],
                devicegroupType: [{required: true, message: '分组类型不能为空', trigger: 'blur'}],
            },
        };
    },
    methods: {
        init(id) {
            this.visible = true;
            this.dataForm.id = id || 0;
            this.$nextTick(() => {
                this.$refs['dataForm'].resetFields();
                if (this.dataForm.id) {
                    this.$http({
                        url: this.$http.adornUrl(`/v1/pm/charge/rules/${this.dataForm.id}`),
                        method: 'get',
                    }).then(({data}) => {
                        if (data && data.code === 200) {
                            (this.dataForm.name = data.data.name),
                                (this.dataForm.mark = data.data.mark),
                                (this.dataForm.chargeType = data.data.chargeType),
                                (this.dataForm.chargeMode = data.data.chargeMode),
                                (this.dataForm.price = data.data.price / 100),
                                (this.dataForm.remark = data.data.remark);
                        }
                    });
                }
            });
        },
        // 表单提交
        dataFormSubmit() {
            this.$refs['dataForm'].validate(valid => {
                if (valid) {
                    this.$http({
                        url: this.$http.adornUrl(`/v1/pm/charge/rules`),
                        method: this.dataForm.id == 0 ? 'post' : 'put',
                        data: this.$http.adornData({
                            ruleId: this.dataForm.id || undefined,
                            remark: this.dataForm.remark,
                            price: this.dataForm.price * 100,
                            chargeMode: this.dataForm.chargeMode,
                            chargeType: this.dataForm.chargeType,
                            mark: this.dataForm.mark,
                            name: this.dataForm.name,
                        }),
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
