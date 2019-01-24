import {observable, computed, action, runInAction} from 'mobx';
import axios from 'axios';

export default class category {
    constructor(global) {
        this.global = global;
    }
    @observable page = 0;
    @observable end = false;
    @observable list = [];
    @observable aggs = {};

    @observable sort_id;
    @observable orderBy;
    @observable season_id;
    @observable angle;
    @observable angle;
    @observable detailData = {
        resource : {
            drawing_pics : [],
            hd : ''
        },
        similar : []
    };




    @action
    async init(options = {}) {

        let {sort_id, orderBy, season_id, angle, init} = options
        
        runInAction(() => {
            this.page = 0;
            this.end = false;
            this.list = [];
            if (init){
                this.sort_id = sort_id
                this.angle = angle
                this.orderBy = orderBy
                this.season_id = season_id
            }
            sort_id ? this.sort_id = sort_id : null;
            angle ? this.angle = angle : null;
            orderBy ? this.orderBy = orderBy : null;
            season_id ? this.season_id = season_id : null;

        })
    }


      @action clearPageValue (){  this.page = 0  }


     // 获取详情数据
     @action async getDetailData(id, callback){           
             try{
                var requestData = await axios.get(`/api/toboom/resources/${id}`);
                
                if(requestData.data.status_code == 200){
                    runInAction(() => {
                        this.global.doneWithReq();
                         this.detailData = requestData.data.data;
                         callback && callback();
                   
                   })
                     
                }

             }catch(error){
                this.global.goLoginPage();
             }
     }



  

    @action
    async getList(f = true) {
        try {
            var requestData = await axios.get('/api/toboom/search', {
                params: {
                    angle: this.angle,
                    limit: 18,
                    sort_id: this.sort_id,
                    season_id: this.season_id,
                    page: this.page+1,
                    orderBy: this.orderBy,
    
                }
            });

            requestData = requestData.data.data;

            // debugger;
            runInAction(() => {

                this.page = requestData.current_page

                let list = requestData.data,
                    itemList = [],
                    newList = [];


                list.forEach(item => {
                    itemList.push(item)
                    if (itemList.length == 6) {
                        newList.push(itemList)
                        itemList = [];
                    }
                })


                if (itemList.length > 0) {
                    newList.push(itemList);
                    this.end = true;
                }

                this.list = this.list.concat([], this.list, newList);

                f ? this.aggs = requestData.aggs : '';

                this.global.doneWithReq();
                
            })

        } catch(error) {
              this.global.goLoginPage();
        }
        
    }
}