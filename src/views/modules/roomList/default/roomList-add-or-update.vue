<template>
    <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" @close="closeDialog" :visible.sync="visible">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="110px" size="small">
            <el-form-item label="名称" prop="roomName"> <el-input v-model="dataForm.roomName" placeholder="名称请在30字以内"></el-input> </el-form-item>
            <el-form-item label="容纳人数(人)" prop="size"> <el-input v-model="dataForm.size" placeholder="请输入数字"></el-input> </el-form-item>
            <el-form-item label="收费(元/小时)" prop="price"> <el-input v-model="dataForm.price" placeholder="请输入数字"></el-input> </el-form-item>
            <el-form-item label="开放时间" prop="startAt" v-if="dataForm.id == 0" key="add">
                <el-time-select
                    placeholder="起始时间"
                    v-model="dataForm.startAt"
                    format="HH:mm"
                    value-format="HH:mm"
                    :picker-options="{
                        start: '01:00',
                        step: '01:00',
                        end: '24:00',
                    }"
                >
                </el-time-select>
                <el-time-select
                    placeholder="结束时间"
                    v-model="dataForm.endAt"
                    format="HH:mm"
                    value-format="HH:mm"
                    :picker-options="{
                        start: '01:00',
                        step: '01:00',
                        end: '24:00',
                        minTime: dataForm.startAt,
                    }"
                >
                </el-time-select>
            </el-form-item>
            <el-form-item label="开放时间" prop="startAt" v-else-if="dataForm.id != 0" key="edit">
                <div class="editTime">
                    <el-input v-model="dataForm.startAt" v-popover:startPopover :readonly="true" style="width:220px;" clearable></el-input>
                    <el-popover ref="startPopover" placement="bottom-start" trigger="click">
                        <el-time-select
                            placeholder="起始时间"
                            v-model="dataForm.startAt"
                            format="HH:mm"
                            value-format="HH:mm"
                            :picker-options="{
                                start: '01:00',
                                step: '01:00',
                                end: '24:00',
                            }"
                        >
                        </el-time-select>
                    </el-popover>
                    <el-popover ref="endPopover" placement="bottom-start" trigger="click">
                        <el-time-select
                            placeholder="结束时间"
                            v-model="dataForm.endAt"
                            format="HH:mm"
                            value-format="HH:mm"
                            :picker-options="{
                                start: '01:00',
                                step: '01:00',
                                end: '24:00',
                                minTime: dataForm.startAt,
                            }"
                        >
                        </el-time-select>
                    </el-popover>
                    <el-input v-model="dataForm.endAt" v-popover:endPopover :readonly="true"></el-input>
                </div>

                <!-- 
         -->
            </el-form-item>
            <div class="imgBox">
                <el-form-item label="封面图" class="cover" prop="imageUrl">
                    <el-upload
                        ref="upload"
                        :action="''"
                        :http-request="myUpload"
                        list-type="picture-card"
                        :file-list="fileList"
                        :limit="5"
                        :multiple="true"
                        :before-upload="beforeAvatarUpload"
                        :on-remove="onRemove"
                        :on-success="onSuccess"
                    >
                        <i class="el-icon-plus"></i>
                    </el-upload>
                </el-form-item>
                <span class="tip">*</span>
                <h5>上传图片不超过5张，单张大小不超过500KB，格式jpg,png</h5>
            </div>
            <el-form-item label="详情描述" prop="detail"> <el-input type="textarea" :autosize="true" v-model="dataForm.detail" placeholder="详情描述(300字以内)"></el-input> </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="visible = false">取消</el-button>
            <el-button size="small" type="primary" @click="dataFormSubmit()">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import qs from 'qs';
import co from 'co';
import OSS from 'ali-oss';
import {roomImguRL} from '@/utils/resources/index.js';
export default {
    data() {
        return {
            dataForm: {
                id: 0,
                roomName: '',
                size: '',
                price: '',
                startAt: '',
                endAt: '',
                detail: '',
            },
            fileList: [], //图片回添的数组
            imgList: [], //图片数组
            imgfileList: [], //图片上传的数组
            startTime: '',
            endTime: '',
            visible: false,
            dataRule: {
                roomName: [{required: true, message: '名称不能为空', trigger: 'blur'}, {min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur'}],
                size: [{required: true, message: '容纳人数不能为空', trigger: 'blur'}],
                price: [{required: true, message: '收费标准不能为空', trigger: 'blur'}],
                startAt: [{required: true, message: '开放时间不能为空', trigger: 'blur'}],
                detail: [{required: true, message: '详情描述不能为空', trigger: 'blur'}, {min: 1, max: 300, message: '长度在 300个字以内', trigger: 'blur'}],
            },
        };
    },
    methods: {
        // 定义一个拦截不让upload自动上传（自动上传用的formData）
        myUpload(content) {
            content.onSuccess('配时文件上传成功');
        },
        beforeAvatarUpload(file) {
            const that = this;
            const isJPG = file.type === 'image/jpeg';
            const isJPG2 = file.type === 'image/png';
            const isLt500k = file.size / 1024 <= 500;
            if (!isLt500k) {
                this.$message.error('图片大小请不要超过500K');
                return false;
            }
            if (!isJPG && !isJPG2) {
                this.$message.error('上传图片暂时只支持JPG,png格式');
                this.$refs.upload.clearFiles();
            } else {
                this.$http.get(that.$http.adornUrl('/v1/oss/tokens')).then(function(res) {
                    if (res.data.code == 200) {
                        //console.log(res.data.data.accessKeyId)
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
                            var result = yield client.put(roomImguRL + timeStamp, file); //新增商品-上传的图片
                            //console.log(result);
                            that.imgfileList.push({url: result.url, uid: file.uid});
                        });
                    } else {
                        return false;
                    }
                });
            }
        },
        // 商品banner图片的删除
        onRemove(file) {
            console.log(file);
            console.log(this.imgList);
            const that = this;
            for (var i in this.imgfileList) {
                if (that.imgfileList[i].uid == file.uid) {
                    that.imgfileList.splice(i, 1);
                }
            }
            for (var i in this.imgList) {
                if (that.imgList[i] == file.url) {
                    that.imgList.splice(i, 1);
                }
            }
            console.log(this.imgList);
            console.log(this.imgfileList);
        },
        onSuccess() {},
        // 弹框关闭
        closeDialog() {
            this.dataForm = {
                id: 0,
                roomName: '',
                size: '',
                price: '',
                startAt: '',
                endAt: '',
                detail: '',
            };
            this.fileList = [];
            this.imgList = [];
            this.imgfileList = [];
        },
        init(obj) {
            const that = this;
            this.visible = true;
            this.$nextTick(() => {
                this.$refs['dataForm'].resetFields();
                if (obj) {
                    this.dataForm = {
                        id: obj.roomId,
                        roomName: obj.roomName,
                        size: obj.size,
                        price: obj.price / 100,
                        startAt: obj.startAt + ':00',
                        endAt: obj.endAt + ':00',
                        detail: obj.detail,
                        cover: obj.cover,
                    };
                    that.imgList = this.dataForm.cover;
                    if (that.imgList[0] == '') {
                        that.imgList = [];
                    }
                    // console.log(obj.cover)
                    for (var i = 0; i < that.imgList.length; i++) {
                        var obj2 = {};
                        obj2.url = that.imgList[i];
                        that.fileList.push(obj2);
                    }
                    // console.log(that.imgList)
                } else {
                    this.dataForm.id = 0;
                }
                //console.log(that.imgList)
                //console.log(that.fileList)
            });
        },
        // 表单提交
        dataFormSubmit() {
            this.$refs['dataForm'].validate(valid => {
                if (valid) {
                    if (!this.dataForm.endAt || !this.dataForm.startAt) {
                        this.$message.error('请选择开放时间');
                        return false;
                    }
                    var list = [];
                    for (var i in this.imgList) {
                        list.push(this.imgList[i]);
                    }
                    for (var i in this.imgfileList) {
                        list.push(this.imgfileList[i].url);
                    }
                    if (list.length == 0) {
                        this.$message.error('请上传图片');
                        return false;
                    }
                    this.dataForm.cover = list.join(','); //图片字符串形式
                    var index1 = this.dataForm.startAt.lastIndexOf(':');
                    var index2 = this.dataForm.endAt.lastIndexOf(':');
                    this.$http({
                        url: this.$http.adornUrl(this.dataForm.id == 0 ? `/v1/meet/rooms` : '/v1/meet/rooms/' + this.dataForm.id),
                        method: this.dataForm.id == 0 ? 'post' : 'put',
                        data: this.$http.adornData({
                            roomName: this.dataForm.roomName,
                            cover: this.dataForm.cover,
                            size: this.dataForm.size,
                            price: this.dataForm.price * 100, //元转换成分发给后端
                            detail: this.dataForm.detail,
                            startAt: Number(this.dataForm.startAt.substring(0, index1)),
                            endAt: Number(this.dataForm.endAt.substring(0, index2)),
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
.imgBox {
    position: relative;
    .tip {
        position: absolute;
        left: 45px;
        top: 7px;
        color: #f56c6c;
    }
    h5 {
        margin: -10px 0 10px 110px;
        color: #aaa;
    }
}
.editTime {
    display: flex;
    .el-input {
        width: 220px;
    }
}
.el-form-item .el-form-item__content .el-textarea {
    textarea {
        height: 80px;
    }
}
</style>
