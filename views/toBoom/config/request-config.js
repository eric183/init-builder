import axios from 'axios';
import cookie from 'react-cookies'

class RequestConfig {
    constructor() {
        // axios.defaults.baseURL = "http://local.service.com/";
        // axios.defaults.baseURL = "http://218.17.117.34:3333/";
        axios.defaults.baseURL = ENV == 'development' ? "http://service.wow-trend.test" : "http://service.wow-trend.com";
        axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        axios.defaults.headers.common['Authorization'] = cookie.load('loginToken');// sessionStorage.getItem('loginToken');
        // axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
        axios.interceptors.response.use((response) => {

            // debugger;
            // token intercept here;
            // debugger;
            return response;

        }, function(error) {
            // Do something with response error
            // debugger;
            if (error.response.status === 401) {

                store.globalInfo.modalShow("请登录", error.response.status);
                // store.globalInfo.goLoginPage();

            } else if (error.response.status === 403) {
                //绑定了没权限
                store.globalInfo.modalShow("没有权限!", error.response.status)
            } else if (error.response.status === 406) {
                //未绑定电脑
                store.globalInfo.modalShow("没有权限!", error.response.status)
            } else if (error.response.status === 409) {
                store.globalInfo.modalShow("下线通知!", error.response.status)
            } else {
                // store.globalInfo.modalShow("下载客户端!", error.response.status)
            }

            return Promise.reject(error.response);
        });
        this.store = {};
    }



    resetToken(value) {
        axios.defaults.headers.common['Authorization'] = 'Bearer' + value || '';
        // localStorage.setItem("loginToken", 'Bearer' + value || '');
        //sessionStorage.setItem("loginToken", 'Bearer' + value || '');
        if(value) cookie.save('loginToken','Bearer' + value)
        else {
            cookie.remove('loginToken')
        }
    }

    setStore(store) {
        // debugger;
        this.store = store;
    }
}


export default new RequestConfig();