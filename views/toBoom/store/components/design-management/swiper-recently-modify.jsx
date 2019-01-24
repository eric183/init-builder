import { observable,action } from 'mobx';
import axios from 'axios';

export default class swiperRecentlyModify {
    constructor(tools) {
        this.tools = tools;
    }
    @observable swiperRecentlyModifyList = [];
    @action clearList() {
        this.swiperRecentlyModifyList = [];
    }
    @action async getSwiperRecentlyModifyData(object) {
        //this.tools.load(true);
        var requestData = await axios.get('api/toboom/works/recent-modify',{
            params: object
        });
        //this.tools.load(false);
        try {
            this.swiperRecentlyModifyList = requestData.data.data;
        }catch(error){
            console.log(error);
        }
    }
}