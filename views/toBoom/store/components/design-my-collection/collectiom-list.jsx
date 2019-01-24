import { observable,action, runInAction, computed } from 'mobx';
import axios from 'axios';

export default class collectionList {
    constructor(tools){
        this.tools = tools;
    }

    @observable collectionList = [];
    @observable collectionDir = [];
    @observable collectionClone = []; 
    @observable myCollectionList_total = 0; 

    @action clearList() {
        this.collectionList = [];
        this.collectionDir = [];
    }

    @computed get get_myCollectionList_total() { 
        return this.myCollectionList_total 
    }

    @action async getCollectionListData(object) {
        //this.tools.load(true);
        var requestData = await axios.get('api/toboom/collect', {
            params: object
        });
        //debugger
        //this.tools.load(false);
        try {
            this.collectionList = requestData.data.data;
            this.myCollectionList_total = requestData.data.total;
            //debugger
        }catch(error) {
            console.log(error);
        }
    }

    // 请求文件夹的列表数据
    //@action async getCollectionDir() {
    @action async getCollectionDir(object, boolean) {
        //this.tools.load(true);

        //let request = await axios.get('api/toboom/folders?type=favorite');

        object = object ? object : {type:"favorite"};
        let request = await axios.get(`api/toboom/folders`,{
            params: object
        })
        //console.log('request'+request);
        //debugger
        //this.tools.load(false);
        try {
            // runInAction(()=>{
                if(request.data.status_code == 200) {

                    if(!boolean) {
                        this.collectionDir = request.data.data;
                        return Promise.resolve(this.collectionDir);
                    } else {
                        this.collectionClone = request.data.data;
                        return Promise.resolve(this.collectionClone.unshift({ id: 0, title: "我的作品", child: [] }));
                    }
                //    debugger;
                    // this.collectionClone = { ...this.collectionDir };
                   
                    //console.log('this.collectionDir'+ this.collectionDir);
                    //debugger
                }
            // })
        } catch(error) {
            throw error;
        }
        
    }
}