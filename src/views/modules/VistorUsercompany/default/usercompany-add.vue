<template>
    <el-dialog title="新增" :close-on-click-modal="false" :append-to-body="true" :visible.sync="visible">
        <el-form ref="dataFormRef" :model="dataForm" :rules="dataRule" label-width="100px" size="small" label-position="top">
            <div class="dialogbox">
                <div class="box">
                    <el-form-item label="姓名" prop="name"> <el-input placeholder="访客姓名" clearable v-model="dataForm.name"></el-input> </el-form-item>
                </div>
                <div class="box">
                    <el-form-item label="手机号码" prop="phone"> <el-input placeholder="手机号码" clearable v-model="dataForm.phone"></el-input> </el-form-item>
                </div>
            </div>
            <div class="dialogbox">
                <div class="box">
                    <el-form-item label="性别" prop="gender">
                        <el-radio-group v-model="dataForm.gender" size="small">
                            <el-radio-button label="1">男</el-radio-button>
                            <el-radio-button label="2">女</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                </div>
                <div class="box">
                    <el-form-item label="身份证号" prop="idCard"> <el-input placeholder="身份证号" clearable v-model="dataForm.idCard"></el-input> </el-form-item>
                </div>
            </div>
            <div class="dialogbox">
                <div class="box">
                    <el-form-item label="到访事由" prop="reason">
                        <el-radio-group v-model="dataForm.reason" size="small">
                            <el-radio-button label="商务"></el-radio-button>
                            <el-radio-button label="服务"></el-radio-button>
                            <el-radio-button label="面试"></el-radio-button>
                            <el-radio-button label="入职"></el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                </div>
                <div class="box">
                    <el-form-item label="到访楼层" prop="floorId">
                        <el-select v-model="dataForm.floorId" filterable>
                            <el-option v-for="item in companyFloors" :key="item.floorId" :label="item.floorName" :value="item.floorId"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </div>
            <div class="dialogbox">
                <div class="box">
                    <el-form-item label="来访时间" prop="arriveTime">
                        <el-date-picker v-model="dataForm.arriveTime" type="date" :picker-options="pickerOptions" value-format="yyyy-MM-dd" placeholder="选择日期"> </el-date-picker>
                    </el-form-item>
                </div>
                <div class="box"></div>
            </div>
            <div class="dialogbox">
                <div class="box"></div>
                <div class="box">
                    <el-button type="primary" size="mini" @click="dataFormSubmit()">确认</el-button>
                    <el-button size="mini" @click="visible = false">返回</el-button>
                </div>
            </div>
        </el-form>
    </el-dialog>
</template>

<script>
import {isMobile} from '@/utils/validate';
export default {
    data() {
        var validateMobile = (rule, value, callback) => {
            if (!isMobile(value)) {
                callback(new Error('手机号格式错误'));
            } else {
                callback();
            }
        };
        return {
            dataForm: {
                gender: '1',
                idCard: '',
                name: '',
                phone: '',
                source: 3, //访客记录来源  3:企业预约
                reason: '商务',
                visitorNum: '1', //访客来访的人数-默认是1人
                floorId: null,
                arriveTime: '',
                companyId: null,
            },
            companyFloors: [],
            visible: false,
            pickerOptions: {
                disabledDate(time) {
                    let _now = Date.now() - 1 * 24 * 60 * 60 * 1000,
                        seven = 7 * 24 * 60 * 60 * 1000,
                        sevenDays = _now + seven;
                    return time.getTime() < _now || time.getTime() > sevenDays; //小于当前的禁止，大于于7天后的禁止
                },
            },
            dataRule: {
                name: [{required: true, message: '访客姓名不能为空', trigger: 'blur'}],
                phone: [{required: true, message: '手机号码不能为空', trigger: 'blur'}, {validator: validateMobile, trigger: 'blur'}],
                idCard: [{required: true, message: '身份证号不能为空', trigger: 'blur'}],
                arriveTime: [{required: true, message: '来访时间不能为空', trigger: 'blur'}],
                floorId: [{required: true, message: '到访楼层不能为空', trigger: 'blur'}],
            },
        };
    },
    methods: {
        init() {
            this.visible = true;
            this.$nextTick(() => {
                this.$refs['dataFormRef'].resetFields();
                // 查询账号/用户下的企业信息
                this.$http({
                    url: this.$http.adornUrl('/v1/visitor/companys/userCompany'),
                    method: 'get',
                }).then(({data}) => {
                    if (data.code == 200) {
                        this.dataForm.companyId = data.data.companyId;
                        this.companyFloors = data.data.companyFloors;
                    }
                });
            });
        },
        // 表单提交
        dataFormSubmit() {
            this.$refs['dataFormRef'].validate(valid => {
                if (valid) {
                    this.$http({
                        url: this.$http.adornUrl(`/v1/visitor/records`),
                        method: 'post',
                        data: this.$http.adornData({
                            companyId: this.dataForm.companyId,
                            gender: this.dataForm.gender,
                            idCard: this.dataForm.idCard,
                            phone: this.dataForm.phone,
                            name: this.dataForm.name,
                            source: this.dataForm.source,
                            reason: this.dataForm.reason,
                            visitorNum: this.dataForm.visitorNum,
                            floorId: this.dataForm.floorId,
                            arriveTime: this.dataForm.arriveTime,
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
<style lang="scss" scoped>
.dialogbox {
    display: flex;
    justify-content: space-around;
    .box {
        width: 40%;
    }
}
</style>
