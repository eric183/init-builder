import { observable, action, runInAction, computed } from 'mobx';
import axios from 'axios';


export default class ProductManagement {
 

    @observable productManagementList = []; // 成品列表数据
    @observable productManagemen_total = 0;
    @observable tagsArray  = {     // 所有标签
        category : { children : [] },
        clen : { children : [] },
        details : { children : []  },
        part : { children : []  },
        profile : { children : []  },
        season : { children : []  },
        style : { children : []  }
                };

       @observable ImageForEdit = {   // 被编辑图片数据
           attr : { 
                category : [],
                clen : [],
                details : [],
                part : [],
                picture_use : [],
                profile : [],
                season : [],
                style : [],
                profile : []
           } 
      };

      @observable logsArray = [];  // 操作记录
      @observable logs_total = 0;

      @observable rolesArray = [];

      @observable operateArray = [];

      @observable userInfo_category = [];

      @observable categoryOptions = [];

      @observable sub_categoryOptions = [];  //  categoryOptions 的子类。

      @observable modifiedUser = [];


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





    @action clearList() {  this.productManagementList = [] }



    
   @computed get get_productManagementList(){ return this.productManagementList }
   @computed get get_productManagemen_total(){ return this.productManagemen_total }
   @computed get get_tagsArray(){ return this.tagsArray }
   @computed get get_logsArray(){ return this.logsArray }
   @computed get get_rolesArray(){ return this.rolesArray }
   @computed get get_operateArray(){ return this.operateArray }
   @computed get get_logs_total(){ return this.logs_total }
   @computed get get_category(){ return this.userInfo_category }
   @computed get get_categoryOptions(){ return this.categoryOptions }
   @computed get get_sub_categoryOptions(){ return this.sub_categoryOptions }
   @computed get get_modifiedUser(){ return this.modifiedUser }




    // 请求成品列表数据
    @action async getProductManagementData( p = {}, callback = function(){} ) {
        var resp = await axios.get('/api/toboom/finished', { params : p }),
            data = resp.data;
          if( data.status_code == 200 ){
                  runInAction(() => {
                       this.productManagementList = data.data;
                       this.productManagemen_total = data.total;
                       callback();
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


        // xxx
        @action set_sub_categoryOptions( title ){
              this.categoryOptions.forEach((item ,index) => {
                    if( item.title == title ) this.sub_categoryOptions = item.children;
              })
        }
         

        // 获取category 标签
        @action async requestCategoryTags( p ) {
            var resp = await axios.get('/api/toboom/finished/get-tags',{ params : p }),
                data = resp.data;
            if( data.status_code == 200 ){
                    runInAction(() => {
                            this.categoryOptions = data.data;
                            this.sub_categoryOptions = data.data[0].children || []; // 获取子类       
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


     
      //  获取操作记录
      @action async requestLogs(p = {}, callback = function(){} ) {
        var resp = await axios.get('/api/toboom/finished/logs', { params : p }),
            data = resp.data;
        if( data.status_code == 200 ){
                runInAction(() => {
                     this.logsArray = data.data;
                     this.logs_total = data.total;
                     callback()   
                })   
            }   
     }


        //  获取操作记录  role , operate
        @action async requestLogFilter(p = {}, callback = function(){} ) {
            var resp = await axios.get('/api/toboom/finished/get-log-filter', { params : p }),
                data = resp.data;
            if( data.status_code == 200 ){
                    runInAction(() => {
                        if( p.type == 'role' ){
                             this.rolesArray = data.data
                        }else{
                             this.operateArray = data.data
                        }
                         callback()   
                    })   
                }   
         }



        // 删除作品
        @action async deleteItem(p = {}, callback = function(){} ) {
            var resp = await axios.post('/api/toboom/works/multi-delete', p ),
                data = resp.data;
            if( data.status_code == 200 ){
                    runInAction(() => {            
                          callback();   
                    })   
                }   
         }


      // 设置作品发布状态
      @action async setRelease(p = {}, callback = function(){} ) {
        var resp = await axios.post('/api/toboom/finished/set-release', p ),
            data = resp.data;
        if( data.status_code == 200 ){
                runInAction(() => {            
                      callback();   
                })   
            }   
       }
     
    
   
       // 获取展示权限
       @action async requestUserInfo(callback = function(){} ){
             let resp = await axios.get('/api/user/info'),
                 data = resp.data;
                 if(data.status_code == 200){
                    runInAction(() => {
                            if(  data.data instanceof Array ){
                                 this.userInfo_category = [];
                                 callback( [] )
                            }else{
                                this.userInfo_category = data.data.category ;
                                callback( data.data.category )
                            }
                        
                       })    
                }   
            
       }
 

    // 最近修改人
    @action async request_modified_user (callback = function(){} ){
        let resp = await axios.get('/api/toboom/finished/get-modified-user'),
            data = resp.data;
            if(data.status_code == 200){
               runInAction(() => {
                       this.modifiedUser = data.data;
                       
                  })    
           }   
       
  }
    

    



}