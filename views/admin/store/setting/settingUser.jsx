import { observable, action, runInAction } from 'mobx';
import axios from 'axios';
import qs from 'qs';

export default class SettingUser {
    constructor(tools) {
        this.tools = tools;
    }
    //最后一次不带参的数据
    @observable defaultList = [];

    @observable userList = [];

    @action refillDefaultList() {
        this.userList = this.defaultList;
    }

    @action async getUserList(object) {
        this.tools.load(true);
        var  object = !object.page ? {page: 1,limit: 10} : object;
        var requestData = await axios.get('/api/member/members', {params: object });

        requestData = requestData.data;
        
        runInAction(()=> {
            this.tools.load(false);

            if(requestData.status_code == 200) {
                //保存最后一次不带参的数据
                if(!object) this.defaultList = requestData.data.data;
                
                this.userList = requestData.data.data;

                
            } else {
                this.tools.message.error(requestData.message); 
            }
        })
        
    }



   // 新增用户信息
   @action async userInfor_add(p,callback){
          let resp = await axios.post('/api/member/members', p),
              data = resp.data;
            runInAction(() => {
                   if(data.status_code == 201){
                        callback && callback();
                   }
            })

   }


// 新增、修改用户信息
   @action async userInfor_edite(id,p, callback){
    let resp = await axios.put(`/api/member/members/${id}`, p),
        data = resp.data;
      runInAction(() => {
            if(data.status_code == 200){
                callback && callback();
            }
      })

}








}