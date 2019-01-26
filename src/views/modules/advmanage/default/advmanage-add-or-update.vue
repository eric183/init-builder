<template>
    <div class="addmanage">
        <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :append-to-body="true" :visible.sync="visible">
            <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter.native="dataFormSubmit()" label-width="100px" size="small">
                <el-form-item label="名称" prop="title"> <el-input v-model="dataForm.title" placeholder="名称"></el-input> </el-form-item>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="广告位置" prop="type">
                            <el-select v-model="dataForm.type" @change="typeChange">
                                <el-option v-for="item in advTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="跳转类型" prop="jumpType">
                            <el-select v-model="dataForm.jumpType" @change="jumpTypeChange(dataForm.jumpType)">
                                <el-option v-for="item in jumpTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item :label="linkTitle" v-if="linkState" prop="infoUrl"> <el-input v-model="dataForm.infoUrl" placeholder="请输入链接(注：带上http或https)"></el-input> </el-form-item>
                <el-form-item label="商品id" v-if="dataForm.jumpType == 3 || dataForm.jumpType == 5" prop="jumpId" key="goodsId"> <el-input v-model="dataForm.jumpId"></el-input> </el-form-item>
                <el-form-item label="店铺ID" v-if="dataForm.jumpType == 2 || dataForm.jumpType == 4" prop="jumpId" key="shopId"> <el-input v-model="dataForm.jumpId"></el-input> </el-form-item>
                <el-form-item label="活动ID" v-if="dataForm.jumpType == 7 || dataForm.jumpType == 8" prop="jumpId" key="shopId"> <el-input v-model="dataForm.jumpId"></el-input> </el-form-item>
                <el-form-item label="咨询ID" v-if="dataForm.jumpType == 6" prop="jumpId" key="consut"> <el-input v-model="dataForm.jumpId"></el-input> </el-form-item>
                <el-form-item label="描述" prop="comment"> <el-input type="textarea" :autosize="true" v-model="dataForm.comment" placeholder="请输入描述50字以内"></el-input> </el-form-item>
                <div class="imgBox">
                    <el-form-item label="图片">
                        <new-Upload
                            :limitNum="1"
                            :fileSize="200"
                            :fileList="imgList"
                            @imgListFun="imgListFun"
                            :imgWidth="imgWidth"
                            :imgSize="imgSize"
                            :imgLocaltion="advertisements"
                            :value="dataForm.type"
                            :valueError="'请先选择广告位置'"
                        ></new-Upload>
                    </el-form-item>
                    <span class="isShowImg" v-show="isShowImg">图片不能为空</span>
                    <h5 v-if="dataForm.type == 4">上传1张门禁广告,格式png, jpg,尺寸:670*200,不超过200KB</h5>
                    <h5 v-else-if="dataForm.type == 5">上传1张启动页广告,格式png, jpg,尺寸:750*1334,不超过500KB</h5>
                    <h5 v-else>上传1张详情封面照,格式png, jpg,尺寸:750*420(16:9),不超过200KB</h5>
                    <div class="box_example">
                        <p class="title_example">图片上传示例</p>
                        <el-popover v-if="dataForm.type == 4" placement="right" trigger="hover">
                            <img src="@/assets/img/advexample3.png" style="max-width:500px;max-height:500px;" />
                            <img slot="reference" src="@/assets/img/advexample3.png" style="max-height: 110px;max-width: 130px" />
                        </el-popover>
                        <el-popover v-else-if="dataForm.type == 5" placement="right" trigger="hover">
                            <img src="@/assets/img/advexample2.png" style="max-width:500px;max-height:500px;" />
                            <img slot="reference" src="@/assets/img/advexample2.png" style="max-height: 110px;max-width: 140px" />
                        </el-popover>
                        <el-popover v-else placement="right" trigger="hover">
                            <img src="@/assets/img/advexample.png" style="max-width:500px;max-height:500px;" />
                            <img slot="reference" src="@/assets/img/advexample.png" style="max-height: 110px;max-width: 130px" />
                        </el-popover>
                    </div>
                </div>
                <el-form-item label="是否上线" prop="status">
                    <el-switch :width="35" v-model="dataForm.status" active-text="是" :active-value="2" inactive-text="否" :inactive-value="1"> </el-switch>
                </el-form-item>
                <div class="box">
                    <el-form-item label="上线时间" prop="startAt">
                        <el-date-picker v-model="dataForm.startAt" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期"> </el-date-picker>
                    </el-form-item>
                    <el-form-item label="下线时间" prop="endAt">
                        <el-date-picker v-model="dataForm.endAt" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期"> </el-date-picker>
                    </el-form-item>
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="visible = false">取消</el-button>
                <el-button size="small" type="primary" @click="dataFormSubmit()" :disabled="isclick">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {commonFunc , advertisements} from '@/utils/resources/index.js';
import newUpload from '@/views/compontents/NEWUpload';
import co from 'co';
import OSS from 'ali-oss';
export default {
    components: {
        newUpload,
    },
    data() {
        return {
            visible: false,
            dataForm: {
                id: 0,
                title: '',
                type: '',
                jumpType: '',
                jumpId: '',
                infoUrl: '',
                status: 1,
                comment: '',
                startAt: '',
                endAt: '',
            },
            advertisements: advertisements,
            imgList: [],
            imgWidth: 750, //上传图片的尺寸 -- 默认宽度750
            imgSize: 200, //上传图片的尺寸 -- 默认大小200k
            linkState: false,
            linkTitle: '链接',
            goodsState: false,
            shopState: false,
            isShowImg: false,
            isclick: false, //按钮默认可点击，点击确认之后不可再点击
            advTypeList: [{value: 1, label: 'app首页轮播'}, {value: 2, label: '美食主页轮播'}, {value: 3, label: '商城主页轮播'}, {value: 4, label: '门禁广告'}, {value: 5, label: 'APP启动页广告'}],
            jumpTypeList: [
                {value: 1, label: 'H5'},
                {value: 2, label: '美食店铺页'},
                {value: 3, label: '美食详情页'},
                {value: 4, label: '商城店铺页'},
                {value: 5, label: '商城详情页'},
                {value: 6, label: '资讯详情'},
                {value: 7, label: '互动型活动详情'},
                {value: 8, label: '报名签到型活动详情'},
            ],
            dataRule: {
                title: [{required: true, message: '名称不能为空', trigger: 'blur'}, {min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur'}],
                type: [{required: true, message: '位置不能为空', trigger: 'blur'}],
                jumpType: [{required: true, message: '类型不能为空', trigger: 'blur'}],
                jumpId: [{required: true, message: 'id不能为空', trigger: 'blur'}],
                imageUrl: [{required: true, message: '图片不能为空', trigger: 'blur'}],
                startAt: [{required: true, message: '上线时间不能为空', trigger: 'blur'}],
                endAt: [{required: true, message: '下线时间不能为空', trigger: 'blur'}],
                comment: [{min: 2, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'}],
                status: [{required: true, message: '是否上线不能为空', trigger: 'blur'}],
            },
        };
    },
    methods: {
        init(id) {
            this.isclick = false;
            this.dataForm.id = id || 0;
            this.visible = true;
            this.$nextTick(() => {
                this.imgList = [];
                this.$refs['dataFormRef'].resetFields();
                if (this.dataForm.id) {
                    this.$http({
                        //url: this.$http.adornUrl(`/v1/advertisement/${this.dataForm.id}`),
                        url: this.$http.adornUrl(`/v1/mkt/advertisements/` + this.dataForm.id),
                        method: 'get',
                    }).then(({data}) => {
                        if (data && data.code === 200) {
                            this.dataForm.title = data.data.title;
                            this.dataForm.type = data.data.type;
                            this.dataForm.jumpType = data.data.jumpType;
                            this.dataForm.jumpId = data.data.jumpId;
                            this.dataForm.imageUrl = data.data.imageUrl;
                            this.dataForm.infoUrl = data.data.infoUrl;
                            this.dataForm.startAt = commonFunc(data.data.startAt);
                            //console.log(this.dataForm.startAt)
                            this.dataForm.endAt = commonFunc(data.data.endAt);
                            this.dataForm.status = data.data.status;
                            this.dataForm.comment = data.data.comment;
                            const newList = data.data.imageUrl.split(',');
                            const list = [];
                            for (var i = 0; i < newList.length; i++) {
                                var obj2 = {};
                                obj2.url = newList[i];
                                list.push(obj2);
                            }
                            this.imgList = list;
                            if (data.data.jumpType == 1) {
                                this.linkState = true;
                                this.linkTitle = '链接';
                            } else {
                                this.linkState = false;
                            }
                            if (data.data.jumpType == 3 || data.data.jumpType == 5) {
                                this.goodsState = true;
                            } else {
                                this.goodsState = false;
                            }
                            if (data.data.jumpType == 2 || data.data.jumpType == 4) {
                                this.shopState = true;
                            } else {
                                this.shopState = false;
                            }
                        }
                    });
                }
            });
        },
        jumpTypeChange(val) {
            if (val == 1) {
                this.linkState = true;
                this.linkTitle = '链接';
            } else {
                this.linkState = false;
            }
            if (val == 3 || val == 5) {
                this.goodsState = true;
            } else {
                this.goodsState = false;
            }
            if (val == 2 || val == 4) {
                this.shopState = true;
            } else {
                this.shopState = false;
            }
        },
        typeChange(value) {
            if (value == 4) {
                this.imgWidth = 670;
            } else {
                this.imgWidth = 750;
            }
        },
        imgListFun(value) {
            this.imgList = value;
        },
        // 表单提交
        dataFormSubmit() {
            this.$refs['dataFormRef'].validate(valid => {
                if (this.dataForm.startAt && this.dataForm.startAt >= this.dataForm.endAt) {
                    this.$message.error('上线时间不能大于下线时间');
                    return false;
                }
                if (!this.imgList.length) {
                    this.isShowImg = true;
                    return false;
                }
                if (valid) {
                    this.$http({
                        //url: this.$http.adornUrl3(`/v1/advertisement`),
                        url: this.$http.adornUrl(`/v1/mkt/advertisements`),
                        method: this.dataForm.id == 0 ? 'post' : 'put',
                        data: this.$http.adornData({
                            id: this.dataForm.id || undefined,
                            title: this.dataForm.title,
                            type: this.dataForm.type,
                            jumpType: this.dataForm.jumpType,
                            jumpId: this.dataForm.jumpId,
                            imageUrl: this.imgList[0].url,
                            infoUrl: this.dataForm.infoUrl,
                            startAt: this.dataForm.startAt,
                            endAt: this.dataForm.endAt,
                            status: this.dataForm.status,
                            comment: this.dataForm.comment,
                        }),
                    }).then(({data}) => {
                        if (data && data.code === 201) {
                            this.isclick = true;
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
<style scoped>
h5 {
    margin-left: 100px;
    color: #aaa;
}
.imgBox {
    position: relative;
}
.box_example {
    width: 148px;
    height: 148px;
    position: absolute;
    left: 300px;
    top: 0;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    padding: 10px;
}
.title_example {
    margin: 0;
    padding: 0;
    font-size: 12px;
}
.isShowImg {
    position: absolute;
    left: 100px;
    top: 148px;
    color: #f56c6c;
}
.addmanage >>> .el-switch__label span {
    font-size: 12px !important;
    color: #999999;
}
.addmanage >>> .el-switch span.is-active span {
    color: #3e8ef7;
}
.box {
    display: flex;
    flex-wrap: wrap;
}
.imgBox {
    position: relative;
}
</style>
