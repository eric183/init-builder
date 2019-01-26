<template>
    <div class="main_box">
        <img src="../../assets/img/homelogo.png" class="img-login" alt="" />
        <h3>智慧楼宇生态平台</h3>
        <ul>
            <li class="ops" @click="ops()">
                <div class="img-shadow-1">
                    <img src="../../assets/img/true4.jpg" alt="" />
                    <div class="layer"></div>
                </div>
                <span> 运营服务平台</span>
            </li>
            <li class="image-hover img-inner-shadow" @click="spmp()">
                <div class="img-shadow-1">
                    <img src="../../assets/img/true3.jpg" alt="" />
                    <div class="layer"></div>
                </div>

                <span> 超级楼管平台</span>
            </li>
            <li class="image-hover img-inner-shadow" @click="mers()">
                <div class="img-shadow-1">
                    <img src="../../assets/img/true7.jpg" alt="" />
                    <div class="layer"></div>
                </div>
                <span> 商户管理系统</span>
            </li>
            <li class="image-hover img-inner-shadow" @click="vms()">
                <div class="img-shadow-1">
                    <img src="../../assets/img/true6.jpg" alt="" />
                    <div class="layer"></div>
                </div>
                <span> 访客管理系统</span>
            </li>
        </ul>
        <p class="info">© 2018 深圳中正信息科技有限公司</p>
    </div>
</template>

<script>
export default {
    data() {
        return {};
    },
    methods: {
        ops() {
            const {href} = this.$router.resolve({
                name: 'opp-login',
            });
            window.open(href, '_blank');
            //this.$router.push({name:'opp-login'});
        },
        spmp() {
            const {href} = this.$router.resolve({
                name: 'spmp-login',
            });
            window.open(href, '_blank');
            //this.$router.push({name:'spmp-login'});
        },
        mers() {
            const {href} = this.$router.resolve({
                name: 'mers-login',
            });
            window.open(href, '_blank');
            //this.$router.push({name:'mers-login'});
        },
        sys() {
            const {href} = this.$router.resolve({
                name: 'sys-login',
            });
            window.open(href, '_blank');
            //this.$router.push({name:'sys-login'});
        },
        vms() {
            const {href} = this.$router.resolve({
                name: 'vms-login',
            });
            window.open(href, '_blank');
            //this.$router.push({name:'vms-login'});
        },
    },
};
</script>
<style lang="scss" scoped>
.main_box {
    width: 100vw;
    height: 100vh;
    position: relative;
    z-index: 2;
    top: 0;
    left: 0;
    background: url(@/assets/img/7.jpg) no-repeat 0 0;
    background-size: cover;
    overflow: hidden;
}
.img-login {
    display: block;
    width: 113px;
    height: 37px;
    margin: 8% auto 0;
}
h3 {
    text-align: center;
    margin: 2% 0 0 0 !important;
    color: #fff;
    font-size: 60px;
}
ul {
    position: relative;
    z-index: 300;
    width: 90vw;
    margin: 10% auto 0;
    display: flex;
    justify-content: space-around;
    li {
        width: 23%;
        height: 230px;
        border-radius: 10px;
        text-align: center;
        position: relative;
        cursor: pointer;
        color: #fff;
        transition: All 0.4s ease-in-out;
        -webkit-transition: All 0.4s ease-in-out;
        -moz-transition: All 0.4s ease-in-out;
        -o-transition: All 0.4s ease-in-out;
        position: relative;
        display: inline-block;
        overflow: hidden;
        background-color: #fff;
        border: 2px solid #fff;
        border: none;
        box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.3);
        -moz-box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.3);
        -webkit-box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.3);
        span {
            position: absolute;
            bottom: 0px;
            left: 0;
            width: 100%;
            height: 50px;
            line-height: 50px;
            font-size: 24px;
            background-color: rgba(0, 0, 0, 0.6);
            color: #fff;
            transition: All 0.4s ease-in-out;
            -webkit-transition: All 0.4s ease-in-out;
            -moz-transition: All 0.4s ease-in-out;
            -o-transition: All 0.4s ease-in-out;
        }
        img {
            border-radius: 5px;
            width: 100%;
            height: 230px;
            transition: All 0.4s ease-in-out;
            -webkit-transition: All 0.4s ease-in-out;
            -moz-transition: All 0.4s ease-in-out;
            -o-transition: All 0.4s ease-in-out;
        }
        &:hover {
            transform: translate(0, -30px);
            -webkit-transform: translate(0, -30px);
            -moz-transform: translate(0, -30px);
            -o-transform: translate(0, -30px);
            -ms-transform: translate(0, -30px);
        }
        .layer {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            transition: all 0.4s ease-in-out;
            -webkit-transition: all 0.4s ease-in-out;
            -moz-transition: all 0.4s ease-in-out;
            -ms-transition: all 0.4s ease-in-out;
            -o-transition: all 0.4s ease-in-out;
        }
        &:hover .layer {
            box-shadow: inset 0px 0px 150px rgba(255, 255, 255, 1);
            -moz-box-shadow: inset 0px 0px 120px rgba(0, 0, 0, 0.9);
            -webkit-box-shadow: inset 0px 0px 120px rgba(255, 255, 255, 0.7);
        }
        &:hover img {
            transform: scale(1.3);
            -webkit-transform: scale(1.3);
            -moz-transform: scale(1.3);
            -ms-transform: scale(1.3);
            -o-transform: scale(1.3);
        }
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
