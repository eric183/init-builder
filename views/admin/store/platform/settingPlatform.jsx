import { observable, action, runInAction } from 'mobx';
import axios from 'axios';
import qs from 'qs';

export default class SettingPlatform {
    constructor(tools) {
        this.tools = tools;
    }
    @observable platformList = [];

    @action async getPlatformList(object) {
        this.tools.load(true);
        var  params = !object.page ? Object.assign(object,{page: 1,limit: 5}) : object;
        var requestData = await axios.get('/api/admin/apps', {params: params });
        requestData = requestData.data;
        runInAction(()=> {
            this.tools.load(false);

            if(requestData.status_code == 200) {
                
                this.platformList = requestData.data;
            } else {
                this.tools.message.error(requestData.message);
            }
        })
        
    }
}