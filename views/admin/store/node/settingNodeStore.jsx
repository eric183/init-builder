import { observable, action, runInAction } from 'mobx';
import { message } from "antd";
import axios from 'axios';
import qs from 'qs';


export default class SettingNodeStore {
    constructor(tools) {
        this.tools = tools;
    }


    @observable platformList = [
      { 
        index : 1,
        scope : '发现网1',
        name : 'public',
        title : '公共资源',
        id : 412
      },
      {
        index : 2,
        scope : '发现网2',
        name : 'public',
        title : '公共资源',
        id : 543
      }
  
    ];

    // {
    //   scope : '发现网1',
    //   title : 'public',
    //   title : '公共资源'
    // },
    // {
    //   scope : '发现网2',
    //   title : 'public',
    //   title : '公共资源'
    // },


 /* 获取平台列表数据 start  */  

   @action getPlatformData (param){

            axios.get('/api/admin/rbac/abilities',param).then(({data})=> {

          
              if(data.status_code == 200) {
                    runInAction(()=> {

                      console.log(data.data);

                      //   this.platformList = data.data
                    
                  })

              }else{
                   
              }
          })
   }




   // 增加新节点
   @action addNodes(params,Callback = undefined){

          //  Callback && Callback();

        // return false;

                    axios.post('/api/admin/rbac/abilities',params).then(function({data}){
                      if(data.status_code == 200) {

                            runInAction(()=> {

                              console.log(data.data);

                               this.platformList = data.data
                            
                          })


                      }else{

                   
                          
                    }

                    Callback || Callback(data);
                
              })  

   }





 /*  获取平台列表数据 end   */ 








}