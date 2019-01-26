<template>
    <el-row>
        <el-row>
            <el-row class="title_container f14 h_44">
                <el-col :span="12">故障设备信息:</el-col>
                <el-col :span="12" style="display: flex;justify-content: flex-end;">
                    <el-row style="margin: 0 20px;"> <el-button type="primary" size="mini" @click="selectDevice">添加设备</el-button> </el-row>
                </el-col>
            </el-row>
            <el-row style="border: 1px solid #DDDDDD;min-height: 100px;"> <ZZTable ref="table" :conf="tableConf" v-if="tableConf.data.length"></ZZTable> </el-row>
            <el-row class="title_container f14 h_44"> 设备故障描述: </el-row>
            <el-row style="border: 1px solid #DDDDDD;">
                <div style="margin: 0 20px">
                    <el-form :model="formData" ref="dataFormRef" label-width="100px" :rules="rules">
                        <el-form-item label="故障描述" class="margin_top_20" prop="description">
                            <el-col :span="20"> <el-input type="textarea" :rows="4" v-model="formData.description" placeholder="请输入设备故障描述"></el-input> </el-col>
                        </el-form-item>
                        <div style="position:relative">
                            <el-form-item label="图片">
                                <el-col :span="12">
                                    <el-row style="cursor: pointer;display: flex;justify-content: flex-start;">
                                        <div class="plus_icon" v-for="(img, index) in imageArr" :key="index">
                                            <img :src="img.src" height="100%" width="auto" style="overflow: hidden;" @click="deleteImg(index)" />
                                        </div>
                                        <div class="plus_icon" @click="addImage"><i class="el-icon-plus" style="font-size: 24px;"></i></div>
                                        <div style="display: none;">
                                            <input v-for="(plus_img, index) in imageLimit" 
                                                :key="index"
                                                @change="plus_img_change" 
                                                :id="'plus_img_' + index" 
                                                type="file" 
                                                accept="image/jpeg,image/png" />
                                        </div>
                                    </el-row>
                                    <el-row class="margin_top_12 c999"> 最多上传三张图片，格式jpg、png、jpeg </el-row>
                                </el-col>
                            </el-form-item>
                        </div>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="报事人" prop="feedbackMan" style="width:80%">
                                    <el-input v-model="formData.feedbackMan" placeholder="请输入16个字以内字符"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="报事人手机号" prop="feedbackContact" style="width:80%">
                                    <el-input v-model="formData.feedbackContact" placeholder="请输入报事人手机号"></el-input>
                                </el-form-item>
                            </el-col>
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
                    </el-form>
                    <ExcutorSelect ref="select" :formData="formData"></ExcutorSelect>
                </div>
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
import {fixDevice} from '@/assets/imgjs.js';
import {prioritys, order_origin, fix_status} from '@/assets/js/Const';
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
            isSelectDevice: true,
            deviceIdList: [],
            imageArr: [],
            default_formData: '',
            formData: {
                departmentName: [],
                description: '',
                feedbackMan: '',
                feedbackContact: '',
                importance: '',
                priority: '',
                department: '',
                executor: '',
                origin: '1',
            },
            rules: {
                description: [{required: true, message: '请输入', trigger: 'blur'}],
                importance: [{required: true, message: '请选择', trigger: 'blur'}],
                priority: [{required: true, message: '请选择', trigger: 'blur'}],
            },
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
        };
    },
    computed: {
        imageLimit() {
            return new Array(3);
        },
        prioritys() {
            return prioritys;
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
        postInfo() {
            this.$refs['dataFormRef'].validate(valid => {
                if (valid) {
                    if (this.tableConf.data.length == 0) {
                        this.$message.error('请选择设备');
                        return false;
                    }
                    if (this.formData.executor == '') {
                        this.$message.error('请选择执行人');
                        return false;
                    }
                    if (this.imageArr.length > 0) {
                        this.imageArr.map(obj => {
                            this.uploadImg(obj.file, res => {
                                obj.httpurl = res.url;
                                if (
                                    !this.imageArr.some(item => {
                                        return !item.httpurl;
                                    })
                                ) {
                                    let img_arr = this.imageArr.map(imgObj => {
                                        return imgObj.httpurl;
                                    });
                                    // 提交数据
                                    this.$http({
                                        url: this.$http.adornUrl('/v1/pm/repairment/tickets'),
                                        method: 'post',
                                        data: this.$http.adornData(
                                            $.extend(this.formData, {
                                                image: img_arr.join(','),
                                                deviceId: this.tableConf.data[0].deviceId,
                                            })
                                        ),
                                    }).then(({data}) => {
                                        if (data.code == 201) {
                                            this.$message({
                                                message: '维修工单提交成功',
                                                type: 'success',
                                            });
                                            this.formData = JSON.parse(JSON.stringify(this.default_formData));
                                            this.imageArr = [];
                                            this.deviceIdList = [];
                                            this.tableConf.data = [];
                                            this.$refs.select.clearLabelText();
                                        }
                                    });
                                }
                            });
                        });
                    } else {
                        // 提交数据
                        this.$http({
                            url: this.$http.adornUrl('/v1/pm/repairment/tickets'),
                            method: 'post',
                            data: this.$http.adornData(
                                $.extend(this.formData, {
                                    deviceId: this.tableConf.data[0].deviceId,
                                })
                            ),
                        }).then(({data}) => {
                            if (data.code == 201) {
                                this.$message({
                                    message: '维修工单提交成功',
                                    type: 'success',
                                });
                                this.formData = JSON.parse(JSON.stringify(this.default_formData));
                                this.imageArr = [];
                                this.deviceIdList = [];
                                this.tableConf.data = [];
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
                        var result = yield client.put(fixDevice + timeStamp, file); //新增商品-上传的图片
                        callBack && callBack(result);
                    });
                } else {
                    return false;
                }
            });
        },
    },
    mounted() {
        this.default_formData = JSON.parse(JSON.stringify(this.formData));
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
