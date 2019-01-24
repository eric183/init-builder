import { observable,action, runInAction, computed } from 'mobx';
import * as defaultMobx from 'mobx';

import axios from 'axios';
import SettingNodeStore from '../../../../admin/store/node/settingNodeStore';
import qs from 'qs';


export default class allworks  {
    constructor(tools) {
        this.tools = tools;
    }

    @observable allworksListClone = [];  
    @observable allworksList = [];
    @observable allWorksDir = [];
    @observable allworksList_total = 0;
    @observable categoryOptions = [];  
    
    @observable attrsObject = {  };

    @observable tagsArray  = {     // 所有标签
        category : { children : [] },
        clen : { children : [] },
        details : { children : []  },
        part : { children : []  },
        profile : { children : []  },
        season : { children : []  },
        style : { children : []  }
                };

    @observable allWorksDirClone = [];
  

    //对全部作品页和最近修改页  对于已发布状态的作品，更多操作中 要 隐藏【删除】和【发布】按钮 ,在mobx里设置一个值 ````  开始 //
    @observable toolState = 0;

    @action setToolState(value) { 
        this.toolState = value
    }

    @action resetData() {
        this.toolState = 0;
    }

    @computed get get_toolState() { 
        return this.toolState 
    }
    //对全部作品页和最近修改页  对于已发布状态的作品，更多操作中 要 隐藏【删除】和【发布】按钮 ,在mobx里设置一个值 ````  结束 //


    @action clearList() {
        this.allworksList = [];
        this.allWorksDir = [];
        this.allWorksDirClone = [];
    }

    @computed get get_allworksList_mix(){
                return {
                    allworksList : defaultMobx.toJS( this.allworksList ),
                    count : this.allworksList_total
            }
      }
    
 @computed get get_allworksList_total(){ 
          return this.allworksList_total
     }


    @computed get get_tagsArray(){ return this.tagsArray }
    @computed get get_categoryOptions(){ return this.categoryOptions }


    @action setProperties(key, value) {
        if (key instanceof Object) {

            let keysName = Object.keys(key);
            for (let i = 0; i < keysName.length; i++) {
                this[keysName[i]] = this[keysName[i]] = key[keysName[i]];
            }

            value instanceof Function ? setTimeout(() => { value() }, 150) : '';

        } else if (typeof key == 'string') {
            this[key] = value;
        }
    }



    @action setAttrsObject( value ){
            this.attrsObject = value
    }



   // 获取总览数据
    @action async getAllWorksData(qsInfo) {
        //this.tools.load(true);
        let requestData = await axios.get('api/toboom/works', {
            params: qsInfo
        });
        //this.tools.load(false);
        try {
            this.allworksList = requestData.data.data;
            this.allworksList_total = requestData.data.total;
        }catch(error) {
            console.log(error);
        }
    }


    // 请求 文件夹的列表数据
    @action async getAllWorksDir(object,boolean) {
        object = object ? object : { type: "works" } 
        let request = await axios.get(`/api/toboom/folders`, {
            params: object
        });
        try {
            if(request.data.status_code == 200) {
                if(!boolean) {
                    this.allWorksDir = request.data.data;
                    return Promise.resolve(this.allWorksDir);
                } else {
                    this.allWorksDirClone = request.data.data;
                    return Promise.resolve(this.allWorksDirClone.unshift({ id: 0, title: "我的作品", child: []}));
                }           
            }     
        } catch(error) {
            throw error;
        }
    }




    // 删除作品
    @action async deleteItem( p, callback = function(){} ){
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



    // 请求品类标签数据
    @action async requestTags() {
        var resp = await axios.get('/api/toboom/finished/get-tags'),
            data = resp.data;
        if( data.status_code == 200 ){
                runInAction(() => {
                        this.tagsArray = data.data       
                })   
            }
    }



    // 获取category 标签
    @action async requestCategoryTags( p ) {
        var resp = await axios.get('/api/toboom/finished/get-tags',{ params : p }),
            data = resp.data;
        if( data.status_code == 200 ){
                runInAction(() => {
                        this.categoryOptions = data.data       
                })   
            }
    }



    // 批量编辑
    @action async multi_edit_Mehtod(p = {}, callback = function(){} ) {
        var resp = await axios.post('/api/toboom/finished/multi-edit', p),
            data = resp.data;
        if( data.status_code == 200 ){
                runInAction(() => {
                    callback()   
                })   
            }   
    }



}