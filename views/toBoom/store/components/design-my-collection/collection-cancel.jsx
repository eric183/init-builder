import { observable,action } from 'mobx';
import axios from 'axios';

export default class collectionCancel {
    constructor(tools) {
        this.tools = tools;
    }
    @observable collectionCancelList = [];
    @action clearList() {
        this.collectionCancelList = [];
    }
    @action async getCollectionCancelData() {
        //this.tools.load(true);
        var requestData = await axios.get('api/toboom/collect/cancel');
        try {
            this.collectionCancelList = requestData.data.data;
        }catch {
            console.log(error);
        }
    }
}