import { observable, action, runInAction } from 'mobx';
import axios from 'axios';
import qs from 'qs';
import cookie from 'react-cookies'

export default class GlobalInfo {
    @observable popularEcharts = {};
    @observable cookie = {}
    @observable isLogin = true;
    // @observable showCube = true;
    @observable showCube = false;
    @observable locationForSiderHidden = [];
    @observable modalInfo = {
        showAlert: false,
        code: ''
    }

    constructor(){
        this.cookie = cookie;
    }
    

    @observable currentCategary = "";

    @action modalShow(value, code) {

        this.modalInfo = {
            code: code || '',
            showAlert: true,
            text: value,
        }
        // this.modalInfo.code = code || '';
        // this.modalInfo.showAlert = true;
        // debugger;
        // this.modalInfo.text = value;
    }

    @action setCategary(value){
        this.currentCategary = value;
    }


    
    @action modalHide(value, code) {
        this.modalInfo = {};
    }

    @action cubeToggle(value) {
        this.showCube = value;
    }

    @action setLogin(value) {
        this.isLogin = value;
    }
    
    @action doneWithReq() {
        this.isLogin = true;
        this.showCube = false;
    }

    @action goLoginPage() {
        this.isLogin = false;
        this.showCube = false;
        this.cookie.remove('loginToken')
    }
}