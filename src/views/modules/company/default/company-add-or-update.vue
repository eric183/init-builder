<template>
    <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="140px" size="small">
            <el-form-item label="楼栋" prop="buildingId">
                <el-select v-model="dataForm.buildingId" placeholder="请选择" @change="buildChange">
                    <el-option v-for="item in buildinglist" :key="item.buildingId" :label="item.name" :value="item.buildingId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="楼层" prop="floorId">
                <el-select v-model="dataForm.floorId" placeholder="请选择" @change="floorChange">
                    <el-option v-for="item in floorlist" :key="item.floorId" :label="item.name" :value="item.floorId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="门牌" prop="doorplateId">
                <el-select v-model="dataForm.doorplateId" multiple placeholder="请选择">
                    <el-option v-for="item in doorlist" :key="item.doorplateId" :label="item.name" :value="item.doorplateId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="企业名称" prop="name"> <el-input v-model="dataForm.name" placeholder="企业名称"></el-input> </el-form-item>
            <el-form-item label="企业短拼音" prop="shortPinyin"> <el-input v-model="dataForm.shortPinyin" placeholder="建议大写"></el-input> </el-form-item>
            <el-form-item label="企业简称" prop="abbreviation"> <el-input v-model="dataForm.abbreviation" placeholder="企业简称"></el-input> </el-form-item>
            <!-- <el-form-item label="企业类型" prop="type">
        <el-select v-model="dataForm.type" placeholder="请选择">
          <el-option v-for="item in companyTypelist" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item> -->
            <el-form-item label="企业介绍" prop="introduce"> <el-input v-model="dataForm.introduce" placeholder="企业介绍"></el-input> </el-form-item>
            <el-form-item label="统一社会信用代码" prop="businessLicenseNo"> <el-input v-model="dataForm.businessLicenseNo" placeholder="统一社会信用代码"></el-input> </el-form-item>
            <el-form-item label="访客是否需要审核">
                <el-switch :width="35" v-model="dataForm.isVmChecked" active-text="是" :active-value="1" inactive-text="否" :inactive-value="0"> </el-switch>
            </el-form-item>
            <el-form-item label="官网地址" prop="websiteUrl"> <el-input v-model="dataForm.websiteUrl" placeholder="官网地址"></el-input> </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="visible = false">取消</el-button>
            <el-button size="small" type="primary" @click="dataFormSubmit()" :disabled="isclick">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    data() {
        return {
            checklist: [{value: 1, label: '要'}, {value: 0, label: '不要'}],
            visible: false,
            roleList: [],
            dataForm: {
                id: 0,
                // floorName:[],
                name: '',
                shortPinyin: '',
                abbreviation: '',
                introduce: '',
                businessLicenseNo: '',
                isVmChecked: '',
                websiteUrl: '',
                type: '',
                buildingId: [],
                floorId: [],
                doorplateId: [],
            },
            buildinglist: [],
            buildlist: [''],
            floorlist: [],
            doorlist: [],
            isclick: false, //按钮默认可点击，点击确认之后不可再点击
            // 企业类型
            companyTypelist: [{value: 1, label: '普通企业'}, {value: 2, label: '运营管理企业'}, {value: 3, label: '物业管理企业'}],
            dataRule: {
                name: [{required: true, message: '企业名称不能为空', trigger: 'blur'}],
                shortPinyin: [{required: true, message: '企业短拼音不能为空', trigger: 'blur'}],
                businessLicenseNo: [{required: true, message: '统一社会信用代码不能为空', trigger: 'blur'}],
                buildingId: [{required: true, message: '楼栋不能为空', trigger: 'blur'}],
                floorId: [{required: true, message: '楼层不能为空', trigger: 'blur'}],
                doorplateId: [{required: true, message: '门牌不能为空', trigger: 'blur'}],
            },
            options2: [],
            props: {
                value: 'floorName',
                children: 'door',
            },
        };
    },
    methods: {
        // handleItemChange(val){
        //   console.log(val)
        // },
        getBuildList() {
            this.$http({
                url: this.$http.adornUrl('/v1/building/buildings'),
                method: 'get',
                params: this.$http.adornParams({
                    pageNum: 1,
                    pageSize: 9999,
                }),
            }).then(({data}) => {
                this.buildinglist = data && data.code === 200 ? data.data.list : [];
            });
        },
        getFloorList() {
            this.$http({
                url: this.$http.adornUrl('/v1/building/floors'),
                method: 'get',
                params: this.$http.adornParams({
                    buildingId: this.dataForm.buildingId,
                    pageNum: 1,
                    pageSize: 9999,
                }),
            }).then(({data}) => {
                this.floorlist = data && data.code === 200 ? data.data.list : [];
            });
        },
        getDoorList() {
            this.$http({
                url: this.$http.adornUrl('/v1/building/doorplates'),
                method: 'get',
                params: this.$http.adornParams({
                    floorId: this.dataForm.floorId,
                    pageNum: 1,
                    pageSize: 9999,
                }),
            }).then(({data}) => {
                this.doorlist = data && data.code === 200 ? data.data.list : [];
            });
        },
        // 改变楼栋
        buildChange() {
            this.getFloorList();
        },
        // 改变楼层
        floorChange() {
            this.getDoorList();
        },
        init(id) {
            this.isclick = false;
            this.dataForm.id = id || 0;
            this.visible = true;
            this.$nextTick(() => {
                this.$refs['dataForm'].resetFields();
                this.getBuildList();
                if (this.dataForm.id) {
                    this.$http({
                        url: this.$http.adornUrl(`/v1/user/companys/${this.dataForm.id}`),
                        method: 'get',
                        params: this.$http.adornParams(),
                    }).then(({data}) => {
                        if (data && data.code === 200) {
                            //console.log(data);
                            this.dataForm.name = data.data.name;
                            this.dataForm.abbreviation = data.data.abbreviation;
                            this.dataForm.introduce = data.data.introduce;
                            this.dataForm.businessLicenseNo = data.data.businessLicenseNo;
                            this.dataForm.type = data.data.type;
                            this.dataForm.isVmChecked = data.data.isVmChecked;
                            this.dataForm.websiteUrl = data.data.websiteUrl;
                            this.dataForm.shortPinyin = data.data.shortPinyin.toUpperCase();
                        }
                    });
                    // 获取公司同时获取门牌
                    this.$http({
                        url: this.$http.adornUrl(`/v1/user/companys/${this.dataForm.id}/doorplates`),
                        method: 'get',
                    }).then(({data}) => {
                        if (data && data.code === 200) {
                            if (data.data.doorplates.length > 0) {
                                this.dataForm.buildingId = data.data.doorplates[0].buildingId;
                                this.dataForm.floorId = data.data.doorplates[0].floorId;
                                var list = [];
                                for (var i in data.data.doorplates) {
                                    list.push(data.data.doorplates[i].doorplateId);
                                }
                                this.dataForm.doorplateId = list;
                                this.getFloorList();
                                this.getDoorList();
                            }
                        }
                    });
                } else {
                    //新增
                }
            });
        },
        // 表单提交
        dataFormSubmit() {
            this.$refs['dataForm'].validate(valid => {
                if (valid) {
                    this.$http({
                        url: this.$http.adornUrl(`/v1/user/companys`),
                        method: this.dataForm.id == 0 ? 'post' : 'put',
                        data: this.$http.adornData({
                            companyId: this.dataForm.id || undefined,
                            name: this.dataForm.name,
                            shortPinyin: this.dataForm.shortPinyin.toUpperCase(),
                            abbreviation: this.dataForm.abbreviation,
                            introduce: this.dataForm.introduce,
                            businessLicenseNo: this.dataForm.businessLicenseNo,
                            phone: this.dataForm.phone,
                            isVmChecked: this.dataForm.isVmChecked,
                            websiteUrl: this.dataForm.websiteUrl,
                            type: this.dataForm.type,
                            doorplateIds: this.dataForm.doorplateId,
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
.el-select {
    width: 100%;
}
.el-select .el-input__inner {
    width: 100%;
}
</style>
