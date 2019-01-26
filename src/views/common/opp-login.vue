<template>
    <div class="loginBlock">
        <div class="login-main">
            <p class="title"><img src="../../assets/img/homelogo.png" alt="" /> <span>运营服务平台</span></p>
            <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" status-icon>
                <el-form-item prop="userName"> <el-input v-model="dataForm.userName" placeholder="请输入帐号"></el-input> </el-form-item>
                <el-form-item prop="password"> <el-input v-model="dataForm.password" type="password" placeholder="请输入密码"></el-input> </el-form-item>
                <el-form-item prop="captcha">
                    <el-row :gutter="20">
                        <el-col :span="14"> <el-input v-model="dataForm.captcha" placeholder="请输入验证码"> </el-input> </el-col>
                        <el-col :span="10" class="login-captcha"> <img :src="captchaPath" @click="getCaptcha()" alt="" /> </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item> <el-button class="login-btn-submit" type="primary" @click="dataFormSubmit()">登录</el-button> </el-form-item>
            </el-form>
            <p class="tip">温馨提示：</p>
            <p class="tip">1. 为更好的用户体验，请下载安装并使用 <a class="linka" href="http://www.downza.cn/soft/26885.html">Chrome浏览器</a></p>
            <p class="tip">2. 系统推荐使用分辨率 1440 x 900 以上</p>
        </div>
        <p class="info">© 2018 深圳中正信息科技有限公司</p>
    </div>
</template>

<script>
import {getUUID} from '@/utils';
let sha256 = require('js-sha256').sha256; //这里用的是require方法，所以没用import
export default {
    data() {
        return {
            dataForm: {
                userName: '',
                password: '',
                uuid: '',
                captcha: '',
            },
            dataRule: {
                userName: [{required: true, message: '帐号不能为空', trigger: 'blur'}],
                password: [{required: true, message: '密码不能为空', trigger: 'blur'}],
                captcha: [{required: true, message: '验证码不能为空', trigger: 'blur'}],
            },
            captchaPath: '',
        };
    },
    created() {
        this.getCaptcha();
        this.$cookie.set('iden', 'opp');
    },
    methods: {
        // 提交表单
        dataFormSubmit() {
            this.$cookie.set('log', 'web');
            if (this.$cookie.get('token')) {
                this.$cookie.delete('token');
            }
            if (this.$cookie.get('roleId')) {
                this.$cookie.delete('roleId');
            }
            this.$refs['dataForm'].validate(valid => {
                if (valid) {
                    this.$http({
                        url: this.$http.adornUrl('/v1/auth/login'),
                        method: 'post',
                        data: this.$http.adornData({
                            phone: this.dataForm.userName,
                            password: sha256(this.dataForm.password),
                            uuid: this.dataForm.uuid,
                            captcha: this.dataForm.captcha,
                        }),
                    })
                        .then(({data}) => {
                            if (data && data.code === 201) {
                                //console.log(data)
                                this.$cookie.set('token', data.data.token); //登录拿到的token
                                if (data.data.roles.length > 0) {
                                    this.$cookie.set('roleId', data.data.roles[0].roleId); //登录时候的角色ID--用来获取菜单列表的
                                }
                                this.$router.replace({name: 'home'}); //默认成功跳到首页home
                                sessionStorage.setItem('roles', JSON.stringify(data.data.roles || '[]'));
                                sessionStorage.setItem('user', JSON.stringify(data.data.user || '[]'));
                                sessionStorage.setItem('shops', JSON.stringify(data.data.shops || '[]'));
                            }
                        })
                        .catch(error => {
                            this.$message.error(error);
                            this.getCaptcha();
                            sessionStorage.setItem('roles', '[]');
                            sessionStorage.setItem('user', '[]');
                            sessionStorage.setItem('shops', '[]');
                        });
                }
            });
        },
        // 获取验证码
        getCaptcha() {
            this.dataForm.uuid = getUUID();
            //this.captchaPath = this.$http.adornUrl(`/captcha.jpg?uuid=${this.dataForm.uuid}`)
            this.captchaPath = this.$http.adornUrl(`/v1/auth/captchas/captcha.jpg?uuid=${this.dataForm.uuid}`);
        },
    },
};
</script>

<style lang="scss">
.loginBlock {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: url(@/assets/img/1.jpg) no-repeat 0 0;
    overflow: hidden;
    background-size: cover;
    .login-main {
        position: absolute;
        left: 50%;
        top: 50%;
        z-index: 300;
        width: 450px;
        height: 400px;
        margin-left: -225px;
        margin-top: -200px;
        padding: 0 50px 430px 50px;
        border-radius: 10px;
        .tip {
            font-size: 12px;
            color: rgba(255, 255, 255, 1);
            a {
                font-size: 12px;
            }
        }
        .title {
            color: rgba(255, 255, 255, 1);
            margin-left: 40px;
            font-family: PingFangSC-Medium;
            font-size: 26px;
            height: 40px;
            position: relative;
            img {
                width: 113px;
                height: 37px;
                vertical-align: middle;
            }
            span {
                display: inline-block;
                height: 40px;
                line-height: 40px;
                margin-left: 10px;
                vertical-align: middle;
            }
        }
        .el-form-item .el-input {
            height: 44px;
            input {
                height: 44px;
            }
        }
        .login-captcha {
            img {
                width: 135px;
                height: 44px;
            }
        }
        .el-input__inner {
            background: rgba(13, 16, 20, 0.4) !important;
            color: rgba(255, 255, 255, 1);
            border-color: transparent;
        }
        .login-btn-submit {
            width: 100%;
        }
    }
    .linka {
        color: #09f9cf;
        font-weight: 700;
        text-decoration: underline;
    }
}
.info {
    position: absolute;
    bottom: 2%;
    color: #fff;
    left: 50%;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
    font-size: 18px;
}
</style>
