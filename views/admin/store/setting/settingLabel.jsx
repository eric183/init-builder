import { observable, action, runInAction } from 'mobx';
import axios from 'axios';
import qs from 'qs';

export default class SettingLabel {
    constructor(tools) {
        this.tools = tools;
    }
    //最后一次不带参的数据
    @observable defaultList = [];

    @observable labelList = [];

    @observable count = '';

    @observable findData = [];

    @action refillDefaultList() {
        this.labelList = this.defaultList;
    }

    @action async getLabelList(object) {
        this.tools.load(true);
        var  params = !object.page ? Object.assign(object,{page: 1,limit: 5}) : object;
        var requestData = await axios.get('/api/admin/tags', {params: params });

        requestData = requestData.data;
        
        runInAction(()=> {
            this.tools.load(false);

            if(requestData.status_code == 200) {
                //保存最后一次不带参的数据
                if(!object.page) this.defaultList = requestData.data.data;
                
                this.labelList = requestData.data.data;
                this.count = requestData.data.total;

                
            } else {
                this.tools.message.error(requestData.message); 
            }
        })
        
    }
    @action async getLabelSearch(object) {
        var requestData = await axios.get('/api/admin/tags/groups/find', {params: object });

        requestData = requestData.data;
        
        runInAction(()=> {
            this.tools.load(false);

            if(requestData.status_code == 200) {
                this.findData = requestData.data;              
            } else {
                this.tools.message.error(requestData.message); 
            }
        })
        
    }

}