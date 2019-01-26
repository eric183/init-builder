<template>
    <el-dialog :title="!dataForm.projectId ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px" size="small">
            <el-form-item label="项目名称" prop="projectName"> <el-input v-model="dataForm.projectName" placeholder="项目名称"></el-input> </el-form-item>
            <el-form-item label="项目类型" prop="projectType">
                <el-select v-model="dataForm.projectType" placeholder="项目类型">
                    <el-option v-for="item in projectTypelist" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="项目简称" prop="abbreviation"> <el-input v-model="dataForm.abbreviation" placeholder="项目简称"></el-input> </el-form-item>
            <el-form-item label="省" prop="province"> <el-input v-model="dataForm.province" placeholder="省"></el-input> </el-form-item>
            <el-form-item label="市" prop="city"> <el-input v-model="dataForm.city" placeholder="市"></el-input> </el-form-item>
            <el-form-item label="区" prop="region"> <el-input v-model="dataForm.region" placeholder="区县"></el-input> </el-form-item>
            <el-form-item label="项目编号" prop="projectSn"> <el-input v-model="dataForm.projectSn" placeholder="项目简称"></el-input> </el-form-item>
            <el-form-item label="项目地址" prop="address"> <el-input v-model="dataForm.address" placeholder="项目地址"></el-input> </el-form-item>
            <el-form-item label="建筑面积" prop="totalArea"> <el-input v-model="dataForm.totalArea" placeholder="建筑面积"></el-input> </el-form-item>
            <el-form-item label="出租面积" prop="rentedArea"> <el-input v-model="dataForm.rentedArea" placeholder="出租面积"></el-input> </el-form-item>
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
        var validatePassword = (rule, value, callback) => {
            if (!this.dataForm.id && !/\S/.test(value)) {
                callback(new Error('密码不能为空'));
            } else {
                callback();
            }
        };
        var validateComfirmPassword = (rule, value, callback) => {
            if (!this.dataForm.id && !/\S/.test(value)) {
                callback(new Error('确认密码不能为空'));
            } else if (this.dataForm.password !== value) {
                callback(new Error('确认密码与密码输入不一致'));
            } else {
                callback();
            }
        };
        var validateEmail = (rule, value, callback) => {
            if (!isEmail(value)) {
                callback(new Error('邮箱格式错误'));
            } else {
                callback();
            }
        };
        var validateMobile = (rule, value, callback) => {
            if (!isMobile(value)) {
                callback(new Error('手机号格式错误'));
            } else {
                callback();
            }
        };
        return {
            projectTypelist: [{value: 1, label: '产业园'}, {value: 2, label: '住宅'}, {value: 3, label: '综合体'}],
            visible: false,
            roleList: [],
            dataForm: {
                projectId: 0,
                projectName: '',
                projectType: '',
                abbreviation: '',
                address: '',
                totalArea: '',
                rentedArea: '',
            },
            dataRule: {
                projectName: [{required: true, message: '项目名称不能为空', trigger: 'blur'}],
                projectType: [{required: true, message: '项目类型不能为空', trigger: 'blur'}],
                abbreviation: [{required: true, message: '项目简称不能为空', trigger: 'blur'}],
                address: [{required: true, message: '项目地址不能为空', trigger: 'blur'}],
                projectSn: [{required: true, message: '项目编号不能为空', trigger: 'blur'}],
                province: [{required: true, message: '省份不能为空', trigger: 'blur'}],
                city: [{required: true, message: '市不能为空', trigger: 'blur'}],
                region: [{required: true, message: '区县不能为空', trigger: 'blur'}],
            },
        };
    },
    methods: {
        init(id) {
            this.dataForm.projectId = id || 0;
            this.visible = true;
            this.$nextTick(() => {
                this.$refs['dataForm'].resetFields();
                if (this.dataForm.projectId) {
                    this.$http({
                        url: this.$http.adornUrl(`/v1/baseProject/${this.dataForm.projectId}`),
                        method: 'get',
                        params: this.$http.adornParams(),
                    }).then(({data}) => {
                        if (data && data.code === 200) {
                            console.log(data);
                            this.dataForm.projectName = data.data.projectName;
                            this.dataForm.projectType = data.data.projectType;
                            this.dataForm.abbreviation = data.data.abbreviation;
                            this.dataForm.address = data.data.address;
                            this.dataForm.totalArea = data.data.totalArea;
                            this.dataForm.rentedArea = data.data.rentedArea;
                            this.dataForm.projectSn = data.data.projectSn;
                            this.dataForm.province = data.data.province;
                            this.dataForm.city = data.data.city;
                            this.dataForm.region = data.data.region;
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
                        url: this.$http.adornUrl(`/v1/baseProject`),
                        method: this.dataForm.projectId == 0 ? 'post' : 'put',
                        data: this.$http.adornData({
                            projectId: this.dataForm.projectId || undefined,
                            projectName: this.dataForm.projectName,
                            abbreviation: this.dataForm.abbreviation,
                            address: this.dataForm.address,
                            projectType: this.dataForm.projectType,
                            totalArea: this.dataForm.totalArea,
                            projectSn: this.dataForm.projectSn,
                            rentedArea: this.dataForm.rentedArea,
                            province: this.dataForm.province,
                            city: this.dataForm.city,
                            region: this.dataForm.region,
                            brandId: 1, //品牌id目前后端没做处理，先写死
                        }),
                    }).then(({data}) => {
                        if (data && data.code === 200) {
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
