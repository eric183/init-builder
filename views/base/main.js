import Vue from 'vue';
// import router from '@/views/base/config/router-config';
import Test from './components/test/default/index';

const component = 'test/default/index'; 
// const main = 'main';
Vue.component('John', function(resolve, reject) {
    // 这个特殊的 require 语法告诉 webpack
    // 自动将编译后的代码分割成不同的块，
    // 这些块将通过 Ajax 请求自动下载。
    // require([mm], resolve)

    // require(["./components/"+ 'test/default/index' + '.vue'], resolve)
    // require(['./my-async-component'], resolve)
});


// let component = './component'
const vm = new Vue({
    // router, 
    // template: `<router-view class="view"></router-view>`,
    components: {   
        John: () => import(`@/views/base/components/${component}`)
    }
}).$mount('#app');