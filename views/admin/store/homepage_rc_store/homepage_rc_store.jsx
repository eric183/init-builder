import { observable, action, runInAction } from 'mobx';
import axios from 'axios';


export default class HomepageStore {

     constructor(tools){  this.tools = tools }

        // 列表数据
         @observable ListData = [];
         @observable advslists = {
            "toboom_sort": {},
            "parts": {
                "closure": [],
                "sleeve": [],
                "pocket": [],
                "belt" : []
            }
        };
        @observable partsInformation = {};
        @observable  myUploadedList = [];
      
      
       // 添加列表数据
       @action addData (p = {}, Callback = undefined ){
          axios.post('/api/admin/toboom/recomend/homes/', p ).then(({data}) =>{    
                   if(data.status_code == 201) {
                       runInAction(()=> {  Callback && Callback()  })
               }else{ }
        })
  
    }


    // 请求列表数据
     @action requestList( p = {}, Callback = undefined ){
            axios.get('/api/admin/toboom/recomend/homes', p ).then( ({ data }) => {    
                  if(data.status_code == 200){
                        runInAction(()=> {  Callback && Callback();  
                            console.log(data.data.data);
                           this.ListData = data.data.data
                    })  
                  }
            })
     }
         

         //删除数据
         @action deleteRowAction( id = '', Callback = undefined ){
            axios.delete(`/api/admin/toboom/recomend/homes/${id}`).then((data) => { 
                  if(data.status == 204 ){
                        runInAction(()=> {  Callback && Callback()  })  
                  }
            })
     }


      // 发布或回收
      @action changeState(state = '', id = '', Callback = undefined){
            axios.put(`/api/admin/toboom/recomend/homes/${id}`,{ disabled : state == '1' ? 0 : 1  }).then(({ data }) => {
                        if(data.status_code == 200){
                              runInAction( () => {
                                    Callback && Callback();
                              })
                       }        
            })


      }
  

      // 修改标题
    @action ModifyTitle(title = '',id = '', Callback = undefined ){
      axios.put(`/api/admin/toboom/recomend/homes/${id}`,{ title : title }).then(({ data }) => {
            if(data.status_code == 200){
                  runInAction( () => {
                        Callback && Callback();
                  })
           }        
         })
    }




      // ----------------------------------------

        // 获取服饰部件ID、下拉列表内容
        @action getPartsInformation(){
               axios.get('/api/admin/resource/get-search',).then(( { data } ) => {   // { params : { code : 'toboom', search : 1 } }
                         if(data.status_code == 200){
                                 runInAction(() => {
                                  //  console.log(data.data);
                                    this.partsInformation = data.data;    
                                })
                         }
               })
        } 


     // 获取关联图片
     @action getAdvslists (id = '', Callback = undefined ){
             axios.get(`/api/admin/toboom/recomend/homes/${id}`).then( ({ data }) => {
                 if(data.status_code == 200){
                        runInAction( () => {
                              Callback && Callback();
                             //  console.log(data.data)
                               this.advslists = data.data
                        })
                 }        
             })
     }
         
         

     // 添加关联图片 
     @action add_advs(id = '', p = {}, Callback = undefined ){
             axios.put(`/api/admin/toboom/recomend/homes/${id}`,{ attr : p }).then(({ data }) => {
                     if(data.status_code == 200){
                              runInAction(() => {
                                    Callback && Callback();
                              
                                    //   返回添加成功的信息
                              })   
                     }
             })
     }





     // 删除关联图片  
     @action delete_advs(id = '', Callback = undefined ){
           axios.delete(`/api/admin/toboom/recomend/homes/list/${id}`).then((data) => {
                   if(data.status == 204){
                        runInAction(() => {
                              Callback && Callback();
                              //   返回修改成功信息
                        })   
                   }
           })
     }

     

    
      // 获取图片列表
      @action getImagesResource(p = {}, Callback = undefined ){
             axios.get('/api/admin/resource',{ params : p }).then(( { data } ) => {
                   if(data.status_code == 200){
                           runInAction(() => { 
                              Callback && Callback();
                               this.myUploadedList = data.data.data
                           })
                   }
                  
             })
      }      

       // 筛选图片列表
      @action filteImageResouce(p = {}, Callback = undefined ){
            axios.get('/api/admin/resource',{ params : p }).then(( { data } ) => {
                  if(data.status_code == 200){
                          runInAction(() => { 
                              Callback && Callback();
                              this.myUploadedList = data.data.data
                          })
                  }


                 
            })
       }
         

}