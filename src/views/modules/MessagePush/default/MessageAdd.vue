<template>
    <el-row class="mt10 mb10">
        <el-row class="mb10">
            <el-radio-group v-model="dataForm.type">
                <el-radio v-for="(item, index) in radio_list" :key="index" :label="item.value">{{ item.text }}</el-radio>
            </el-radio-group>
            <el-button class="back_button" type="primary" size="mini" @click="$router.push({name: 'adv-MessagePush'})">返回</el-button>
        </el-row>
        <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" label-width="80px" size="small">
            <el-form-item label="推送内容" prop="content"> <el-input type="textarea" :autosize="true" v-model="dataForm.content" placeholder="请输入描述50字以内"></el-input> </el-form-item>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="跳转类型" prop="jumpType">
                        <el-select v-model="dataForm.jumpType"> <el-option v-for="item in jumpTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option> </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="链接" prop="infoUrl" v-if="dataForm.jumpType == 1">
                        <el-input v-model="dataForm.infoUrl" placeholder="请输入链接(注：带上http或https)"></el-input>
                    </el-form-item>
                    <el-form-item
                        v-else-if="dataForm.jumpType != 0"
                        :label="
                            dataForm.jumpType == 2 || dataForm.jumpType == 4 ? '店铺ID' : dataForm.jumpType == 3 || dataForm.jumpType == 5 ? '商品ID' : dataForm.jumpType == 6 ? '咨询ID' : '活动ID'
                        "
                        prop="jumpId"
                    >
                        <el-input v-model="dataForm.jumpId" placeholder="请输入ID"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <div class="imgBox">
                <el-form-item label="图片" class="advertImage" prop="imageUrl">
                    <oss-one-upload ref="imgUpload" :imagePath="'message'" :imageUrl="dataForm.imageUrl" @setImageUrl="imgUrl"></oss-one-upload>
                </el-form-item>
                <span class="span_tip">上传1张详情封面照,格式png, jpg,尺寸:750*420(16:9),不超过200KB</span>
                <!-- <div class="box_example">
                    <p class="title_example">图片上传示例</p>
                    <img class="img_example_last" src="../../../assets/img/advexample.png" alt="">
                    <img class="img_example" src="../../../assets/img/advexample.png" alt="">
                </div> -->
            </div>
            <el-row class="save_box"> <el-button type="success" size="mini" @click="save">保存</el-button> </el-row>
            <el-form-item class="mt10" label="推送对象" prop="pushType">
                <el-select v-model="dataForm.pushType"> <el-option v-for="item in pushTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option> </el-select>
                <el-button class="button_submit" type="success" size="mini" @click="dataFormSubmit">提交</el-button>
            </el-form-item>
            <el-row class="phone_box" v-if="dataForm.pushType == 2">
                <ul>
                    <li style="height:28px;line-height:28px">待添加</li>
                    <li>
                        <el-input placeholder="请输入手机号" size="small" v-model="phone" style="width:80%" clearable></el-input>
                        <el-button size="mini" type="success" class="ml10" @click="addPhone">添加</el-button>
                    </li>
                    <li class="mt10">
                        <upload-excel @phonesData="phonesData"></upload-excel>
                        <span class="tips">提示：支持Excel格式，可上传一张excel文件，手机号前后无空格及任何占用字符，文件支持10k</span>
                    </li>
                </ul>
                <ul>
                    <li class="clearbox">
                        <div>
                            已添加<span style="margin:0 10px;color:#3E8EF7">{{ dataForm.phones.length }}</span
                            >个
                        </div>
                        <el-button size="mini" type="text" @click="clearAll">清除全部</el-button>
                    </li>
                    <li class="content_message">
                        <div class="content_title"><span class="index">序号</span> <span class="name">名称</span></div>
                        <el-row class="message_phone" v-for="(item, index) in dataForm.phones" :key="index" @click.native="clearPhone(index)">
                            <span class="index">{{ index + 1 }}</span> <span class="name">{{ item }}</span>
                        </el-row>
                    </li>
                </ul>
            </el-row>
            <el-row class="phone_box" v-if="ilState">
                <ul></ul>
                <ul>
                    <li class="clearbox">
                        <div>
                            导入异常<span style="margin:0 10px;color:#3E8EF7">{{ dataForm.ilphones.length }}</span
                            >个
                        </div>
                    </li>
                    <li class="content_message">
                        <div class="content_title"><span class="index">序号</span> <span class="name">名称</span></div>
                        <el-row class="message_phone" v-for="(item, index) in dataForm.ilphones" :key="index">
                            <span class="index">{{ index + 1 }}</span> <span class="name">{{ item }}</span>
                        </el-row>
                    </li>
                </ul>
            </el-row>
        </el-form>
    </el-row>
</template>

<script>
import ossOneUpload from '@/views/compontents/OssUpload';
import uploadExcel from '@/views/compontents/UploadExcel';
export default {
    components: {
        ossOneUpload,
        uploadExcel,
    },
    data() {
        return {
            dataForm: {
                type: 2,
                jumpType: null,
                imageUrl: '',
                infoUrl: '',
                jumpId: null,
                content: '',
                pushType: null,
                isExcel: 2,
                phones: [],
                ilphones: [],
            },
            ilState: false,
            value1: [],
            data: [],
            phone: null,
            excelList: [
                {
                    value: 2,
                    label: '人工添加',
                },
                {
                    value: 3,
                    label: '批量导入',
                },
            ],
            radio_list: [
                {
                    text: '电商消息',
                    value: 2,
                },
                {
                    text: '系统消息',
                    value: 1,
                },
                {
                    text: '活动消息',
                    value: 3,
                },
            ],
            jumpTypeList: [
                {value: 1, label: 'H5'},
                {value: 2, label: '美食店铺页'},
                {value: 3, label: '美食详情页'},
                {value: 4, label: '商城店铺页'},
                {value: 5, label: '商城详情页'},
                {value: 6, label: '咨询详情'},
                {value: 7, label: '互动型活动详情'},
                {value: 8, label: '报名签到型活动详情'},
                {value: 0, label: '无'},
            ],
            pushTypeList: [{value: 1, label: '所有用户'}, {value: 2, label: '按手机推送'}],
            dataRule: {
                jumpType: [{required: true, message: '必填', trigger: 'blur'}],
                jumpId: [{required: true, message: '必填', trigger: 'blur'}],
                content: [{required: true, message: '必填', trigger: 'blur'}, {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'}],
                pushType: [{required: true, message: '必填', trigger: 'blur'}],
            },
        };
    },
    methods: {
        imgUrl(value) {
            this.dataForm.imageUrl = value;
        },
        save() {
            sessionStorage.setItem('messagePush', JSON.stringify(this.dataForm));
            this.$message.success('已保存');
        },
        addPhone() {
            if (!this.phone) return false;
            if (this.dataForm.phones.includes(this.phone)) {
                this.$message.warning('请勿添加重复手机号');
                return false;
            }
            this.dataForm.phones.push(this.phone);
            this.phone = '';
        },
        clearAll() {
            this.dataForm.phones = [];
        },
        clearPhone(index) {
            this.$confirm(`确定删除 ?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    this.dataForm.phones.splice(index, 1);
                })
                .catch(() => {});
        },
        phonesData(value) {
            this.ilState = true;
            let list = value.legalPhones;
            let newlist = value.illegalPhones;
            this.dataForm.phones = this.dataForm.phones.concat(list);
            this.dataForm.ilphones = newlist;
        },
        dataFormSubmit() {
            this.$refs['dataFormRef'].clearValidate(['jumpId']);
            this.$refs['dataFormRef'].validate(valid => {
                if (valid) {
                    this.$http({
                        url: this.$http.adornUrl(`/v1/note/messages`),
                        method: 'post',
                        data: this.$http.adornData({
                            type: this.dataForm.type,
                            content: this.dataForm.content,
                            type: this.dataForm.type,
                            jumpType: this.dataForm.jumpType,
                            jumpId: this.dataForm.jumpId,
                            imageUrl: this.dataForm.imageUrl,
                            infoUrl: this.dataForm.infoUrl,
                            phones: this.dataForm.phones,
                            pushType: this.dataForm.pushType,
                        }),
                    }).then(({data}) => {
                        if (data && data.code === 201) {
                            this.$message.success('操作成功');
                            this.$router.push({name: 'adv-MessagePush'});
                        }
                    });
                }
            });
        },
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            if (sessionStorage.getItem('messagePush')) {
                let obj = JSON.parse(sessionStorage.getItem('messagePush'));
                vm.dataForm.type = obj.type;
                vm.dataForm.jumpType = obj.jumpType;
                vm.dataForm.imageUrl = obj.imageUrl;
                vm.dataForm.infoUrl = obj.infoUrl;
                vm.dataForm.content = obj.content;
                vm.dataForm.jumpId = obj.jumpId;
            } else {
                vm.$refs.dataFormRef.resetFields();
                vm.$refs.imgUpload.clearFiles();
                vm.dataForm.type = vm.$route.query.type;
            }
        });
    },
};
</script>
<style scoped>
.save_box {
    border-bottom: 1px solid #ebeef5;
    text-align: right;
    padding-bottom: 10px;
}
.back_button {
    float: right;
}
.span_tip {
    margin-left: 80px;
    color: #aaa;
    font-weight: 700;
}
.phone_box {
    width: 80%;
    border: 1px solid #ebeef5;
    padding: 10px 5px;
    display: flex;
    justify-content: space-between;
}
.phone_box ul {
    width: 50%;
}
.phone_box ul li {
    margin: 10px;
}
.phone_box ul .clearbox {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.phone_box ul .content_message {
    border: 1px solid #ebeef5;
    min-height: 200px;
}
.phone_box ul .content_message .content_title {
    background: #ebeef5;
    padding: 10px;
}
.button_submit {
    float: right;
}
.message_phone {
    padding: 10px;
    overflow-y: auto;
}
.message_phone:hover {
    background: #ebeef5;
}
.index {
    display: inline-block;
    width: 100px;
    text-align: center;
}
.name {
    display: inline-block;
}
.tips {
    display: inline-block;
    margin-top: 10px;
    color: #aaa;
}
.advertImage >>> .el-form-item__content {
    width: 148px !important  ;
    height: 148px !important  ;
    overflow: hidden !important;
    position: relative;
}
</style>
