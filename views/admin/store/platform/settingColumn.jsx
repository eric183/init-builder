import { observable, action, runInAction } from 'mobx';
import axios from 'axios';
// import qs from 'qs';

export default class SettingColumn {
    constructor(tools) {
        this.tools = tools;
    }
    //最后一次不带参的数据

    @observable columnList = [];

    @observable count = "";

    @observable platfromList = [];

    @observable AssoLabelList = [];

    @observable AssoLabelGroupList = [];

    @action async getColumnList(object) {
        this.tools.load(true);
        var  params = !object.page ? Object.assign(object,{page: 1,limit: 5}) : object;
        var requestData = await axios.get('/api/admin/columns', {params: params });
        
        requestData = requestData.data;
        runInAction(()=> {
            this.tools.load(false);

            if(requestData.status_code == 200) {
                //保存最后一次不带参的数据
                // if(!object.page) this.defaultList = requestData.data;
                
                this.columnList = requestData.data.data;
                this.count =  requestData.data.total;
            } else {
                this.tools.message.error(requestData.message);
            }
        })
        
    }
    @action async getPlatfromList() {
       
        var requestData = await axios.get('/api/admin/apps');
        requestData = requestData.data;
        runInAction(()=> {
            if(requestData.status_code == 200) {
                this.platfromList = requestData.data;
            } else {
                this.tools.message.error(requestData.message);
            }
        })
        
    }
    @action async getAssoLabelList(id) {
        var requestData = await axios.get('/api/admin/columns/ref-groups',{ params:{
            id: id
        }});
        requestData = requestData.data;
        runInAction(()=> {
            if(requestData.status_code == 200) {
                this.AssoLabelList = requestData.data;
            } else {
                this.tools.message.error(requestData.message);
            }
        })
    }
    //标签组
    @action async getAssoLabelGroupList(id) {
        var requestData = await axios.get('/api/admin/columns/groups-list',{params:{
            id: id
        }});
        requestData = requestData.data;
        runInAction(()=> {
            if(requestData.status_code == 200) {
                this.AssoLabelGroupList = requestData.data;
            } else {
                this.tools.message.error(requestData.message);
            }
        })
    }
}