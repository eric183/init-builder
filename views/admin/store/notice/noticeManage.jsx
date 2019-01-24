import { observable, action, runInAction } from 'mobx';
import axios from 'axios';
import qs from 'qs';

export default class NoticeManage {
    constructor(tools) {
        this.tools = tools;
    }
    //最后一次不带参的数据
    @observable defaultList = [];

    @observable noticeList = [];

    @observable nt_list = [];

    @observable lang_list = [];

    @observable count = '';

    @action async getNoticeList(object) {
        this.tools.load(true);
        var  params = !object.page ? Object.assign(object,{page: 1,limit: 5}) : object;
        var requestData = await axios.get('/api/admin/notice/templates', {params: object});
        runInAction(()=> {
            this.tools.load(false);
            requestData = requestData.data;
            if(requestData.status_code == 200) {

                this.noticeList = requestData.data.data;
                this.count = requestData.data.total;
            } else {
                this.tools.message.error(requestData.message);
            }
        })
        
    }
    @action async getNoticeCreate() {
        var requestData = await axios.get('/api/admin/notice/templates/create');
        runInAction(()=> {
            requestData = requestData.data;
            if(requestData.status_code == 200) {
                
                this.noticeList = requestData.data.nt_list;
                this.lang_list = requestData.data.lang_list;
                
            } else {
                this.tools.message.error(requestData.message);
            }
        })
        
    }
    
}