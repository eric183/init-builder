import { observable, action, runInAction } from 'mobx';
import axios from 'axios';
import qs from 'qs';

export default class TemplateManage {
    constructor(tools) {
        this.tools = tools;
    }
    //最后一次不带参的数据
    @observable defaultList = [];

    @observable templateList = [];

    @action refillDefaultList() {
        this.templateList = this.defaultList;
    }

    @action async getTemplateList(object) {
        this.tools.load(true);
        var requestData = await axios.get('/api/admin/notice/manages', {params: object || {page: 1,limit: 5}});
        runInAction(()=> {
            this.tools.load(false);
            requestData = requestData.data;
            if(requestData.status_code == 200) {
                this.templateList = requestData.data.data;
            } else {
                this.tools.message.error(requestData.message);
            }
        })
        
    }
}