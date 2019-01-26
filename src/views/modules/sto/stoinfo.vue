<template>
    <!-- 店铺信息管理 -->
    <div class="storedetail stoinfo">
        <el-tabs type="border-card">
            <el-tab-pane label="店铺基本信息">
                <el-form ref="storeform" :model="storeform" :rules="storeformRule" label-width="130px" size="small">
                    <el-form-item label="营业时间" prop="openTime">
                        <div class="openListTime">
                            <div v-for="(item, index) in openingDuringArray" :key="index" class="inlineDiv">
                                <el-time-picker
                                    is-range
                                    v-model="openingDuringArray[index]"
                                    format="HH:mm"
                                    value-format="HH:mm"
                                    range-separator="-"
                                    start-placeholder="开始"
                                    end-placeholder="结束"
                                    @change="dateChange"
                                    :clearable="true"
                                >
                                </el-time-picker>
                            </div>
                            <span class="addicon ml30" @click="addicon" v-if="addiconState">+</span> <span class="addicon ml30" @click="removeIcon" v-if="removeIconState">-</span>
                        </div>
                    </el-form-item>
                    <div class="statuebox">
                        <div class="box">
                            <el-form-item label="店铺状态" prop="status">
                                <el-switch :width="35" v-model="storeform.status" active-text="营业" :active-value="1" inactive-text="歇业" :inactive-value="2"> </el-switch>
                            </el-form-item>
                        </div>
                        <div class="box ml30">
                            <el-form-item label="是否自动接单" prop="isAutoReceived">
                                <el-switch :width="35" v-model="storeform.isAutoReceived" active-text="是" :active-value="1" inactive-text="否" :inactive-value="0"> </el-switch>
                            </el-form-item>
                        </div>
                    </div>
                    <el-form-item label="打印机设备终端号" prop="printerDeviceCode">
                        <el-input v-model="storeform.printerDeviceCode" placeholder="打印机设备终端号，多个用逗号分割,不超过3个" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="店铺公告" prop="announcement">
                        <el-input v-model="storeform.announcement" type="textarea" placeholder="店铺公告请不要超过100字（含）" clearable></el-input>
                    </el-form-item>
                    <div class="formbox">
                        <div class="box">
                            <el-form-item label="服务电话" prop="contact"> <el-input v-model="storeform.contact" placeholder="服务电话" clearable></el-input> </el-form-item>
                        </div>
                        <div class="box">
                            <el-form-item label="起送金额" prop="startExpressAmount">
                                <el-input v-model="storeform.startExpressAmount" placeholder="起送金额" clearable>
                                    <template slot="append"
                                        >元</template
                                    >
                                </el-input>
                            </el-form-item>
                        </div>
                        <div class="box">
                            <el-form-item label="配送费(元)" prop="deliveryFee">
                                <el-input v-model="storeform.deliveryFee" placeholder="配送费" clearable>
                                    <template slot="append"
                                        >元</template
                                    >
                                </el-input>
                            </el-form-item>
                        </div>
                    </div>
                    <div class="divBox">
                        <el-form-item label="店铺封面图片:" class="advertImage" prop="storeImg">
                            <el-upload
                                ref="upload"
                                :action="UploadUrl()"
                                :http-request="myUpload"
                                list-type="picture-card"
                                :limit="1"
                                :before-upload="beforeAvatarUpload"
                                :on-exceed="previewFun"
                                :on-remove="onRemove"
                            >
                                <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                                <!-- <i class="el-icon-plus" v-if="condition"></i> -->
                            </el-upload>
                        </el-form-item>
                        <span class="tip_1">*</span>
                        <h5 class="tip1">
                            <p>上传一张图片,不超过50kb.</p>
                            <p>格式jpg,png,建议尺寸750*460(16：10)</p>
                        </h5>
                        <el-form-item label="店铺logo图片:" class="advertImage">
                            <el-upload
                                ref="upload2"
                                action=""
                                :http-request="myUpload"
                                list-type="picture-card"
                                :limit="1"
                                :on-exceed="previewFun"
                                :before-upload="beforeAvatarUpload2"
                                :on-remove="onRemove2"
                            >
                                <img v-if="imageUrl2" :src="imageUrl2" class="avatar2" />
                                <!-- <i class="el-icon-plus" v-if="condition"></i> -->
                            </el-upload>
                        </el-form-item>
                        <span class="tip_2">*</span>
                        <h5 class="tip2">
                            <p>上传1张图片,&nbsp;不超过20kb.</p>
                            <p>格式jpg,png,&nbsp;建议尺寸160*160(1:1)</p>
                        </h5>
                    </div>
                    <el-form-item>
                        <el-button class="mt30" @click="$router.go(-1)" size="mini">返回</el-button>
                        <el-button v-if="isAuth('merchant:shops:updateShop2')" type="primary" size="mini" @click="addconfirm('storeform')">提交</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="店铺注册信息">
                <el-form ref="storeformReg" :model="shopRegisterInfo" :rules="storeform" label-width="100px" :disabled="true">
                    <div class="dialogbox">
                        <el-form-item label="店铺类型">
                            <el-select placeholder="请选择" v-model="shopRegisterInfo.type">
                                <el-option v-for="item in shopTypelist" :key="item.groupId" :label="item.groupName" :value="item.groupId"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="店铺名称"> <el-input placeholder="请输入内容" v-model="shopRegisterInfo.shopName"></el-input> </el-form-item>
                    </div>
                    <div class="dialogbox">
                        <el-form-item label="店铺介绍"> <el-input placeholder="请输入内容" type="textarea" v-model="shopRegisterInfo.brief"></el-input> </el-form-item>
                    </div>
                    <div class="dialogbox">
                        <el-form-item label="店铺地址"> <el-input placeholder="请输入内容" v-model="shopRegisterInfo.address"></el-input> </el-form-item>
                    </div>
                    <div class="dialogbox">
                        <el-form-item label="店主姓名"> <el-input placeholder="请输入内容" v-model="shopRegisterInfo.operator"></el-input> </el-form-item>
                        <el-form-item label="店主联系方式"> <el-input placeholder="请输入内容" v-model="shopRegisterInfo.operatorContact"></el-input> </el-form-item>
                        <el-form-item label="店主身份证号"> <el-input placeholder="请输入内容" v-model="shopRegisterInfo.idCardNo"></el-input> </el-form-item>
                    </div>
                </el-form>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import qs from 'qs';
import {shops} from '@/assets/imgjs.js';
var co = require('co');
var OSS = require('ali-oss');
export default {
    name: 'Shopdetail',
    data() {
        return {
            storeform: {
                openingDuring: '',
                status: '',
                isAutoReceived: '',
                announcement: '',
                contact: '',
                startExpressAmount: '',
                expressFee: '',
                coverImg: '',
                logoImg: '',
                printerDeviceCode: '',
            },
            temUrlParam: '?x-oss-process=image/resize,w_200/blur,r_20,s_2', //店铺封面图片传给后台多加一个临时参数
            shopRegisterInfo: {
                type: '',
                shopName: '',
                brief: '',
                address: '',
                operator: '',
                operatorContact: '',
                idCardNo: '',
            },
            shopId: null, //登录进来会选择店铺
            shopTypelist: [
                {
                    groupId: 1,
                    groupName: '美食',
                },
                {
                    groupId: 2,
                    groupName: '优品',
                },
            ],
            resourceIdList: [],
            imageUrl: '',
            imageUrl2: '',
            openingDuringArray: [''], //营业时间
            addiconState: true,
            removeIconState: false,
            upLoadData: {
                originalUrl: '',
                hostUrl: '',
            },
            // 校验规则
            storeformRule: {},
        };
    },
    activated: function() {
        var shopId = this.$route.query.shopId; //路由跳转拿到参数
        if (shopId) {
            this.shopId = shopId;
        } else {
            this.getStoreId();
        }
        this.searchshopdet();
    },
    methods: {
        // 获取店铺id信息
        getStoreId() {
            this.shops = JSON.parse(sessionStorage.getItem('shops') || '[]');
            if (this.shops.length > 0) {
                this.shopId = this.shops[0].shopId;
            }
        },
        searchshopdet() {
            const that = this;
            //this.$http.adornUrl("/v1/shops/"+this.shopId
            this.$http.get(this.$http.adornUrl2('/v1/merchant/shops/' + this.shopId + '/details')).then(function(res) {
                if (res.data.code == 200) {
                    that.storeform = res.data.data.shopBasicInfo;
                    that.shopRegisterInfo = res.data.data.shopRegisterInfo;
                    that.imageUrl = res.data.data.shopBasicInfo.coverImg;
                    that.imageUrl2 = res.data.data.shopBasicInfo.logoImg;
                    that.storeform.startExpressAmount = that.storeform.startExpressAmount / 100;
                    that.storeform.deliveryFee = that.storeform.deliveryFee / 100;
                    that.shopRegisterInfo.address = res.data.data.shopRegisterInfo.address;
                    that.shopRegisterInfo.type = res.data.data.shopRegisterInfo.type;
                    that.shopRegisterInfo.shopName = res.data.data.shopRegisterInfo.shopName;
                    that.shopRegisterInfo.brief = res.data.data.shopRegisterInfo.brief;
                    that.shopRegisterInfo.operator = res.data.data.shopRegisterInfo.operator;
                    that.shopRegisterInfo.operatorContact = res.data.data.shopRegisterInfo.operatorContact;
                    that.shopRegisterInfo.idCardNo = res.data.data.shopRegisterInfo.idCardNo;
                    that.openingDuringArray = res.data.data.shopBasicInfo.openingDuring.split(','); //营业时间
                    // 进来查一遍时间的数据，看看+号与减号是否显示
                    if (that.openingDuringArray.length == 2) {
                        that.addiconState = false;
                        that.removeIconState = true;
                    } else {
                        that.addiconState = true;
                        that.removeIconState = false;
                    }
                } else {
                    that.storeform = [];
                    that.shopRegisterInfo = [];
                }
            });
        },
        // 图片上传
        // 定义一个拦截不让upload自动上传（自动上传用的formData）
        myUpload(content) {
            content.onSuccess('配时文件上传成功');
        },
        beforeAvatarUpload(file, fileList) {
            //console.log(file)
            const that = this;
            const isJPG = file.type === 'image/jpeg';
            const isJPG2 = file.type === 'image/png';
            const isLt50k = file.size / 1024 <= 50;
            var isComTrue = true; //是否压缩  true为需要压缩
            if (!isLt50k) {
                isComTrue = true;
            } else {
                isComTrue = false;
            }
            if (!isJPG && !isJPG2) {
                this.$message.error('上传图片暂时只支持JPG,png格式');
                this.$refs.upload.clearFiles();
            } else {
                this.$http.get(that.$http.adornUrl('/v1/oss/tokens')).then(function(res) {
                    if (res.data.code == 200) {
                        //console.log(res.data.data);
                        var client = new OSS({
                            accessKeyId: res.data.data.accessKeyId,
                            endpoint: res.data.data.endPoint,
                            accessKeySecret: res.data.data.accessKeySecret,
                            bucket: res.data.data.bucket,
                            region: res.data.data.region,
                            stsToken: res.data.data.securityToken,
                        });
                        if (isComTrue) {
                            var com = function(param) {
                                lrz(param, {
                                    width: 750,
                                    quality: 0.7,
                                }).then(function(rst) {
                                    // console.log(rst)
                                    // console.log(rst.file.size/1024)
                                    var imgSize = rst.file.size / 1024;
                                    co(function*() {
                                        var timeStamp = new Date().getTime();
                                        var result = yield client.put(shops + timeStamp, rst.file); //新增商品-上传的图片
                                        that.storeform.coverImg = result.url;
                                        that.imageUrl = '';
                                    }).catch(function(err) {
                                        console.log(err);
                                    });
                                });
                            };
                            com(file);
                        } else {
                            co(function*() {
                                var timeStamp = new Date().getTime();
                                var result = yield client.put(shops + timeStamp, file); //店铺封面图
                                that.storeform.coverImg = result.url;
                                that.imageUrl = '';
                            });
                        }
                    } else {
                        return false;
                    }
                });
            }
        },
        beforeAvatarUpload2(file, fileList) {
            const that = this;
            const isJPG = file.type === 'image/jpeg';
            const isJPG2 = file.type === 'image/png';
            const isLt20k = file.size / 1024 <= 20;
            var isComTrue = true; //是否压缩  true为需要压缩
            if (!isLt20k) {
                isComTrue = true;
            } else {
                isComTrue = false;
            }
            if (!isJPG && !isJPG2) {
                this.$message.error('上传图片暂时只支持JPG,png格式');
                this.$refs.upload2.clearFiles();
            } else {
                this.$http.get(that.$http.adornUrl('/v1/oss/tokens')).then(function(res) {
                    if (res.data.code == 200) {
                        //console.log(res.data.data);
                        var client = new OSS({
                            accessKeyId: res.data.data.accessKeyId,
                            endpoint: res.data.data.endPoint,
                            accessKeySecret: res.data.data.accessKeySecret,
                            bucket: res.data.data.bucket,
                            region: res.data.data.region,
                            stsToken: res.data.data.securityToken,
                        });
                        if (isComTrue) {
                            lrz(file, {
                                width: 160,
                                quality: 0.7,
                            }).then(function(rst) {
                                co(function*() {
                                    var timeStamp = new Date().getTime();
                                    var result = yield client.put(shops + timeStamp, rst.file); //新增商品-上传的图片
                                    that.storeform.logoImg = result.url;
                                    that.imageUrl2 = '';
                                }).catch(function(err) {
                                    console.log(err);
                                });
                            });
                        } else {
                            co(function*() {
                                var timeStamp = new Date().getTime();
                                var result = yield client.put(shops + timeStamp, file); //店铺logo图片
                                that.storeform.logoImg = result.url;
                                that.imageUrl2 = '';
                            });
                        }
                    } else {
                        return false;
                    }
                });
            }
        },
        // 上传图片超出限制
        previewFun(files, fileList) {
            //console.log(fileList)
            if (fileList.length == 1) {
                this.$message.error('超过图片上传限制');
            }
        },
        onRemove(file) {
            //console.log(file)
            this.$refs.upload.clearFiles();
        },
        onRemove2(file) {
            //console.log(file)
            this.$refs.upload2.clearFiles();
        },
        addconfirm() {
            //openingDuringArray为数组下的数组
            var list = [];
            for (var i in this.openingDuringArray) {
                if (this.openingDuringArray[i].constructor == Array) {
                    list[i] = this.openingDuringArray[i].join('-');
                } else {
                    list[i] = this.openingDuringArray[i];
                }
            }
            this.storeform.openingDuring = list.join(',');
            const that = this;
            const str = this.storeform.printerDeviceCode.replace(/，/gi, ',');
            const strList = str.split(',');
            if (strList.length > 3) {
                this.$message.error('最多三台打印机终端设备');
                return false;
            }
            this.$refs['storeform'].validate(valid => {
                if (valid) {
                    this.$http
                        .put(this.$http.adornUrl2('/v1/merchant/shops/' + this.shopId), {
                            shopBasicInfo: {
                                openingDuring: this.storeform.openingDuring,
                                isAutoReceived: this.storeform.isAutoReceived,
                                deliveryFee: this.storeform.deliveryFee * 100,
                                printerDeviceCode: str,
                                logoImg: this.storeform.logoImg,
                                coverImg: this.storeform.coverImg.indexOf('?') != -1 ? this.storeform.coverImg : this.storeform.coverImg + this.temUrlParam,
                                contact: this.storeform.contact,
                                announcement: this.storeform.announcement,
                                status: this.storeform.status,
                                startExpressAmount: this.storeform.startExpressAmount * 100,
                            },
                        })
                        .then(function(res) {
                            if (res.data.code == 201) {
                                that.$message({
                                    message: '操作成功',
                                    type: 'success',
                                    duration: 1500,
                                });
                            }
                        });
                }
            });
        },
        dateChange(val) {
            //console.log(val);
            //console.log(this.openingDuringArray)
        },
        UploadUrl() {
            return '';
        },
        // 点击加号新增data时间控件
        addicon() {
            this.openingDuringArray.push('');
            if (this.openingDuringArray.length == 2) {
                this.addiconState = false;
                this.removeIconState = true;
            } else {
                this.addiconState = true;
                this.removeIconState = false;
            }
        },
        // 点击减号删除data时间控件
        removeIcon() {
            this.openingDuringArray.pop();
            if (this.openingDuringArray.length == 1) {
                this.removeIconState = false;
                this.addiconState = true;
            } else {
                this.removeIconState = true;
                this.addiconState = false;
            }
        },
        addicon2() {
            this.expresslist.push('');
            if (this.expresslist.length == 3) {
                this.addiconState2 = false;
            } else {
                this.addiconState2 = true;
            }
            this.removeIconState2 = true;
        },
        removeIcon2() {
            this.expresslist.pop();
            if (this.expresslist.length == 1) {
                this.removeIconState2 = false;
            } else {
                this.removeIconState2 = true;
            }
            this.addiconState2 = true;
        },
    },
};
</script>
<style lang="stylus" scoped>
  .advertImage >>> .el-form-item__content{
  width:148px!important  ;
  height:148px!important  ;
  overflow:hidden!important;
  position: relative;
}
</style>
