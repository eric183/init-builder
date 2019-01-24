import { observable, action, runInAction } from 'mobx';
import axios from 'axios';
import qs from 'qs';

export default class Home {

    constructor(global) {
        this.global = global;
    }
    
    @observable homeList = {};

    @action async getHomeList(callback) {
        // debugger;
        try {
            var request = await axios.get('/api/toboom/index');
            // debugger;
            if(request.data.status_code == 200) {
                
                runInAction(()=> {
                    
                    this.homeList = request.data.data;
                    // .map((image, index)=> {
                    //     var ImageBox = {};
                    //     // debugger
                    //     ImageBox.image = image.toboom_sort;
                    //     ImageBox.parts = image.parts;
                    //     ImageBox.rect = {
                    //         x: randomCounter(0, homeContent.clientWidth / 2),
                    //         y: randomCounter(0, homeContent.clientHeight / 2),
                    //         width: randomCounter(200, 300),
                    //         height: randomCounter(200, 300),
                    //         xs: Math.random() * 3 - 3/2,
                    //         ys: Math.random() * 3 - 3/2,
                    //     }
                    //     return ImageBox;
                    // })
                    callback && callback(this.homeList.slice(0, 20));
                    // this.global.doneWithReq();
                })
            }
        } catch(request) {

            //这里最好做errorCode判断
            this.global.goLoginPage();
        }
    }

}