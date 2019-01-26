<template>
    <div>
        <el-dialog :title="!dataForm.buildingId ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
            <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px" size="small">
                <el-form-item label="楼栋名称" prop="name"> <el-input v-model="dataForm.name" placeholder="楼栋名称"></el-input> </el-form-item>
                <el-form-item label="楼栋简介" prop="abbreviation"> <el-input v-model="dataForm.abbreviation" placeholder="楼栋简介"></el-input> </el-form-item>
                <el-form-item label="楼栋类型" prop="type">
                    <el-select v-model="dataForm.type" type="password" placeholder="楼栋类型">
                        <el-option v-for="item in buildingTypelist" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="楼栋地址" prop="address"> <el-input v-model="dataForm.address" placeholder="楼栋地址"></el-input> </el-form-item>
               
                <el-form-item label="联系人" prop="contact"> <el-input v-model="dataForm.contact" placeholder="联系人"></el-input> </el-form-item>
                <el-form-item label="联系电话" prop="phone"> <el-input v-model="dataForm.phone" placeholder="联系电话"></el-input> </el-form-item>
                <el-form-item label="最低楼层" prop="lowestFloor"> <el-input v-model="dataForm.lowestFloor" placeholder="最低楼层"></el-input> </el-form-item>
                <el-form-item label="最高楼层" prop="highestFloor"> <el-input v-model="dataForm.highestFloor" placeholder="最高楼层"></el-input> </el-form-item>
                <el-form-item label="建筑面积(m2)" prop="totalArea"> <el-input v-model="dataForm.totalArea" placeholder="建筑面积"></el-input> </el-form-item>
                <el-form-item>
                    <el-button type="success" size="mini" @click="showDoor" v-show="!isShowFloor">对应楼层关系</el-button>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="visible = false">取消</el-button>
                <el-button size="small" type="primary" @click="dataFormSubmit()">确定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="楼层对应关系" :visible.sync="dialogdoorrelative">
            <ul class="doorlistblock">
                <li><span>序号</span> <span>物理楼层</span> <span>显示楼层</span> <span>是否为公共楼层</span></li>
                <li v-for="(item, index) in floorlist" :key="index">
                    <span>{{ index + 1 }}</span> <span><input type="text" v-model="item.actualFloorNo"/></span>
                    <span><input type="text" v-model="item.name" /></span>
                    <span> <el-switch v-model="item.isPublic" active-text="是" active-value="1" inactive-text="否" inactive-value="0"> </el-switch> </span>
                </li>
            </ul>
            <el-button size="small" class="ml40" type="primary" @click="myprint">确认</el-button>
        </el-dialog>
        <el-dialog title="楼层对应关系" :visible.sync="doordialog">
            <ul class="doorlistblock">
                <li><span>序号</span> <span>物理楼层</span> <span>显示楼层</span> <span>是否为公共楼层</span></li>
                <li v-for="(item, index) in floorInfolist" :key="index">
                    <span>{{ index + 1 }}</span> <span><input type="text" v-model="item.actualFloorNo" @blur="isActiveChange(item)"/></span>
                    <span><input type="text" v-model="item.name"  @blur="isActiveChange(item)"/></span>
                    <span> <el-switch v-model="item.isPublic" @change="isActiveChange(item)" active-text="是" :active-value="1" inactive-text="否" :inactive-value="0"> </el-switch> </span>
                </li>
            </ul>
            <span slot="footer" class="dialog-footer"> <el-button size="small" class="ml40" type="primary" @click="myprint">确认</el-button> </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            buildingTypelist: [{value: 1, label: '写字楼'}, {value: 2, label: '住宅'}],
            dialogdoorrelative: false,
            doordialog: false, //编辑的楼层弹框
            floorlist: [], //楼层列表（表格有多少项）
            floorInfolist: [], //编辑的楼层信息
            visible: false,
            isShowFloor: false,
            isCanClick: false,
            projectId: 1,
            buildingId: 1,
            roleList: [],
            dataForm: {
                buildingId: 0,
                name: '',
                type: '',
                contact: '',
                address: '',
                phone: '',
                totalArea: '',
                lowestFloor: '',
                highestFloor: '',
            },
            dataRule: {
                name: [{required: true, message: '楼栋名称不能为空', trigger: 'blur'}],
                abbreviation: [{required: true, message: '楼栋简称不能为空', trigger: 'blur'}],
                type: [{required: true, message: '楼栋类型不能为空', trigger: 'blur'}],
                address: [{required: true, message: '楼栋地址不能为空', trigger: 'blur'}],
                contact: [{required: true, message: '联系人不能为空', trigger: 'blur'}],
                phone: [{required: true, message: '联系电话不能为空', trigger: 'blur'}],
                lowestFloor: [{required: true, message: '最低楼层不能为空', trigger: 'blur'}],
                highestFloor: [{required: true, message: '最高楼层不能为空', trigger: 'blur'}],
            },
        };
    },
    methods: {
        init(buildingId) {
            this.dataForm.buildingId = buildingId || 0;
            this.visible = true;
            this.$nextTick(() => {
                this.$refs['dataForm'].resetFields();
                if (this.dataForm.buildingId) {
                    this.isShowFloor = false;
                    // 获取楼栋详细信息
                    this.$http({
                        url: this.$http.adornUrl(`/v1/building/buildings/${this.dataForm.buildingId}`),
                        method: 'get',
                        params: this.$http.adornParams(),
                    }).then(({data}) => {
                        if (data && data.code === 200) {
                            this.dataForm.name = data.data.name;
                            this.dataForm.type = data.data.type;
                            this.dataForm.contact = data.data.contact;
                            this.dataForm.address = data.data.address;
                            this.dataForm.totalArea = data.data.totalArea;
                            this.dataForm.phone = data.data.phone;
                            this.dataForm.abbreviation = data.data.abbreviation;
                            this.dataForm.lowestFloor = data.data.lowestFloor;
                            this.dataForm.highestFloor = data.data.highestFloor;
                        }
                    });
                    // 获取楼层信息
                    this.$http({
                        url: this.$http.adornUrl(`/v1/building/floors`),
                        method: 'get',
                        params: this.$http.adornParams({
                            buildingId: this.dataForm.buildingId,
                            pageNum: 1,
                            pageSize: 9999,
                        }),
                    }).then(({data}) => {
                        if (data && data.code === 200) {
                            this.floorInfolist = data.data.list;
                            //console.log(this.floorInfolist)
                        }
                    });
                } else {
                    this.isShowFloor = true;
                }
            });
        },
        // 编辑楼层信息
        isActiveChange(item) {
            this.$http({
                url: this.$http.adornUrl(`/v1/building/floors`),
                method: 'put',
                data: this.$http.adornData({
                    name: item.name,
                    actualFloorNo: item.actualFloorNo,
                    isPublic: item.isPublic,
                    floorId: item.floorId,
                }),
            });
        },
        // 表单提交
        dataFormSubmit() {
            this.$refs['dataForm'].validate(valid => {
                if (valid) {
                    // if(this.dataForm.buildingId ==0 && this.isCanClick==false){
                    //     this.$message.error("新增的时候请填写并确认楼层信息");
                    //     return false;
                    // }
                    // 楼层信息的提交--编辑/新增
                    // this.$http({
                    //     url: this.$http.adornUrl(`/v1/building/floors`),
                    //     method: (this.dataForm.buildingId ==0) ?'post' : 'put',
                    //     data:(this.dataForm.buildingId ==0) ? this.$http.adornData({
                    //         'floors':this.floorlist
                    //       }) :  this.$http.adornData({
                    //         'floors':this.floorInfolist
                    //       })
                    // })
                    // 楼栋信息的提交--编辑/新增
                    this.$http({
                        url: this.$http.adornUrl(`/v1/building/buildings`),
                        method: this.dataForm.buildingId == 0 ? 'post' : 'put',
                        data: this.$http.adornData({
                            buildingId: this.dataForm.buildingId || undefined,
                            name: this.dataForm.name,
                            abbreviation: this.dataForm.abbreviation,
                            type: this.dataForm.type,
                            address: this.dataForm.address,
                            totalArea: this.dataForm.totalArea,
                            contact: this.dataForm.contact,
                            phone: this.dataForm.phone,
                            lowestFloor: this.dataForm.lowestFloor,
                            highestFloor: this.dataForm.highestFloor,
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
        showDoor() {
            //console.log("显示楼层啊");
            this.doordialog = true;
            //console.log(this.floorInfolist)
        },
        // 确认楼层信息
        myprint() {
            this.dialogdoorrelative = false;
            this.doordialog = false;
            this.isCanClick = true;
        },
        // 打开楼层表格
        opendoor() {
            //console.log("打开楼层")
            if (!this.dataForm.lowestFloor || !this.dataForm.highestFloor) {
                this.$message.warning('请填写最低楼层和最高楼层');
            } else {
                this.getDoorTable();
                this.dialogdoorrelative = true;
            }
        },
        //构建楼层table表格
        getDoorTable() {
            // 编辑打开的接口
            if (this.dataForm.buildingId) {
            } else {
                this.floorlist = [];
                var number = this.dataForm.highestFloor - this.dataForm.lowestFloor;
                for (let i = this.dataForm.lowestFloor; i <= this.dataForm.highestFloor; i++) {
                    if (i == 0) {
                        continue;
                    }
                    this.floorlist.push({floorActualNo: i, floorName: i, floorIspublic: 0, buildingId: this.buildingId, floorId: i});
                }
            }
        },
    },
};
</script>
