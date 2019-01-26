<template>
    <!-- 商品列表的新增 -->
    <el-form ref="shoppingaddform" :model="shoppingaddform" :rules="shoppAddRule" label-width="100px" size="small" label-position="top">
        <div class="dialogbox">
            <div class="flex1">
                <el-form-item label="商品名称" prop="goodsName"> <el-input placeholder="商品名称25个字以内(含)" clearable v-model="shoppingaddform.goodsName"></el-input> </el-form-item>
            </div>
            <el-form-item label="商品类别" prop="groupId">
                <el-select placeholder="请选择" v-model="shoppingaddform.groupId">
                    <el-option v-for="item in shoplist" :key="item.groupId" :label="item.groupName" :value="item.groupId"></el-option>
                </el-select>
            </el-form-item>
        </div>
        <el-form-item label="商品详情:" prop="description"> <el-input type="textarea" placeholder="商品描述300个字以内(含)" clearable v-model="shoppingaddform.description"></el-input> </el-form-item>
        <div class="dialogbox price">
            <el-form-item label="活动价(元)" prop="discountPrice"> <el-input placeholder="活动价" clearable v-model="shoppingaddform.discountPrice"></el-input> </el-form-item>
            <el-form-item label="销售价(元)" prop="salePrice"> <el-input placeholder="销售价" clearable v-model="shoppingaddform.salePrice"></el-input> </el-form-item>
            <el-form-item label="库存" prop="stock"> <el-input placeholder="库存" clearable v-model="shoppingaddform.stock"></el-input> </el-form-item>
            <el-form-item label="限购" prop="limitNum"> <el-input placeholder="限购" clearable v-model="shoppingaddform.limitNum"></el-input> </el-form-item>
            <el-form-item label="销量" prop="sales"> <el-input placeholder="销量" clearable v-model="shoppingaddform.sales" disabled></el-input> </el-form-item>
        </div>
        <div class="dialogbox">
            <div class="img50">
                <el-form-item label="商品图片" prop="shopImg" ref="uploadValid" label-position="left">
                    <el-upload
                        ref="upload"
                        :action="''"
                        :http-request="myUpload"
                        list-type="picture-card"
                        :limit="5"
                        :multiple="true"
                        :file-list="fileList1"
                        :before-upload="beforeAvatarUpload"
                        :on-exceed="previewFun"
                        :on-success="onSuccess"
                        :on-remove="onRemove"
                    >
                        <i v-if="condition" class="el-icon-plus"></i>
                    </el-upload>
                </el-form-item>
                <span class="tip">*</span>
                <h5 class="tips">上传1-4张图片,&nbsp;单张大小不超过200kb,格式jpg,png,&nbsp;建议尺寸750*750(1:1)</h5>
            </div>
            <div class="img50">
                <el-form-item label="商品详情" prop="coverImg">
                    <el-upload
                        ref="upload2"
                        :action="''"
                        :http-request="myUpload"
                        list-type="picture-card"
                        :limit="10"
                        :multiple="true"
                        :file-list="fileList2"
                        :before-upload="beforeAvatarUpload2"
                        :on-success="onSuccess2"
                        :on-remove="onRemoveDetail"
                    >
                        <i class="el-icon-plus"></i>
                    </el-upload>
                </el-form-item>
                <span class="tip">*</span>
                <h5 class="tips">上传0-10张图片,&nbsp;不超过200kb,格式jpg,png,&nbsp;建议尺寸750*2000</h5>
            </div>
        </div>
        <el-form-item class="mt10 leftbtn">
            <el-button type="primary" size="mini" @click="dataFormSubmit()">确认</el-button>
            <el-button size="mini" @click="addcancel()">返回</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import commonFunc from '@/assets/common.js';
import {goods} from '@/assets/imgjs.js';
import qs from 'qs';
var co = require('co');
var OSS = require('ali-oss');
export default {
    data() {
        return {
            // 登录时候存起来的shopId/shopType
            shopId: null,
            shopType: '', //店铺类型  (美食/优品)

            valueImg: [],
            shoppingaddform: {
                shopId: '',
                shopName: '',
                goodsId: '',
                groupId: '',
                goodsName: '',
                stock: '',
                salePrice: null,
                discountPrice: null,
                description: '',
                sales: '',
                bannerImg: '',
                detailImg: '',
                coverImg: '',
                startExpressAmount: '',
                deliveryFee: '',
                openingDuring: '',
                shopStatus: '',
                limitNum: '',
                type: '',
            }, //商品参数
            bannerImgList: [], //banner图片集合
            bannerList: [], //banner图片uid集合
            detailImgList: [], //商品详情图集合
            detailList: [], //商品详情图uid集合

            resourceIdList: [], //新增商品的图片资源id集合
            shopImgresourceIdList: [], //新增的时候商品banner图片的集合（--用来做必填校验的）
            editresourceIdList: [], //编辑商品的图片资源id集合
            removeImgList: [], //新增删除的时候记录图片的uuid
            removeImgList2: [], //编辑删除的时候记录图片的uuid
            shoppAddRule: {},
            shoplist: [], //新增和编辑时候的商品分类
            goodsId: 0,
            condition: true,
            upLoadData: {
                originalUrl: '',
                hostUrl: '',
            },
            isAddOrEdit: false,
            fileList1: [],
            fileList2: [],
            shoppAddRule: {
                groupId: [{required: true, message: '请选择商品类别', trigger: 'blur'}],
                goodsName: [{required: true, message: '请输入商品名称', trigger: 'blur'}, {min: 2, max: 25, message: '长度在 2 到 25 个字之间', trigger: 'blur'}],
                goodsDescDetail: [{min: 2, max: 300, message: '长度在 2 到 300 个字之间', trigger: 'blur'}],
                discountPrice: [{required: true, message: '请输入活动价', trigger: 'blur'}],
                salePrice: [{required: true, message: '请输入销售价', trigger: 'blur'}],
                stock: [{required: true, message: '请输入库存', trigger: 'blur'}],
                limitNum: [{required: true, message: '请输入限购字段', trigger: 'blur'}],
            },
        };
    },
    mounted() {
        this.$nextTick(() => {
            this.bannerImgList = []; //banner图片集合
            this.bannerList = []; //banner图片uid集合
            this.detailImgList = []; //商品详情图集合
            this.detailList = []; //商品详情图uid集合
        });
    },
    activated() {
        //console.log("我出来了啊")
        var goodsId = this.$route.query.goodsId; //路由跳转拿到参数
        this.goodsId = goodsId;
        // console.log(goodsId)
        if (goodsId) {
            this.isAddOrEdit = false; //编辑
            this.getGoodsInfo(goodsId);
        } else {
            this.isAddOrEdit = true; //新增
        }
        this.shoppingaddform = {};
        this.fileList1 = [];
        this.fileList2 = [];
        this.bannerImgList = []; //banner图片集合
        this.bannerList = []; //banner图片uid集合
        this.detailImgList = []; //商品详情图集合
        this.detailList = []; //商品详情图uid集合
        this.getShopInfo();
        this.shoppingGroup();
    },
    deactivated() {
        this.shoppingaddform = {};
        this.bannerImgList = []; //banner图片集合
        this.bannerList = []; //banner图片uid集合
        this.detailImgList = []; //商品详情图集合
        this.detailList = []; //商品详情图uid集合
        this.$refs.shoppingaddform.clearValidate();
    },
    methods: {
        //查看商品分类(新增时候的下拉)
        shoppingGroup() {
            let type = null;
            const that = this;
            var params = {};
            // shopType=1  代表身份是美食
            if (this.shopType == 1) {
                type = 22;
                params = {shopId: this.shopId, type: type};
            }
            if (this.shopType == 2) {
                type = 32;
                params = {type: type};
            }
            this.$http
                .get(this.$http.adornUrl2('/v1/product/groups'), {params: params})
                .then(function(res) {
                    if (res.data.code == 200) {
                        that.shoplist = res.data.data.list;
                    } else {
                        that.shoplist = [];
                    }
                })
                .catch(function(error) {
                    that.$message.error(error);
                });
        },
        //  从本地存储取出店铺的一些信息
        getShopInfo() {
            var shops = JSON.parse(sessionStorage.getItem('shops') || '[]');
            if (shops.length > 0) {
                this.shopId = shops[0].shopId;
                this.shopType = shops[0].shopType;
            } else {
                this.shopId = null;
                this.shopType = null;
            }
        },
        // 编辑进来需要先查一边数据
        getGoodsInfo(goodsId) {
            const that = this;
            //this.$http.adornUrl("/v1/goods/"+goodsId
            this.$http.get(this.$http.adornUrl2('/v1/product/goods/' + goodsId + '/details')).then(function(res) {
                if (res.data.code == 200) {
                    that.shoppingaddform = res.data.data;
                    // console.log(res.data.data.bannerImg)
                    // console.log(res.data.data.detailImg)
                    //banner图片和详情图片后端返回的字符串，需转换成数组回填到页面upload上
                    if (res.data.data.bannerImg.indexOf(',') != -1) {
                        that.bannerImgList = res.data.data.bannerImg.split(',');
                    } else {
                        that.bannerImgList.push(res.data.data.bannerImg);
                    }
                    for (var i in that.bannerImgList) {
                        var obj1 = {};
                        obj1.url = that.bannerImgList[i];
                        that.fileList1.push(obj1);
                    }
                    if (res.data.data.detailImg.indexOf(',') != -1) {
                        that.detailImgList = res.data.data.detailImg.split(',');
                    } else {
                        that.detailImgList.push(res.data.data.detailImg);
                    }
                    for (var i in that.detailImgList) {
                        var obj2 = {};
                        obj2.url = that.detailImgList[i];
                        that.fileList2.push(obj2);
                    }
                    //后端传过来的商品价格从分转换成元
                    that.shoppingaddform.salePrice = that.shoppingaddform.salePrice / 100;
                    that.shoppingaddform.discountPrice = that.shoppingaddform.discountPrice / 100;
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
            const isLt200k = file.size / 1024 <= 200;
            var isComTrue = true; //是否压缩  true为需要压缩
            if (!isLt200k) {
                isComTrue = true;
            } else {
                isComTrue = false;
            }
            if (!isJPG && !isJPG2) {
                this.$message.error('上传图片暂时只支持JPG,png格式');
                this.$refs.upload.clearFiles();
            } else {
                this.$http
                    .get(that.$http.adornUrl('/v1/oss/tokens'))
                    .then(function(res) {
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
                                    width: 750,
                                    quality: 0.7,
                                }).then(function(rst) {
                                    co(function*() {
                                        var timeStamp = new Date().getTime();
                                        var result = yield client.put(goods + timeStamp, rst.file); //新增商品-上传的图片
                                        //console.log(result);
                                        that.bannerList.push({url: result.url, uid: file.uid});
                                    }).catch(function(err) {
                                        console.log(err);
                                    });
                                });
                            } else {
                                co(function*() {
                                    var timeStamp = new Date().getTime();
                                    var result = yield client.put(goods + timeStamp, file); //新增商品-上传的图片
                                    //console.log(result);
                                    that.bannerList.push({url: result.url, uid: file.uid});
                                }).catch(function(err) {
                                    console.log(err);
                                });
                            }
                        } else {
                            return false;
                        }
                    })
                    .catch(() => {});
            }
        },
        beforeAvatarUpload2(file) {
            const that = this;
            const isJPG = file.type === 'image/jpeg';
            const isJPG2 = file.type === 'image/png';
            const isLt200k = file.size / 1024 <= 200;
            var isComTrue = true; //是否压缩  true为需要压缩
            if (!isLt200k) {
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
                                width: 750,
                                quality: 0.7,
                            }).then(function(rst) {
                                co(function*() {
                                    var timeStamp = new Date().getTime();
                                    var result = yield client.put(goods + timeStamp, rst.file); //新增商品-上传的图片
                                    //console.log(result);
                                    that.detailList.push({url: result.url, uid: file.uid});
                                }).catch(function(err) {
                                    console.log(err);
                                });
                            });
                        } else {
                            co(function*() {
                                var timeStamp = new Date().getTime();
                                var result = yield client.put(goods + timeStamp, file); //新增商品-上传的图片
                                //console.log(result);
                                that.detailList.push({url: result.url, uid: file.uid});
                            }).catch(function(err) {
                                console.log(err);
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
            if (fileList.length > 4) {
                this.condition = false;
                this.$message.error('超过图片上传限制');
            }
        },
        // 商品banner图片的删除
        onRemove(file) {
            const that = this;
            for (var i in this.bannerList) {
                if (that.bannerList[i].uid == file.uid) {
                    that.bannerList.splice(i, 1);
                }
            }
            for (var i in this.bannerImgList) {
                if (that.bannerImgList[i] == file.url) {
                    that.bannerImgList.splice(i, 1);
                }
            }
        },
        // 商品详情图片的删除
        onRemoveDetail(file) {
            const that = this;
            for (var i in this.detailList) {
                if (that.detailList[i].uid == file.uid) {
                    that.detailList.splice(i, 1);
                }
            }
            for (var i in this.detailImgList) {
                if (that.detailImgList[i] == file.url) {
                    that.detailImgList.splice(i, 1);
                }
            }
        },
        onSuccess() {},
        onSuccess2() {},
        // 新增/编辑的确定
        dataFormSubmit() {
            const that = this;
            // 遍历banner数组集合拿到url集合
            var list = [];
            for (var i in this.bannerImgList) {
                list.push(this.bannerImgList[i]);
            }
            for (var i in this.bannerList) {
                list.push(this.bannerList[i].url);
            }
            // 遍历详情图片数组集合拿到url集合
            var list2 = [];
            for (var i in this.detailImgList) {
                list2.push(this.detailImgList[i]);
            }
            for (var i in this.detailList) {
                list2.push(this.detailList[i].url);
            }
            if (list.length > 0) {
                this.shoppingaddform.coverImg = list[0].toString();
            }
            this.shoppingaddform.bannerImg = list.join(',');
            this.shoppingaddform.detailImg = list2.join(','); //后端传字符串过去
            this.shoppingaddform.shopId = this.shopId;
            // 判断图片是否为空--用来做新增时候的表单校验
            if (list.length == 0 && list2.length == 0) {
                this.$message.error('请上传图片，谢谢合作');
                return false;
            }
            if (Number(that.shoppingaddform.discountPrice) > Number(that.shoppingaddform.salePrice)) {
                this.$message.error('活动价不能大于销售价，谢谢');
                return false;
            }
            this.$refs.shoppingaddform.validate(valid => {
                if (valid) {
                    this.$http({
                        url: this.isAddOrEdit == true ? this.$http.adornUrl2('/v1/product/goods') : this.$http.adornUrl2('/v1/product/goods/' + this.goodsId),
                        method: this.isAddOrEdit == true ? 'post' : 'put',
                        data: this.$http.adornData({
                            discountPrice: that.shoppingaddform.discountPrice * 100,
                            salePrice: that.shoppingaddform.salePrice * 100,
                            sales: that.shoppingaddform.sales,
                            description: that.shoppingaddform.description,
                            goodsName: that.shoppingaddform.goodsName,
                            groupId: that.shoppingaddform.groupId,
                            coverImg: that.shoppingaddform.coverImg,
                            shopId: that.shoppingaddform.shopId,
                            stock: that.shoppingaddform.stock,
                            bannerImg: that.shoppingaddform.bannerImg,
                            detailImg: that.shoppingaddform.detailImg,
                            limitNum: that.shoppingaddform.limitNum,
                        }),
                    }).then(({data}) => {
                        if (data && data.code === 201) {
                            that.$router.push({path: '/goods-goodsmanagent'});
                        }
                    });
                }
            });
        },
        // 取消
        addcancel() {
            this.$router.push({path: '/goods-goodsmanagent'});
        },
    },
};
</script>
<style lang="scss" scoped>
.tip {
    color: #f56c6c;
    position: absolute;
    left: 20px;
    top: 15px;
}
.tip2 {
    color: #f56c6c;
    position: absolute;
    left: 248px;
    top: 135px;
    z-index: 99;
}
.tips {
    position: absolute;
    top: 178px;
    left: 0;
    color: #aaa;
    z-index: 10;
}
.dialogbox {
    display: flex;
    .flex1 {
        flex: 1;
        margin-right: 10px;
    }
}
.price {
    justify-content: space-between;
}
.img50 {
    width: 50%;
    position: relative;
}
.leftbtn {
    margin-left: 50%;
}
</style>
