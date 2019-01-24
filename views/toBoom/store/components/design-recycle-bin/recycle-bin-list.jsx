import {observable,action, computed, runInAction} from 'mobx';
import axios from 'axios';

export default class recycleBin {
    constructor(tools) {
        this.tools = tools;
    }
    @observable recycleBinList = [];
    @observable recycleBinCount = 0;

    @computed get get_recycleBinCount(){ return this.recycleBinCount }


    @action clearList() {
        this.recycleBinList = [];
    }

    // 获取删除数据
    @action async getRecycleBinListData(p, callback = function(){}) {
        //this.tools.load(true);
        var requestData = await axios.get('api/toboom/works/recycles', { params : p });
        //this.tools.load(false);
        try {
            this.recycleBinList = requestData.data.data;
            this.recycleBinCount = requestData.data.total;
            callback();
        } catch(error) {
            console.log(error);
        }
    }


    // 清空回收站
    @action async clearItemsAction( callback = function(){} ){
            let resp = await axios.delete(`/api/toboom/works/delete/clear`),
                data = resp.data;
                if( data.status_code == 200 ){
                     runInAction(() => {
                        callback()
                     })
                }
    }


}