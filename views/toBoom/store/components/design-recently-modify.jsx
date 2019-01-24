import { observable, action, computed, runInAction } from 'mobx';

import axios from 'axios';


export default class designRecentlyModifyInfoList {
    constructor(tools) {
        this.tools = tools;
    }
    @observable designRecentlyModifyList = [];
    @observable modifiedCount = 0;

    @computed get get_modifiedCount(){ return this.modifiedCount }

    @action clearList() { this.designRecentlyModifyList = []; }


    // 获取修改列表数据
    @action async getDesignRecentlyModifyData( p = {}, callback = function(){} ) {
        // this.tools.load(true);
        var requestData = await axios.get('api/toboom/works/recent-modify-list', { params : p });
        // this.tools.load(false);
        try {
            this.designRecentlyModifyList = requestData.data.data;
            this.modifiedCount = requestData.data.total;
            callback();
        } catch(error) {
            console.log(error);
        }
    }

    // 删除作品
    @action async deleteItem( p, callback = function(){} ){
        //debugger;
        let resp = await axios.post('/api/toboom/works/multi-delete', p ),
            data = resp.data;
            if(data.status_code == 200){
                    runInAction(() => {        
                        callback(data)
                })
            } else {
                //debugger
                runInAction(() => {               
                    callback(data)
                })
            }
    }



}