import axios from 'axios';



class RequestConfig {
    constructor() {

        // debugger;
        // axios.defaults.baseURL = "http://local.service.com/";
        // axios.defaults.baseURL = "http://service.wow-trend.test/";

        axios.defaults.baseURL = ENV == 'development' ? "http://service.wow-trend.test/" : "http://service.wow-trend.com/";

        // axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('loginToken');
        // debugger;
        // debugger;
    }

    resetToken(value) {
        axios.defaults.headers.common['Authorization'] = 'Bearer' + value || '';
    }
}


export default new RequestConfig();