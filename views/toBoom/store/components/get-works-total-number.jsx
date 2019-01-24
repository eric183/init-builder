import { observable,action } from 'mobx';
import axios from 'axios';

export default class worksTotalNumber {
  
    @observable worksTotalNumberInfo = [];
    @observable worksAllMessageInfo = [];
    @action clearList() {
        this.worksTotalNumberInfo = [];
        this.worksAllMessageInfo = [];
    }
    
    @action async getWorksTotalNumberData() {
        var requestData = await axios.get('api/toboom/works/get-works-count');
        try {
            this.worksAllMessageInfo = requestData.data;
            this.worksTotalNumberInfo = requestData.data.data;
        }catch(error) {
            console.log(error);
        }
    }
}