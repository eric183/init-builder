<template>
    <el-dialog title="修改" :close-on-click-modal="false" :visible.sync="visible">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px" size="small">
            <div class="popr">
                <div class="box">
                    <el-form-item label="身份证" prop="idCard"> <el-input v-model="dataForm.idCard" placeholder="身份证号码"></el-input> </el-form-item>
                </div>
                <div class="box">
                    <el-form-item label="电话号码" prop="telephone"> <el-input v-model="dataForm.telephone" placeholder="电话号码"></el-input> </el-form-item>
                </div>
            </div>
            <div class="popr">
                <div class="box">
                    <el-form-item label="部门" prop="departmentName">
                        <el-popover ref="menuListPopover" placement="bottom-start" trigger="click">
                            <el-cascader :options="options" filterable change-on-select v-model="dataForm.selectedOptions" @change="changeId2" :show-all-levels="false" :props="props"></el-cascader>
                        </el-popover>
                        <el-input v-model="dataForm.departmentName" v-popover:menuListPopover :readonly="true" placeholder="点击选择部门" class="menu-list__input"></el-input>
                    </el-form-item>
                </div>
                <div class="box">
                    <el-form-item label="职务信息" prop="position">
                        <el-select v-model="dataForm.position"> <el-option v-for="item in positionList" :key="item.id" :label="item.position" :value="item.position"></el-option> </el-select>
                    </el-form-item>
                </div>
            </div>
            <el-form-item label="邮箱地址" prop="email"> <el-input v-model="dataForm.email" placeholder="邮箱地址"></el-input> </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="visible = false">取消</el-button>
            <el-button size="small" type="primary" @click="dataFormSubmit()">确定</el-button>
        </span>
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
                id: 0,
                email: null,
                departmentId: null,
                departmentName: '',
                position: null,
                idCard: null,
                telephone: null,
                selectedOptions: [],
            },
            positionList: [],
            visible: false,
            options: [],
            props: {
                value: 'departmentId',
                label: 'departmentName',
                children: 'children',
            },
            dataRule: {
                email: [{required: true, message: '邮箱不能为空', trigger: 'blur'}],
                selectedOptions: [{required: true, message: '请选择部门', trigger: 'blur'}],
                telephone: [{required: true, message: '电话号码不能为空', trigger: 'blur'}],
                position: [{required: true, message: '职务信息不能为空', trigger: 'blur'}],
                idCard: [{required: true, message: '身份证不能为空', trigger: 'blur'}],
            },
        };
    },
    methods: {
        init(id) {
            this.dataForm.id = id || 0;
            this.$http({
                url: this.$http.adornUrl('/v1/pm/departments'),
                method: 'get',
            })
                .then(({data}) => {
                    this.options = data && data.code === 200 ? data.data.departments : [];
                })
                .then(() => {
                    this.visible = true;
                    this.$nextTick(() => {
                        this.$refs['dataForm'].resetFields();
                    });
                })
                .then(() => {
                    if (this.dataForm.id) {
                        this.getPosition();
                        this.$http({
                            url: this.$http.adornUrl(`/v1/pm/users/` + this.dataForm.id),
                            method: 'get',
                        }).then(({data}) => {
                            if (data && data.code === 200) {
                                this.dataForm.email = data.data.email;
                                this.dataForm.departmentId = data.data.departmentId;
                                this.dataForm.departmentName = data.data.departmentName;
                                this.dataForm.position = data.data.position;
                                this.dataForm.idCard = data.data.idCard;
                                this.dataForm.telephone = data.data.telephone;
                            }
                        });
                    }
                });
        },
        // 获取职务的列表
        getPosition() {
            this.$http({
                url: this.$http.adornUrl('/v1/pm/users/positions'),
                method: 'get',
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.positionList = data.data.positions;
                }
            });
        },
        // el-cascader  选择器change事件
        changeId(value) {
            this.dataForm.departmentId = value[value.length - 1];
        },
        getCascaderObj(val, opt) {
            return val.map(function(value, index, array) {
                for (var itm of opt) {
                    if (itm.departmentId == value) {
                        opt = itm.children;
                        return itm;
                    }
                }
                return null;
            });
        },
        changeId2() {
            this.vals = this.getCascaderObj(this.dataForm.selectedOptions, this.options);
            console.log(123);
            this.dataForm.departmentName = this.vals[this.vals.length - 1].departmentName;
            this.dataForm.departmentId = this.vals[this.vals.length - 1].departmentId;
        },
        dataFormSubmit() {
            this.$refs['dataForm'].validate(valid => {
                if (valid) {
                    this.$http({
                        url: this.$http.adornUrl(this.dataForm.id == 0 ? `/v1/pm/users` : `/v1/pm/users/` + this.dataForm.id + '/userInfo'),
                        method: this.dataForm.id == 0 ? 'post' : 'put',
                        data: this.$http.adornData({
                            email: this.dataForm.email,
                            departmentId: this.dataForm.departmentId,
                            position: this.dataForm.position,
                            idCard: this.dataForm.idCard,
                            telephone: this.dataForm.telephone,
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
.popr {
    div.box {
        width: 50%;
    }
}
</style>
