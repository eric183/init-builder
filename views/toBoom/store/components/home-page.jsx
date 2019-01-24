import {observable,action} from 'mobx';
import axios from 'axios';

export default class homePage {
    constructor(tools) {
        //this.tools = tools;
    }
    @observable userInfo = [];
    @observable homePagePicList = [];
    @action clearList() {
        this.userInfo = [];
        this.homePagePicList = [];
    }
    @action async getHomePageData() {
        //debugger
        
        //this.tools.load(true);
        var requestData = await axios.get('api/user/info');
        //debugger
        //this.tools.load(false);
        try {
            this.userInfo = requestData.data.data;
        } catch(error) {
            console.log(error);
        }
    }
    @action async getHomePagePicData() {
        var requestData = await axios.get('api/toboom/index');
        try {
            this.homePagePicList = requestData.data.data;
        }catch(error) {
            console.log(error);
        }
    }
}