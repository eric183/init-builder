import { observable, action, runInAction } from 'mobx';
import axios from 'axios';
export default class RecommendStore {

      constructor(tools){  this.tools = tools }

    @observable recommendData = [];
    


    @observable recommendDetailData = [];
    
    // [
    //      {
    //          id : '234',
    //          title: 'Feng Chen Wang - 回家的路（2018/19秋冬）',
    //          picture: 'http://pic36.photophoto.cn/20150801/0029014163022318_b.png',
    //          column: 'T台分析',
    //          time: '2018-03-22 18:34',
    //      },
    //      {
    //         id : '435',
    //         title: 'Feng Chen Wang - 回家的路（2018/19秋冬）',
    //         picture: 'http://pic36.photophoto.cn/20150801/0029014163022318_b.png',
    //         column: 'T台分析',
    //         time: '2018-03-22 18:34',
    //     }
    // ];




    @observable selectOpions =  [
     {
        "id": 1,
        "code": "trend",
        "name": "宁博涛",
        "title": "趋势网",
        "link": "",
        "keywords": "",
        "descript": "Consequatur earum numquam alias et nihil. Iusto animi autem est nam officia accusamus et. Sunt quaerat et qui a excepturi.",
        "copyright": "",
        "disabled": 0,
        "sort": 0,
        "is_private": 0,
        "created_at": null,
        "updated_at": null,
        "navs": [{
            "id": 101,
            "app_id": 1,
            "title": "趋势网1",
            "subtitle": "",
            "summary": "",
            "link": "",
            "icon": "",
            "logo": "",
            "target": "_self",
            "sort": 0,
            "disabled": 0,
            "pid": 0,
            "lft": 0,
            "rgt": 0,
            "depth": 0,
            "created_at": null,
            "updated_at": null
        }, {
            "id": 102,
            "app_id": 1,
            "title": "趋势网2",
            "subtitle": "",
            "summary": "",
            "link": "",
            "icon": "",
            "logo": "",
            "target": "_self",
            "sort": 0,
            "disabled": 0,
            "pid": 0,
            "lft": 0,
            "rgt": 0,
            "depth": 0,
            "created_at": null,
            "updated_at": null
        }]
    }];




    @action getRecommendData(p = {}, Callback = undefined ){

         axios.get('/api/admin/advs/manages',{params : p }).then(({data}) =>{
                    if(data.status_code == 200) {
                        runInAction(()=> {
                            Callback && Callback();
                           this.recommendData = data.data.data
                        
                    })

                }else{
                    
                }
         })

    }


    // 添加推荐位
    @action addAdver(p = {}, Callback = undefined ){
          
                axios.post('/api/admin/advs/manages',p).then(({data}) =>{

                    if(data.status_code == 201) {

                      runInAction(()=> {  Callback && Callback()  })

                }else{
                    
                }
        })
    }



   // 获取select选项
    @action getNodes (p = {} ){
        axios.get('/api/admin/advs/manages/create ').then(({data}) =>{
            if(data.status_code == 200) {
                runInAction(()=> {
                    this.selectOpions =  data.data.apps
            })

        }
    })
}

 

// 编辑
@action editeRow( p = {}, id = '', Callback = undefined ){
        axios.put(`/api/admin/advs/manages/${id}`,{params : p}).then(({data}) =>{
            if(data.status_code == 200) {
                runInAction(()=> {

                   this.tools.message.success('编辑成功！',()=>{   Callback && Callback()  })

            })
        }
    }) 
} 



// 删除
@action deleteRow (id = '', Callback = undefined ){
      axios.delete(`/api/admin/advs/manages/${id}`).then((data) => {
           if(data.status == 204){
                runInAction( () => {
                     Callback && Callback() 
                }) 
           }

      })


}





   /*   detail store  START  */

      @action getRecommendDetailData (p = {} , Callback = undefined ){
             axios.get('/api/admin/advs/lists',{params : p}).then(({data}) => {
                   if(data.status_code == 200){
                          runInAction(() => {
                             this.recommendDetailData = data.data.data;
                          })
                   }
             })
            
      }

      
      @action addAdver_sub (p = {}, Callback = undefined ){
           axios.post('/api/admin/advs/lists',p).then(({data}) => {
                    if(data.status_code == 201){
                         runInAction(() => {
                               Callback  && Callback()
                         })
                    }
           })
      }


      @action editeRow_sub (p = {}, id = '', Callback = undefined ) {
            axios.put(`/api/admin/advs/lists/${id}`,p).then((data) => {
                  if(data.status == 200){
                        runInAction(() => {
                            this.tools.message.success('编辑成功！',() => {  Callback  && Callback()  })
                        })
                  }

            })

      }


    @action deleteRow_sub (id = '', Callback = undefined ) {

           axios.delete(`/api/admin/advs/lists/${id}`).then((data) => {

                if(data.status == 204 ){
                      runInAction(() => {
                           Callback  && Callback() 
                      })
                }
           })
    }



   /*   detail store  END  */




}







