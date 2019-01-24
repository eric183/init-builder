import { observable, action, runInAction } from 'mobx';
import axios from 'axios';



export default class PopularStore {

      @observable listData = [{
                        "id": 1,
                        "app_id": 6,
                        "nav_id": 1,
                        "title": "首页广告put",
                        "name": "首页put",
                        "max_count": 5,
                        "width": 0,
                        "height": 0,
                        "disabled": 1,
                        "expands": {
                              "interpretation_type": "廓形"
                        },
                        "created_at": "2018-06-20 18:43:45",
                        "updated_at": "2018-06-21 15:01:56"
                  }];



     // 获取列表数据
      @action getListData(p = {}, Callback = undefined) {
             axios.get('/api/admin/toboom/popular/manages',{ params : p }).then(({ data }) => {
                    if(data.status_code == 200){
                        runInAction(()=> {  Callback && Callback();  
                               console.log(data.data.data);
                          })
                    }
             })
      }

      // 添加列表单个数据
      @action addItem(p = {}, Callback =  undefined){
            // axios.post(' /api/admin/toboom/popular/manages',{ params : p }).then(({ data }) => {
            //       if(data.status_code == 201){
            //                 runInAction(()=> {  Callback && Callback();  
            //                     console.log(data.data.data);
            //             })
            //       }
            // })

      }
  

       //修改列表单个数据
      @action editItem(id = '', p = {}, Callback = undefined ){
            axios.put(`/api/admin/toboom/popular/manages/${id}`, p).then(() => {
                               
            })
      }

      



}