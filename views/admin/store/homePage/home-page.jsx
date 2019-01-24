// import * as mobx from 'mobx';
import { observable, action } from 'mobx';

import axios from 'axios';

export default class homePageInfo {
    constructor(tools) {
        this.tools = tools;
    }
    @observable homePageList = [];

    @action clearList() {
        this.homePageList = [];
    }

    @action async getHomeData() {

        this.tools.load(true);
        var requestData = await axios.get('/api/admin/toboom/recomend/homes');
        this.tools.load(false);
        try {
            this.homePageList = requestData.data.data;
        } catch(error) {
            console.log(error);
        }
    }


}