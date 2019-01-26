<template>
    <nav class="site-navbar" :class="'site-navbar--' + navbarLayoutType">
        <div class="site-navbar__header">
            <h1 class="site-navbar__brand" @click="$router.push({name: 'home'})">
                <a class="site-navbar__brand-lg" href="javascript:;"><img class="homelogo" src="../assets/img/homelogo.png" alt=""/></a>
                <!-- <a class="site-navbar__brand-lg" href="javascript:;" v-if="this.$cookie.get('iden')=='spmp'">物管平台</a>
        <a class="site-navbar__brand-lg" href="javascript:;" v-if="this.$cookie.get('iden')=='mers'">商户系统</a>
        <a class="site-navbar__brand-lg" href="javascript:;" v-if="this.$cookie.get('iden')=='vms'">访客系统</a>
        <a class="site-navbar__brand-lg" href="javascript:;" v-if="this.$cookie.get('iden')=='sys'">配置系统</a> -->
                <a class="site-navbar__brand-mini logo_louzm" href="javascript:;"><img src="../assets/img/logo_lzm.png" alt=""/></a>
            </h1>
        </div>
        <div class="site-navbar__body clearfix">
            <el-menu class="site-navbar__menu" mode="horizontal">
                <el-menu-item class="site-navbar__switch" index="0" @click="sidebarFold = !sidebarFold"> <icon-svg name="zhedie"></icon-svg> </el-menu-item>
            </el-menu>
            <!-- <span>{{parentName}}</span> -->
            <span class="tabNav" v-for="(item, index) in listData" :key="index" :class="{tabactive: item.name == $route.name}">
                <em @click="$router.push({name: item.name})">{{ item.meta.title }}</em
                ><em class="slash">/</em>
            </span>
            <el-menu class="site-navbar__menu site-navbar__menu--right" mode="horizontal">
                <el-menu-item class="site-navbar__avatar" index="3">
                    <el-dropdown :show-timeout="0" placement="bottom">
                        <span class="el-dropdown-link"> <img src="~@/assets/img/tou.jpg" :alt="userName" />{{ userName }} </span>
                        <el-dropdown-menu slot="dropdown">
                            <!-- <el-dropdown-item @click.native="updatePasswordHandle()">修改密码</el-dropdown-item> -->
                            <el-dropdown-item @click.native="logoutHandle()">退出</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-menu-item>
            </el-menu>
        </div>
        <!-- 弹窗, 修改密码 -->
        <update-password v-if="updatePassowrdVisible" ref="updatePassowrd"></update-password>
    </nav>
</template>

<script>
import {clearLoginInfo} from '@/utils';
import UpdatePassword from './main-navbar-update-password';
export default {
    data() {
        return {
            updatePassowrdVisible: false,
            listData: [],
            oldParentIdList: [],
        };
    },
    components: {
        UpdatePassword,
    },
    computed: {
        navbarLayoutType: {
            get() {
                return this.$store.state.common.navbarLayoutType;
            },
        },
        sidebarFold: {
            get() {
                return this.$store.state.common.sidebarFold;
            },
            set(val) {
                this.$store.commit('common/updateSidebarFold', val);
            },
        },
        mainTabs: {
            get() {
                return this.$store.state.common.mainTabs;
            },
            set(val) {
                this.$store.commit('common/updateMainTabs', val);
            },
        },
        userName: {
            get() {
                return this.$store.state.user.name;
            },
        },
    },
    watch: {
        $route: 'getPath',
    },
    methods: {
        // tab 头部的导航
        getPath() {
            const that = this;
            const tabListAll = this.$store.state.common.menuList;
            if (
                !this.listData.some(obj => {
                    return obj.name == this.$route.name;
                })
            ) {
                if (this.$route.meta.menuId) {
                    tabListAll.map((obj, index) => {
                        if (
                            obj.list.some(item => {
                                return item.menuId == that.$route.meta.menuId;
                            })
                        ) {
                            this.oldParentIdList.push(obj.menuId);
                            if (
                                !this.oldParentIdList.some(value => {
                                    return value !== this.oldParentIdList[0];
                                })
                            ) {
                                this.listData.push(that.$route);
                            } else {
                                this.listData = [];
                                this.oldParentIdList = [];
                                this.oldParentIdList.push(obj.menuId);
                                this.listData.push(that.$route);
                            }
                        }
                    });
                }
            }
            if (this.$route.path == '/home') {
                this.listData = [];
                this.oldParentIdList = [];
            }
        },
        // 修改密码
        updatePasswordHandle() {
            this.updatePassowrdVisible = true;
            this.$nextTick(() => {
                this.$refs.updatePassowrd.init();
            });
        },
        // 退出
        logoutHandle() {
            this.$confirm(`确定进行[退出]操作?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    clearLoginInfo();
                    if (this.$cookie.get('roleId')) {
                        this.$cookie.delete('roleId');
                    }
                    if (this.$cookie.get('iden') == 'opp') {
                        this.$router.options.isAddDynamicMenuRoutes = false;
                        this.$router.push({name: 'opp-login'});
                        this.$cookie.delete('iden');
                    }
                    if (this.$cookie.get('iden') == 'mers') {
                        this.$router.options.isAddDynamicMenuRoutes = false;
                        this.$router.push({name: 'mers-login'});
                        this.$cookie.delete('iden');
                    }
                    if (this.$cookie.get('iden') == 'spmp') {
                        this.$router.options.isAddDynamicMenuRoutes = false;
                        this.$router.push({name: 'spmp-login'});
                        this.$cookie.delete('iden');
                    }
                    if (this.$cookie.get('iden') == 'sys') {
                        this.$router.options.isAddDynamicMenuRoutes = false;
                        this.$router.push({name: 'sys-login'});
                        this.$cookie.delete('iden');
                    }
                    if (this.$cookie.get('iden') == 'vms') {
                        this.$router.options.isAddDynamicMenuRoutes = false;
                        this.$router.push({name: 'vms-login'});
                        this.$cookie.delete('iden');
                    }
                })
                .catch(() => {});
        },
    },
};
</script>
<style lang="scss" scoped>
.logo_louzm {
    img {
        width: 50px;
        height: 50px;
    }
}
.homelogo {
    width: 100px;
    height: auto;
}
.tabNav {
    cursor: pointer;
    font-size: 14px;
}
.slash {
    margin-left: 10px;
    font-size: 14px;
}
span.tabactive {
    color: #3e8ef7;
}
</style>
