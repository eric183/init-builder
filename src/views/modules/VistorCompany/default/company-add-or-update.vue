<template>
    <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" @close="closeDialog" :visible.sync="visible">
        <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter.native="dataFormSubmit()" label-width="120px" size="small">
            <el-form-item label="公司名称" prop="companyName"> <el-input v-model="dataForm.companyName" placeholder="公司名称不超过20个字"></el-input> </el-form-item>
            <el-form-item label="企业短拼音" prop="shortPinyin"> <el-input v-model="dataForm.shortPinyin" placeholder="企业短拼音"></el-input> </el-form-item>
            <el-form-item label="企业联系人" prop="contacts"> <el-input v-model="dataForm.contacts" placeholder="企业联系人"></el-input> </el-form-item>
            <el-form-item label="企业电话" prop="phone"> <el-input v-model="dataForm.phone" placeholder="企业电话"></el-input> </el-form-item>
            <el-form-item label="楼层名称" prop="floorName"> <el-input v-model="dataForm.floorName" placeholder="多个楼层请用逗号(,)区分"></el-input> </el-form-item>
            <el-form-item label="实际楼层" prop="actualFloorNo"> <el-input v-model="dataForm.actualFloorNo" placeholder="多个楼层请用逗号(,)区分,且与上面楼层名称对应"></el-input> </el-form-item>
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
                companyName: '',
                shortPinyin: '',
                contacts: '',
                phone: '',
                floorName: '',
                actualFloorNo: '',
            },
            floorList: [],
            actuFloorList: [],
            dataRule: {
                companyName: [{required: true, message: '公司名称不能为空', trigger: 'blur'}, {min: 1, max: 30, message: '长度不超过20个字', trigger: 'blur'}],
                shortPinyin: [{required: true, message: '短拼音不能为空', trigger: 'blur'}],
                floorName: [{required: true, message: '楼层名称不能为空', trigger: 'blur'}],
                actualFloorNo: [{required: true, message: '实际楼层不能为空', trigger: 'blur'}],
            },
        };
    },
    methods: {
        closeDialog() {
            this.$refs.dataFormRef.resetFields();
        },
        init(id) {
            this.dataForm.id = id || 0;
            this.visible = true;
        },
        // 表单提交
        dataFormSubmit() {
            //console.log(this.floorName.split('，'))
            if (this.dataForm.floorName.indexOf('，') != -1) {
                this.dataForm.floorName = this.dataForm.floorName.replace(/，/gi, ',');
            }
            if (this.dataForm.actualFloorNo.indexOf('，') != -1) {
                this.dataForm.actualFloorNo = this.dataForm.actualFloorNo.replace(/，/gi, ',');
            }
            this.floorList = this.dataForm.floorName.split(',');
            this.actuFloorList = this.dataForm.actualFloorNo.split(',');
            console.log(this.floorList);
            var list = [];
            for (var i in this.floorList) {
                var obj = {};
                obj.floorName = this.floorList[i];
                obj.actualFloorNo = this.actuFloorList[i];
                list.push(obj);
            }
            this.$refs['dataFormRef'].validate(valid => {
                if (valid) {
                    this.$http({
                        url: this.$http.adornUrl('/v1/visitor/companys'),
                        method: 'post',
                        data: this.$http.adornData({
                            companyName: this.dataForm.companyName,
                            shortPinyin: this.dataForm.shortPinyin,
                            contacts: this.dataForm.contacts,
                            phone: this.dataForm.phone,
                            companyFloors: list,
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
