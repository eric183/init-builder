import { observable, action } from 'mobx';
import axios from 'axios';

export default class homePageEditorInfo {
    constructor(tools) {
        this.tools = tools;
    }
    @observable homePageEditorList = [];
    // @observable chosenObject = {};
    // @observable isChosen = false;

    @action clearList() {
        this.homePageEditorList = [];
    }
    @action async getHomePageEditorData(object, callback) {
        // debugger;
        this.tools.load(true);
        //debugger
        var requestData = await axios.get(`/api/admin/toboom/recomend/homes/${object.id}?page=${object.page}`);
        this.tools.load(false);
        try {
            this.homePageEditorList = requestData.data.data; 
            //debugger;      
            !!callback && callback();
        }catch(error) {
            console.log(error);
        }
    }

    // @action chosingAction(object) {
    //     this.chosenObject = object;
              
    //     // axios.get('').then(()=> {
    //     //     // this.isChosen = true;
    //     //     // chosingAction
    //     // })
    // }
}