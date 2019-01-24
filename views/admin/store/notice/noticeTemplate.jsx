import { observable, action, runInAction } from 'mobx';
import axios from 'axios';
import qs from 'qs';

export default class NoticeTemplate {
    constructor(tools) {
        this.tools = tools;
    }
    //最后一次不带参的数据
    @observable defaultList = [];

    @observable templateList = [];

    @observable count = '';

    @action refillDefaultList() {
        this.templateList = this.defaultList;
    }

    @action async getNoticeTemplateList(object) {
        
        this.tools.load(true);
        var  params = !object.page ? Object.assign(object,{page: 1,limit: 5}) : object;
        var requestData = await axios.get('/api/admin/notice/manages', {params: params });
        runInAction(()=> {
            this.tools.load(false);

            requestData = requestData.data;
            if(requestData.status_code == 200) {
                //保存最后一次不带参的数据
                if(!object.page) this.defaultList = requestData.data.data;
                this.count = requestData.data.total;
                
                this.templateList = requestData.data.data;
            } else {
                this.tools.message.error(requestData.message);
            }
        })
        
    }

    @action async getNoticeInfo(id) {
        var requestData = await axios.get(`/api/admin/notice/manages/${id}`);
        runInAction(()=> {
            requestData = requestData.data;
            if(requestData.status_code == 200) {
                
                this.formdata = requestData.data.data;
            } else {
                this.tools.message.error(requestData.message);
            }
        })
    } 
}