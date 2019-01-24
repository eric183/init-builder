import { observable,action } from 'mobx';
import axios from 'axios';

export default class collectionMove {
    constructor(tools){
        this.tools = tools;
    }
    @observable collectionMoveList = [];
    @action clearList() {
        this.collectionMoveList = [];
    }
    @action async getCollectionMoveData() {
        //this.tools.load(true);
        var requestData = await axios.get('api/toboom/collect/move');
        //this.tools.load(false);
        try {
            this.collectionMoveList = requestData.data.data;
        }catch(error) {
            console.log(error);
        }
    }
}