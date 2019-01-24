import { observable, computed, action, runInAction } from 'mobx';
import { message } from 'antd';
import axios from 'axios';
import qs from 'qs';


export default class SettingRole {
    @observable dataSource = [
        {
            platform: "管理平台",
            name: '男装主管',
            range: 'A栏目,B栏目..',
            time: '2018-05-16 10:46',
            remarks: 'klasdfjl',
            id: '1'
        }
    ]

    @observable customerData = [
         {
            id : '1',
            company_name : '热点设计',
            account : 'renwenjun',
            right : '男装、女装、发布会',
            deadline : '300天',
            members : '10个',
            contacts : '任文君',
            contact_way : '1304543497425',
            state : '正常'
         },
         {
            id : '2',
            company_name : '热点设计',
            account : 'renwenjun',
            right : '男装、女装、发布会',
            deadline : '300天',
            members : '10个',
            contacts : '任文君',
            contact_way : '1304543497425',
            state : '正常'
         }
    ]

    @observable memberData = [
         {  
            id : '1',
            name : '任文君', 
            post : '女装设计师',
            account : 'renwenjin',
            tel : '13043497425',
            content_right : '女装VIP',
            manage_right : '普通',
            way : '邀请',
            state : '待激活'
         },
         {  
            id : '2',
            name : '任文君', 
            post : '女装设计师',
            account : 'renwenjin',
            tel : '13043497425',
            content_right : '女装VIP',
            manage_right : '管理员',
            way : '邀请',
            state : '已拒绝'
         }
    ]




     // 角色列表数据
   @action getRoleData(params, Callback){
            axios.get('/api/admin/rbac/roles',params).then(({data}) =>{
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

    


}