import { observable, action, runInAction } from 'mobx';
import axios from 'axios';
import qs from 'qs';

export default class SettingLabelGroup {
    constructor(tools) {
        this.tools = tools;
    }
    //最后一次不带参的数据
    @observable defaultList = [];

    @observable labelGroupList = [];

    @observable count = '';

    @action refillDefaultList() {
        this.labelGroupList = this.defaultList;
    }

    @action async getLabelGroupList(object) {
        this.tools.load(true);
        var  params = !object.page ? Object.assign(object,{page: 1,limit: 5}) : object;
        var requestData = await axios.get('/api/admin/tags/groups', {params: params });

        requestData = requestData.data;
        
        runInAction(()=> {
            this.tools.load(false);

            if(requestData.status_code == 200) {
                //保存最后一次不带参的数据
                if(!object.page) this.defaultList = requestData.data.data;
                
                this.labelGroupList = requestData.data.data;
                this.count = requestData.data.total;
                
            } else {
                this.tools.message.error(requestData.message); 
            }
        })
        
    }
}