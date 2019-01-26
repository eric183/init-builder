<template>
    <div class="super_addor_update">
        <el-form :model="dataForm" :rules="dataRule" label-position="top" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px" size="small">
            <h4>设备常规信息:</h4>
            <div class="popr">
                <div class="device-box">
                    <el-form-item label="设备名称" prop="name"> <el-input v-model="dataForm.name" placeholder="不超过32个字" :maxlength="32" clearable></el-input> </el-form-item>
                </div>
                <div class="device-box">
                    <el-form-item label="设备编号" prop="deviceSn"> <el-input v-model="dataForm.deviceSn" placeholder="不超过32个字" clearable></el-input> </el-form-item>
                </div>
                <div class="device-box">
                    <el-form-item label="规格型号" prop="model"> <el-input v-model="dataForm.model" placeholder="不超过32个字" :maxlength="32" clearable></el-input> </el-form-item>
                </div>
                <div class="device-box">
                    <el-form-item label="设备类型" prop="type">
                        <el-select v-model="dataForm.type" placeholder="类别" :disabled="isTrueOrFalse">
                            <el-option v-for="item in typelist" :key="item.type" :label="item.typeDesc" :value="item.type"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </div>
            <div class="popr">
                <div class="device-box">
                    <el-form-item label="生产厂商" prop="producer"> <el-input v-model="dataForm.producer" placeholder="不超过32个字" :maxlength="32" clearable></el-input> </el-form-item>
                </div>
                <div class="device-box">
                    <el-form-item label="固定资产编号" prop="assetSn"> <el-input v-model="dataForm.assetSn" placeholder="不超过32个字" :maxlength="32" clearable></el-input> </el-form-item>
                </div>
                <div class="device-box">
                    <el-form-item label="对接系统产商" prop="dockingProducer">
                        <el-input v-model="dataForm.dockingProducer" placeholder="不超过32个字" :maxlength="32" clearable></el-input>
                    </el-form-item>
                </div>
                <div class="device-box">
                    <el-form-item label="所属单位" prop="possession"> <el-input v-model="dataForm.possession" placeholder="不超过32个字" :maxlength="32" clearable></el-input> </el-form-item>
                </div>
            </div>
            <div class="popr">
                <div class="device-box" :class="{showdoor: dataForm.type == 3 || dataForm.type == 4 || dataForm.type == 5}">
                    <el-form-item label="安装楼层" prop="floorId">
                        <el-select v-model="dataForm.floorId" placeholder="楼层" @change="floorChange">
                            <el-option v-for="item in foorlist" :key="item.floorId" :label="item.name" :value="item.floorId"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="安装门牌" prop="doorplateId" v-if="dataForm.type == 3 || dataForm.type == 4 || dataForm.type == 5">
                        <el-select v-model="dataForm.doorplateId" placeholder="门牌">
                            <el-option v-for="item in doorlist" :key="item.doorplateId" :label="item.name" :value="item.doorplateId"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="device-box">
                    <el-form-item label="具体位置" prop="position"> <el-input v-model="dataForm.position" placeholder="不超过64个字" :maxlength="64" clearable></el-input> </el-form-item>
                </div>
                <div class="device-box">
                    <el-form-item label="安装日期" prop="installationTime">
                        <el-date-picker v-model="dataForm.installationTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期"> </el-date-picker>
                    </el-form-item>
                </div>
                <div class="device-box">
                    <el-form-item label="维保截至时间" prop="expirationTime">
                        <el-date-picker v-model="dataForm.expirationTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期"> </el-date-picker>
                    </el-form-item>
                </div>
            </div>
            <div class="popr">
                <div class="remark">
                    <el-form-item label="备注" prop="remark">
                        <el-input type="textarea" :rows="7" v-model="dataForm.remark" placeholder="不超过255个字" :maxlength="255" clearable></el-input>
                    </el-form-item>
                </div>
                <div class="device-box imgBox">
                    <el-form-item label="图片" class="advertImage" prop="image">
                        <el-upload ref="upload" :action="''" :http-request="myUpload" list-type="picture-card" :limit="1" :before-upload="beforeAvatarUpload" :on-remove="onRemove">
                            <img v-if="dataForm.image" :src="dataForm.image" class="avatar" /> <i class="el-icon-plus"></i>
                        </el-upload>
                    </el-form-item>
                    <h5>上传1张,格式png, jpg,不超过600KB</h5>
                </div>
                <div class="device-box"></div>
            </div>
            <h4>设备技术参数:</h4>
            <el-row class="deviceArge">
                <el-row v-for="(item, index) in dataForm.deviceArgs" :key="index" class="ml20">
                    <span>名称：</span><el-input v-model="item.key" size="mini" placeholder="参数名称"></el-input> <span>内容：</span
                    ><el-input v-model="item.value" size="mini" placeholder="参数值"></el-input>
                </el-row>
                <span class="add-icon" @click="addDeviceArge">+</span> <span class="add-icon" @click="redDeviceArge" v-if="dataForm.deviceArgs.length > 0">-</span>
            </el-row>
            <div>
                <el-button size="small" type="success" @click="$router.go(-1)">取消</el-button>
                <el-button size="small" type="primary" @click="dataFormSubmit()">确定</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
import {commonFunc,superdevices} from '@/utils/resources/index.js';
import co from 'co';
import OSS from 'ali-oss';
export default {
    data() {
        return {
            foorlist: [],
            doorlist: [], //门牌下拉的数组
            typelist: [],
            dataForm: {
                id: 0,
                installationTime: '',
                name: '',
                type: null,
                image: '',
                model: '',
                floorId: '',
                doorplateId: null,
                position: '',
                deviceSn: '',
                expirationTime: '',
                possession: '',
                producer: '',
                dockingProducer: '',
                remark: '',
                deviceArgs: [{key: '', value: ''}],
            },
            isTrueOrFalse: false, //设备类型在新增 和 修改 是否可选择
            dataRule: {
                name: [{required: true, message: '请输入设备名称', trigger: 'blur'}],
                installationTime: [{required: true, message: '请选择安装时间', trigger: 'blur'}],
                type: [{required: true, message: '请选择设备类型', trigger: 'blur'}],
                model: [{required: true, message: '请输入设备型号', trigger: 'blur'}],
                floorId: [{required: true, message: '请选择楼层', trigger: 'blur'}],
                position: [{required: true, message: '请输入具体位置', trigger: 'blur'}],
                deviceSn: [{required: true, message: '请输入设备编号', trigger: 'blur'}],
                producer: [{required: true, message: '请输入设备生产厂商', trigger: 'blur'}],
            },
        };
    },
    activated() {
        this.getDeviceOptions();
        this.getFloorList();
        if (this.$route.query.deviceId) {
            this.dataForm.id = this.$route.query.deviceId; //路由跳转拿到参数
        } else {
            this.dataForm.id = 0;
        }
        if (this.dataForm.id) {
            this.getDeviceInfo();
            this.isTrueOrFalse = true;
        } else {
            this.isTrueOrFalse = false;
        }
    },
    deactivated() {
        this.$nextTick(() => {
            this.$refs['dataForm'].resetFields();
            this.dataForm.type = null; //resetFields 无法清空
            this.dataForm.deviceArgs = [{key: '', value: ''}]; //resetFields 无法清空
            this.$refs.upload.clearFiles();
        });
    },
    methods: {
        // 设备类型下拉列表
        getDeviceOptions() {
            this.$http({
                url: this.$http.adornUrl('/v1/pm/devices/typeOptions'),
                method: 'get',
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.typelist = data.data.types;
                }
            });
        },
        // 查询楼层列表
        getFloorList() {
            this.$http({
                url: this.$http.adornUrl('/v1/building/floors'),
                method: 'get',
                params: this.$http.adornParams({
                    pageNum: 1,
                    pageSize: 999,
                }),
            }).then(({data}) => {
                this.foorlist = data && data.code === 200 ? data.data.list : [];
            });
        },
        // 查询门牌
        getDoorplates(val) {
            this.$http({
                url: this.$http.adornUrl('/v1/building/doorplates'),
                method: 'get',
                params: this.$http.adornParams({
                    pageNum: 1,
                    pageSize: 999,
                    floorId: val,
                }),
            }).then(({data}) => {
                this.doorlist = data && data.code === 200 ? data.data.list : [];
            });
        },
        // 切换楼层
        floorChange(val) {
            this.getDoorplates(val);
        },
        // 编辑进来
        getDeviceInfo() {
            this.$http({
                url: this.$http.adornUrl('/v1/pm/devices/' + this.dataForm.id + '/details'),
                method: 'get',
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.dataForm.type = data.data.type;
                    this.dataForm.installationTime = commonFunc(data.data.installationTime);
                    this.dataForm.name = data.data.name;
                    this.dataForm.assetSn = data.data.assetSn;
                    this.dataForm.image = data.data.image;
                    this.dataForm.model = data.data.model;
                    this.dataForm.floorId = data.data.floorId;
                    this.dataForm.doorplateId = data.data.doorplateId;
                    this.dataForm.position = data.data.position;
                    this.dataForm.deviceSn = data.data.deviceSn;
                    this.dataForm.expirationTime = commonFunc(data.data.expirationTime);
                    this.dataForm.possession = data.data.possession;
                    this.dataForm.producer = data.data.producer;
                    this.dataForm.dockingProducer = data.data.dockingProducer;
                    this.dataForm.remark = data.data.remark;
                    if (data.data.deviceArgs && JSON.parse(data.data.deviceArgs).constructor === Array) {
                        this.dataForm.deviceArgs = JSON.parse(data.data.deviceArgs);
                    } else {
                        this.dataForm.deviceArgs = [];
                    }
                    if (this.dataForm.type == 3 || this.dataForm.type == 4 || this.dataForm.type == 5) {
                        this.getDoorplates(data.data.floorId);
                    }
                }
            });
        },
        myUpload(content) {
            content.onSuccess('配时文件上传成功');
        },
        beforeAvatarUpload(file) {
            const that = this;
            const isJPG = file.type === 'image/jpeg';
            const isJPG2 = file.type === 'image/png';
            const isLt600k = file.size / 1024 <= 600;
            if (!isLt600k) {
                this.$message.error('图片大小请不要超过600K');
                return false;
            }
            if (!isJPG && !isJPG2) {
                this.$message.error('上传图片暂时只支持JPG,png格式');
                this.$refs.upload.clearFiles();
            } else {
                this.$http.get(that.$http.adornUrl('/v1/oss/tokens')).then(function(res) {
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
                            var result = yield client.put(superdevices + timeStamp, file); //新增商品-上传的图片
                            that.dataForm.image = result.url;
                        });
                    } else {
                        return false;
                    }
                });
            }
        },
        onRemove() {
            this.dataForm.image = '';
        },
        // 表单提交
        dataFormSubmit() {
            if (this.dataForm.deviceArgs.length > 0) {
                this.dataForm.deviceArgs.map((obj, index) => {
                    if (obj.key == '' && obj.value == '') {
                        this.dataForm.deviceArgs.splice(index, 1);
                    }
                });
            }
            this.$refs['dataForm'].validate(valid => {
                if (valid) {
                    this.$http({
                        url: this.$http.adornUrl(this.dataForm.id == 0 ? `/v1/pm/devices` : `/v1/pm/devices/` + this.dataForm.id),
                        method: this.dataForm.id == 0 ? 'post' : 'put',
                        data: this.$http.adornData({
                            type: this.dataForm.id == 0 ? this.dataForm.type : undefined,
                            installationTime: this.dataForm.installationTime,
                            name: this.dataForm.name,
                            assetSn: this.dataForm.assetSn,
                            image: this.dataForm.image,
                            model: this.dataForm.model,
                            floorId: this.dataForm.floorId,
                            doorplateId: this.dataForm.doorplateId,
                            position: this.dataForm.position,
                            deviceSn: this.dataForm.deviceSn,
                            expirationTime: this.dataForm.expirationTime,
                            possession: this.dataForm.possession,
                            producer: this.dataForm.producer,
                            dockingProducer: this.dataForm.dockingProducer,
                            remark: this.dataForm.remark,
                            deviceArgs: JSON.stringify(this.dataForm.deviceArgs),
                        }),
                    }).then(({data}) => {
                        if (data && data.code === 201) {
                            this.$message({
                                message: '操作成功',
                                type: 'success',
                                duration: 1500,
                                onClose: () => {
                                    this.$router.push({path: '/superdev-group'});
                                },
                            });
                        }
                    });
                }
            });
        },
        // 新增技术参数字段
        addDeviceArge() {
            this.dataForm.deviceArgs.push({key: '', value: ''});
        },
        // 减去技术参数字段
        redDeviceArge() {
            this.dataForm.deviceArgs.pop();
        },
    },
};
</script>
<style scoped>
.imgBox {
    position: relative;
}
h5 {
    color: #aaa;
}
.advertImage >>> .el-form-item__content {
    width: 148px !important  ;
    height: 148px !important  ;
    overflow: hidden !important;
    position: relative;
}
div.showdoor {
    display: flex;
}
.deviceArge {
    margin: 10px 0;
    display: flex;
    flex-wrap: wrap;
}
.deviceArge .el-input {
    width: 200px;
}
.add-icon {
    font-size: 18px;
    margin-left: 10px;
    margin-top: 4px;
    cursor: pointer;
}
.require {
    color: #f56c6c;
}
</style>
