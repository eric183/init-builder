<template>
    <el-dialog :visible.sync="visable" :title="this.odfId ? '编辑ODF' : '新增ODF'">
        <!-- 新增ODF的弹窗 -->
        <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" label-width="90px" size="small">
            <el-form-item prop="odfName" label="ODF名称:"> <el-input v-model="dataForm.odfName" placeholder="ODF名称" clearable :disabled="this.odfId != 0"></el-input> </el-form-item>
            <el-form-item prop="labId" label="所属机房:" v-if="this.odfId == 0">
                <el-select v-model="dataForm.labId"> <el-option v-for="item in labList" :key="item.labId" :label="item.labName" :value="item.labId"></el-option> </el-select>
            </el-form-item>
            <el-form-item prop="labName" label="所属机房:" v-if="this.odfId != 0"> <el-input v-model="dataForm.labName" placeholder="ODF名称" :disabled="this.odfId != 0"></el-input> </el-form-item>
            <el-form-item prop="projectName" label="所属工程:"> <el-input v-model="dataForm.projectName" placeholder="所属工程" clearable></el-input> </el-form-item>
            <el-form-item prop="remark" label="备注:"> <el-input type="textarea" v-model="dataForm.remark" placeholder="备注" clearable></el-input> </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="visable = false">取消</el-button>
            <el-button size="small" type="primary" @click="dataFormSubmit()">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    data() {
        return {
            dataForm: {
                odfName: '',
                labId: '',
                projectName: '',
                labName: '',
                remark: '',
            },
            odfId: 0,
            visable: false,
            labList: [],
            dataRule: {
                odfName: [{required: true, message: '必填', trigger: 'blur'}],
                labId: [{required: true, message: '必填', trigger: 'blur'}],
            },
        };
    },
    methods: {
        init(obj) {
            if (obj) {
                this.odfId = obj.odfId;
                this.dataForm.odfName = obj.odfName;
                this.dataForm.projectName = obj.projectName;
                this.dataForm.remark = obj.remark;
                this.dataForm.labName = obj.labName;
            } else {
                this.odfId = 0; //odf的id
                this.dataForm.odfName = '';
                this.dataForm.labId = '';
                this.dataForm.projectName = '';
                this.dataForm.remark = '';
                this.dataForm.labName = '';
            }
            this.visable = true;
            this.$nextTick(() => {
                this.$http({
                    url: this.$http.adornUrl('/v1/cpn/labs'),
                    method: 'get',
                }).then(({data}) => {
                    if (data && data.code === 200) {
                        this.labList = data.data.labs;
                    }
                });
            });
        },
        // 添加
        dataFormSubmit(userId) {
            this.$refs['dataFormRef'].validate(valid => {
                if (valid) {
                    this.$http({
                        url: this.odfId ? this.$http.adornUrl('/v1/cpn/odfs/' + this.odfId) : this.$http.adornUrl('/v1/cpn/odfs'),
                        method: this.odfId ? 'put' : 'post',
                        data: this.$http.adornData(this.dataForm),
                    }).then(({data}) => {
                        if (data && data.code === 201) {
                            this.visable = false;
                            this.$emit('refreshDataList');
                            this.$message.success('提交成功');
                        }
                    });
                }
            });
        },
    },
};
</script>
