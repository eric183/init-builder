import { observable, action, runInAction } from 'mobx';
import axios from 'axios';
import qs from 'qs';

export default class SettingJointor {
    constructor(tools) {
        this.tools = tools;
    }
    //最后一次不带参的数据
    @observable defaultList = [];

    @observable jointorList = {
        data: []
    };

    @action refillDefaultList() {
        this.jointorList = this.defaultList;
    }

    @action async getJointorList(object) {
        // debugger; 
        // var postInfo = {};
        
        if(!!object) {
            object = !!object.page ? object : Object.assign(object, {page:1, limit: 5});
        } else {
            object = {page: 1, limit: 5};
        }
        // postInfo['params'] = object;

        
        this.jointorList = {data:[]};
        this.tools.load(true);
        
        var requestData = await axios.get(!!object.cid || !!object.pid ? '/api/admin/cascades/datas' : '/api/admin/cascades', { params: object});
        requestData = requestData.data;
        // debugger;
        runInAction(()=> {
            this.tools.load(false);

            if(requestData.status_code == 200) {
                //保存最后一次不带参的数据
                if(!object) this.defaultList = requestData.data;
                
                this.jointorList = requestData.data;
            } else {
                this.tools.message.error(requestData.message);
            }
        })
        
    }
    // @action async getJointorList(object) {
    //     debugger
    //     this.tools.nprogress.start();
    //     var requestData = await axios.get('/api/admin/cascades',  object || {page: 1,limit: 10});
    //     requestData = requestData.data;
    //     runInAction(()=> {
    //         this.tools.nprogress.done();

    //         if(requestData.status_code == 200) {
    //             //保存最后一次不带参的数据
    //             // debugger;
    //             if(!object) this.defaultList = requestData.data;
                
    //             this.jointorList = requestData.data;
    //         } else {
    //             this.tools.message.error(requestData.message);
    //         }
    //     })
    // }
}