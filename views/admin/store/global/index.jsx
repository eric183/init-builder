import { observable, computed, action, runInAction } from 'mobx';

import * as mobx from 'mobx'; 
import axios from 'axios';
import qs from 'qs';
import { generateShowHourMinuteSecond } from 'antd/lib/time-picker';

export default class GlobalInfo {
    constructor(tools) {
        this.tools = tools;
    }
    @observable cityData = [];
    @observable optionsData = [];
    @observable isLogin = false;
    @observable keepLink = '';
    @observable hasChecked = false;
    @observable userData = {};
    @observable showCube = true;
    @observable productObject = {};
    @action cubeToggle(value) {
        this.showCube = value;
    }
    
    @action setLink(value) {
        this.keepLink = value;
    }


    @action getMenu() {
        return axios.get('/api/admin/menus?app_id=3');

    }

    @action async checkLogin() {
      
        try {
            var getUser = axios.get('/api/user');
            const response = await axios.all([getUser,this.getMenu()])
            // debugger;
            if(response[0].data.status_code == 200) {
                
                runInAction(()=> {
                    this.showCube = false;
                    this.isLogin = true;
                    this.userData = response[0].data.data;
                    this.productObject.devNav = response[1].data.data.data;

                })
            }
        } catch({response}) {
            if(response.status > 200 ) {
                this.tools.message.warn("请重新登录");
                this.cubeToggle(false);
            }
            // this.hasChecked = true;
        }
        // axios.get('/api/user').then(({data})=> {
        //     this.hasChecked = true;
        // // axios.get('/api/admin/notice/manages').then(({data})=> {0
           
        // }).catch(({response})=> {
        //     // if()
        //     // response.status
        //     this.tools.message.warn("请重新登录");
        //     this.hasChecked = true;
        // })
    }

    @action setLogin(value) {
        this.isLogin = value;
    }


}
