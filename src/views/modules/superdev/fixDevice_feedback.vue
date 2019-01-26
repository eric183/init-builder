<template>
    <el-dialog :visible.sync="dialogVisible">
        <el-form :model="formData">
            <el-form-item>
                <el-row>
                    <el-col :span="6" style="max-width: 70px;line-height: 1;margin: 9px 16px 9px 0;text-align: right;">{{ type_translate[_type]['title'] }}:</el-col>
                    <el-col :span="18"> <el-input type="textarea" :rows="4" v-model="formData.detail" :placeholder="type_translate[_type]['place']"></el-input> </el-col>
                </el-row>
            </el-form-item>
            <el-form-item>
                <el-row>
                    <el-col :span="6" style="max-width: 70px;line-height: 1;margin: 9px 16px 9px 0;text-align: right;">图片:</el-col>
                    <el-col :span="18">
                        <el-row>
                            <div @click="addImg" style="width: 120px;height: 120px;border: 1px solid #DDDDDD;cursor: pointer;display: flex;justify-content: center;align-items: center;">
                                <i v-if="!imgSrc" class="el-icon-plus" style="font-size: 28px;"></i> <img v-else style="width: 100%;height: 100%;" :src="imgSrc" />
                            </div>
                        </el-row>
                        <el-row style="color: #999;"> 上传一张图片，格式png、jpg、jpeg； </el-row>
                        <div style="display: none;"><input id="imageInput" @change="plus_img" type="file" accept="image/jpeg,image/png" /></div>
                    </el-col>
                </el-row>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="confirm">提 交</el-button>
        </div>
    </el-dialog>
</template>

<script>
import {fixDevice_feedback} from '@/assets/imgjs.js';
var co = require('co');
var OSS = require('ali-oss');
export default {
    props: ['type'],
    data() {
        return {
            type_translate: {
                default: {
                    title: '处理详情',
                    place: '请输入处理详情',
                    event_name: () => {
                        return this.$route.name + '_feedback';
                    },
                },
                remark: {
                    title: '处理评价',
                    place: '请输入评价内容',
                    event_name: () => {
                        return this.$route.name + '_remark';
                    },
                },
            },
            dialogVisible: false,
            imgSrc: '',
            file: '',
            formData: {
                detail: '',
            },
        };
    },
    computed: {
        _type() {
            return this.type || 'default';
        },
    },
    methods: {
        show() {
            this.dialogVisible = true;
        },
        close() {
            this.dialogVisible = false;
        },
        addImg() {
            $('input#imageInput').trigger('click');
        },
        plus_img(e) {
            this.readFile($($(e.currentTarget))[0].files[0]);
        },
        confirm() {
            this.dialogVisible = false;
            let event_name = this.type_translate[this._type]['event_name']();
            if (this.file) {
                this.uploadImg(this.file, result => {
                    this.$store.dispatch('sendEvent', {
                        event_name,
                        extra: {
                            httpUrl: result.url,
                            formData: this.formData,
                        },
                    });
                });
            } else {
                this.$store.dispatch('sendEvent', {
                    event_name,
                    extra: {
                        formData: this.formData,
                    },
                });
            }
        },
        readFile(file) {
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = e => {
                this.imgSrc = e.target.result;
                this.file = file;
            };
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
                        var result = yield client.put(fixDevice_feedback + timeStamp, file); //新增商品-上传的图片
                        // console.log(result);
                        callBack && callBack(result);
                    });
                } else {
                    return false;
                }
            });
        },
    },
};
</script>

<style></style>
