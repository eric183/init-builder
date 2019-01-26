<template>
    <el-row>
        <el-row class="title_container f14 h_44">
            <el-col :span="12">故障设备信息:</el-col>
            <el-col :span="12" style="display: flex;justify-content: flex-end;">
                <el-row style="margin: 0 20px;"> <el-button type="primary" size="mini" @click="selectDevice">添加设备</el-button> </el-row>
            </el-col>
        </el-row>
        <el-row style="border: 1px solid #DDDDDD;min-height: 100px;"> <ZZTable ref="table" :conf="tableConf" v-if="tableConf.data.length"></ZZTable> </el-row>
        <el-row>
            <el-row class="title_container f14 h_44"> 工单内容: </el-row>
            <el-row style="border: 1px solid #DDDDDD;">
                <div style="margin: 0 20px">
                    <el-form :model="formData" ref="dataFormRef" :rules="rules" label-width="100px" class="margin_top_20">
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="工单类型" prop="type">
                                    <el-select v-model="formData.type" placeholder="请选择工单类型">
                                        <el-option v-for="(type, index) in order_type" v-if="index > 0" :key="index" :label="type" :value="index"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="9">
                                <el-form-item label="报事人" prop="feedbackMan" style="width:80%">
                                    <el-input v-model="formData.feedbackMan" placeholder="请输入16个字以内字符"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="9">
                                <el-form-item label="报事人手机号" prop="feedbackContact" style="width:80%">
                                    <el-input v-model="formData.feedbackContact" placeholder="请输入报事人手机号"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row v-if="formData.type > 3">
                            <el-form-item :label="formData.type == 5 ? '企业报修' : '公共区域报修'" prop="repairItem">
                                <el-radio-group v-model="formData.repairItem">
                                    <el-radio v-for="(item, index) in optionsArr" :key="index" :label="item.item" style="color: #999999;">{{ item.item }}</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="严重度" prop="importance">
                                    <el-select v-model="formData.importance" placeholder="请选择严重程度">
                                        <el-option v-for="(status, index) in prioritys" v-if="(index + 1) % 2 == 1 && index > 0" :key="index" :label="status" :value="index"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="紧急度" prop="priority">
                                    <el-select v-model="formData.priority" placeholder="请选择紧急程度">
                                        <el-option v-for="(status, index) in prioritys" v-if="(index + 1) % 2 == 0" :key="index" :label="status" :value="index"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-form-item label="位置" prop="position">
                            <el-col :span="10"> <el-input v-model="formData.position" placeholder="请输入位置信息"></el-input> </el-col>
                        </el-form-item>
                        <el-form-item label="问题描述" class="margin_top_20" prop="content">
                            <el-col :span="20"> <el-input type="textarea" :rows="4" v-model="formData.content" placeholder="请输入问题描述"></el-input> </el-col>
                        </el-form-item>
                        <div style="position:relative">
                            <el-form-item label="图片">
                                <el-col :span="12">
                                    <el-row style="cursor: pointer;display: flex;justify-content: flex-start;">
                                        <div class="plus_icon" v-for="(img, index) in imageArr" :key="index">
                                            <img :src="img.src || img" height="100%" width="auto" style="overflow: hidden;" @click="deleteImg(index)" />
                                        </div>
                                        <div class="plus_icon" @click="addImage"><i class="el-icon-plus" style="font-size: 24px;"></i></div>
                                        <div style="display: none;">
                                            <input v-for="(plus_img, index) in imageLimit" @change="plus_img_change" :id="'plus_img_' + index" type="file" accept="image/jpeg,image/png" />
                                        </div>
                                    </el-row>
                                    <el-row class="margin_top_12 c999"> 最多上传三张图片，格式jpg、png、jpeg </el-row>
                                </el-col>
                            </el-form-item>
                        </div>
                    </el-form>
                </div>
            </el-row>
            <el-row class="title_container f14 h_44"> 派发工单: </el-row>
            <el-row style="border: 1px solid #DDDDDD;">
                <div style="margin: 0 20px"><ExcutorSelect ref="select" :formData="formData"></ExcutorSelect></div>
            </el-row>
        </el-row>
        <el-row style="display: flex;justify-content: center;"> <el-button class="normal_btn margin_top_20" @click="postInfo">提交</el-button> </el-row>
        <DeviceSelect v-if="isSelectDevice" @id="callBackId" ref="addOrUpdate"></DeviceSelect>
    </el-row>
</template>

<script>
import DeviceSelect from '@/views/modules/superdev/device-select';
import ZZTable from '@/views/modules/UIModules/Table';
import ExcutorSelect from '@/views/modules/UIModules/ExcutorSelect';
import {workerOrder} from '@/assets/imgjs.js';

import {order_type, prioritys, order_origin, fix_status} from '@/assets/js/Const';
var co = require('co');
var OSS = require('ali-oss');
export default {
    components: {
        DeviceSelect,
        ZZTable,
        ExcutorSelect,
    },
    data() {
        return {
            deviceIdList: [],
            imageArr: [],
            str: '',
            optionsArr: [],
            default_formData: '',
            formData: {
                departmentName: [],
                managerDepartmentName: [],
                managerName: '',
                manager: '',
                type: '',
                position: '',
                repairItem: '',
                feedbackMan: '',
                feedbackContact: '',
                content: '',
                importance: '',
                priority: '',
                department: '',
                executor: '',
                origin: '1',
                executorName: '',
                creatorName: '',
                leaders: [],
            },
            isSelectDevice: true,
            tableConf: {
                data: [],
                hide_split_page: true,
                colConf: [
                    {
                        prop: 'name',
                        lab: '设备名称',
                    },
                    {
                        prop: 'deviceSn',
                        lab: '设备编号',
                    },
                    {
                        prop: 'typeDesc',
                        lab: '设备类型',
                    },
                    {
                        prop: 'model',
                        lab: '规格型号',
                    },
                    {
                        prop: 'floorName',
                        lab: '安装楼层',
                    },
                    {
                        prop: 'position',
                        lab: '具体位置',
                    },
                    {
                        type: 'button',
                        width: 150,
                        lab: '操作',
                        sub_conf: [
                            {
                                size: 'mini',
                                text: '详情',
                                event: data => {
                                    this.$router.push({name: 'superdev-groupinfo', query: {id: data.scope.row.deviceId}});
                                },
                            },
                            {
                                size: 'mini',
                                text: '删除',
                                event: data => {
                                    this.$confirm('是否删除?', '提示', {
                                        confirmButtonText: '确定',
                                        cancelButtonText: '取消',
                                        type: 'warning',
                                    }).then(() => {
                                        this.tableConf.data.splice(data.scope.$index, 1);
                                    });
                                },
                            },
                        ],
                    },
                ],
            },
            rules: {
                type: [{required: true, message: '请选择', trigger: 'blur'}],
                position: [{required: true, message: '请输入', trigger: 'blur'}],
                content: [{required: true, message: '请输入', trigger: 'blur'}],
                importance: [{required: true, message: '请选择', trigger: 'blur'}],
                priority: [{required: true, message: '请选择', trigger: 'blur'}],
                repairItem: [{required: true, message: '请输入', trigger: 'blur'}],
            },
        };
    },
    computed: {
        imageLimit() {
            return new Array(3);
        },
        order_type() {
            return order_type;
        },
        prioritys() {
            return prioritys;
        },
        formDataType() {
            return this.formData.type;
        },
    },
    watch: {
        formDataType(val) {
            if (val > 3) {
                this.$http({
                    url: this.$http.adornUrl('/v1/dict/repairItem?type=' + (val - 3)),
                    method: 'get',
                }).then(data => {
                    data = data.data;
                    if (data && data.code === 200) {
                        this.optionsArr = data.data.options;
                    }
                });
            }
        },
    },
    methods: {
        selectDevice() {
            if (this.tableConf.data.length > 0) {
                this.$message('最多添加一个设备');
                return false;
            }
            this.isSelectDevice = true;
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init(this.deviceIdList);
            });
        },
        callBackId(data) {
            this.$http({
                url: this.$http.adornUrl('/v1/pm/devices/' + data + '/details'),
                method: 'get',
            }).then(data => {
                data = data.data;
                if (data && data.code === 200) {
                    this.tableConf.data.unshift(data.data);
                }
            });
        },
        addImage() {
            if (this.imageArr.length > this.imageLimit.length) {
                this.$message('最多添加三张图片');
                return false;
            }
            let input = $('input#plus_img_' + this.imageArr.length);
            $(input).trigger('click');
        },
        deleteImg(index) {
            this.$confirm('是否删除此张图片?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                this.imageArr.splice(index, 1);
            });
        },
        plus_img_change(e) {
            this.readFile($($(e.currentTarget))[0].files[0]);
            $(e.currentTarget).val('');
        },
        readFile(file) {
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = e => {
                this.imageArr.push({
                    src: e.target.result,
                    file,
                });
            };
        },
        postInfo() {
            this.$refs['dataFormRef'].validate(valid => {
                if (valid) {
                    if (this.formData.executor == '') {
                        this.$message.error('请选择执行人');
                        return false;
                    }
                    if (this.formData.manager == '') {
                        this.$message.error('请选择负责人');
                        return false;
                    }
                    if (!this.tableConf.data.length) {
                        this.$message.error('请选择设备');
                        return false;
                    }
                    if (this.imageArr.length > 0) {
                        let isArray = this.imageArr;
                        if (
                            isArray.some(item => {
                                return typeof item === 'object';
                            })
                        ) {
                            this.imageArr.map(obj => {
                                typeof obj === 'object' &&
                                    this.uploadImg(obj.file, res => {
                                        obj.httpurl = res.url;
                                        if (
                                            !this.imageArr.some(item => {
                                                return typeof item === 'object' && !item.httpurl;
                                            })
                                        ) {
                                            let img_arr = this.imageArr.map(imgObj => {
                                                return typeof imgObj === 'object' ? imgObj.httpurl : imgObj;
                                            });
                                            // 提交数据
                                            let deviceIdList = [];
                                            deviceIdList.push(this.tableConf.data[0].deviceId);
                                            this.$http({
                                                url: this.$http.adornUrl('/v1/pm/regularization/tickets'),
                                                method: 'post',
                                                data: this.$http.adornData(
                                                    $.extend(this.formData, {
                                                        image: img_arr.join(','),
                                                        deviceIds: deviceIdList,
                                                    })
                                                ),
                                            }).then(({data}) => {
                                                if (data.code == 201) {
                                                    this.$message({
                                                        message: '工单新建成功',
                                                        type: 'success',
                                                    });
                                                    this.formData = JSON.parse(JSON.stringify(this.default_formData));
                                                    this.imageArr = [];
                                                    this.deviceIdList = [];
                                                    this.tableConf.data = [];
                                                    this.optionsArr = [];
                                                    this.$refs.select.clearLabelText();
                                                }
                                            });
                                        }
                                    });
                            });
                        } else {
                            let img_arr = this.imageArr.map(imgObj => {
                                return typeof imgObj === 'object' ? imgObj.httpurl : imgObj;
                            });
                            // 提交数据
                            let deviceIdList = [];
                            deviceIdList.push(this.tableConf.data[0].deviceId);
                            // 提交数据
                            this.$http({
                                url: this.$http.adornUrl('/v1/pm/regularization/tickets'),
                                method: 'post',
                                data: this.$http.adornData(
                                    $.extend(this.formData, {
                                        image: img_arr.join(','),
                                        deviceIds: deviceIdList,
                                    })
                                ),
                            }).then(({data}) => {
                                if (data.code == 201) {
                                    this.$message({
                                        message: '工单新建成功',
                                        type: 'success',
                                    });
                                    this.formData = JSON.parse(JSON.stringify(this.default_formData));
                                    this.imageArr = [];
                                    this.deviceIdList = [];
                                    this.tableConf.data = [];
                                    this.optionsArr = [];
                                    this.$refs.select.clearLabelText();
                                }
                            });
                        }
                    } else {
                        // 提交数据
                        // 提交数据
                        let deviceIdList = [];
                        deviceIdList.push(this.tableConf.data[0].deviceId);
                        this.$http({
                            url: this.$http.adornUrl('/v1/pm/regularization/tickets'),
                            method: 'post',
                            data: this.$http.adornData(
                                $.extend(this.formData, {
                                    deviceIds: deviceIdList,
                                })
                            ),
                        }).then(({data}) => {
                            if (data.code == 201) {
                                this.$message({
                                    message: '工单新建成功',
                                    type: 'success',
                                });
                                this.formData = JSON.parse(JSON.stringify(this.default_formData));
                                this.imageArr = [];
                                this.deviceIdList = [];
                                this.tableConf.data = [];
                                this.optionsArr = [];
                                this.$refs.select.clearLabelText();
                            }
                        });
                    }
                }
            });
        },
        uploadImg(file, callBack) {
            this.$http.get(this.$http.adornUrl('/v1/oss/tokens')).then(res => {
                if (res.data.code == 200) {
                    var client = new OSS({
                        accessKeyId: res.data.data.accessKeyId,
                        endpoint: res.data.data.endPoint,
                        accessKeySecret: res.data.data.accessKeySecret,
                        bucket: res.data.data.bucket,
                        region: res.data.data.region,
                        stsToken: res.data.data.securityToken,
                    });
                    co(function*() {
                        var timeStamp = new Date().getTime();
                        var result = yield client.put(workerOrder + timeStamp, file); //新增商品-上传的图片
                        callBack && callBack(result);
                    });
                } else {
                    return false;
                }
            });
        },
        requestDataByServiceId() {
            this.$http({
                url: this.$http.adornUrl('/v1/prop/services/' + this.$route.query.id + '/details'),
                method: 'get',
            }).then(({data}) => {
                if (data && data.code === 200) {
                    for (let key in data.data) {
                        if (key != 'type') {
                            this.formData[key] = data.data[key];
                        }
                    }
                    this.formData.creatorName = data.data.userName;
                    this.formData.contact = data.data.userAccount;
                    this.formData.feedbackMan = data.data.userName;
                    this.formData.feedbackContact = data.data.userAccount;
                    this.imageArr = data.data.image.split(',');
                    if (data.data.image.length == 0) {
                        this.imageArr = [];
                    }
                    if (data.data.type == 2) {
                        if (data.data.repairType == 1) {
                            this.formData.type = 4;
                        } else {
                            this.formData.type = 5;
                        }
                    } else if (data.data.type == 1) {
                        this.formData.type = 2;
                    } else if (data.data.type == 3) {
                        this.formData.type = 1;
                    }
                }
            });
        },
    },
    mounted() {
        this.default_formData = JSON.parse(JSON.stringify(this.formData));
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            if (vm.$route.query.id) {
                vm.requestDataByServiceId();
                vm.formData.origin = 2;
            }
        });
    },
};
</script>

<style>
.normal_btn {
    width: 120px;
    height: 40px;
}

.margin_top_20 {
    margin-top: 20px;
}

.margin_top_12 {
    margin-top: 12px;
}

.c999 {
    color: #999999;
}

.plus_icon {
    position: relative;
    width: 100px;
    height: 100px;
    margin-right: 16px;
    border: 1px solid #dddddd;
    display: flex;
    justify-content: center;
    align-items: center;
}

.title_container {
    display: flex;
    align-items: center;
    height: 44px;
    margin-top: 10px;
    padding-left: 16px;
    border: 1px solid #dddddd;
    color: #666666;
    background-color: #f9f9f9;
}
</style>
