import { observable, action, runInAction } from 'mobx';
import axios from 'axios';
import qs from 'qs';
import * as mobx from 'mobx';


function createData() {
    let data = tags.map((title, index) => {
        let obj = Object.assign({}, item);
        obj.title = title;
        obj.id = Math.floor(Math.random() * 127 + 1);
        return obj
    });
    return data
}




export default class PopularStore {

    @observable slideData = { materials: [], name: '', desc: '' }; // 流行趋势幻灯片数据
    @observable sourceData = [] // 流行解读首页总数据
    @observable itemData = {} // 流行解读首页展示数据，初始化选sourceData第一条
    @observable categorys = []; // 流行解读首页品类

    @observable pieData = []; // 饼图信息 【 流行解读详情页 】

    @observable imageListSource = [ // 流行解读详情页数据  【 处理过的瀑布流数据 】
        [],
        [],
        []
    ];









    // 选择下载文件状态 start 
    @observable formState = {
        fpngDisable: false,
        fepsDisable: false,
        rpngDisable: false,
        repsDisable: false,
        front: false,
        fpng: false,
        feps: false,
        reverse: false,
        rpng: false,
        reps: false,
        frontChoose: [],
        reverseChoose: [],
        checkboxSource: {},
    };

    @observable confirmDisable = true;
    // 选择下载文件状态 end 



    @action setProperties(key, value) {

        if (key instanceof Object) {

            let keysName = Object.keys(key);
            for (let i = 0; i < keysName.length; i++) {
                this[keysName[i]] = key[keysName[i]];
            }

            value instanceof Function ? setTimeout(() => { value() }, 150) : '';

        } else if (typeof key == 'string') {

            this[key] = value;
        }
    }



    // 重置下载状态
    @action resetFieldsValue() {
        this.formState = {
            fpngDisable: false,
            fepsDisable: false,
            rpngDisable: false,
            repsDisable: false,
            front: false,
            fpng: false,
            feps: false,
            reverse: false,
            rpng: false,
            reps: false,
            frontChoose: [],
            reverseChoose: [],
            checkboxSource: {},
        }
        this.confirmDisable = true;
    }




    // 获取流行解读首页数据
    @action async request_popularData(p, callback) {
        let resp = await axios.get('/api/toboom/popular/index', { params: p }),
            data = resp.data;
        if (data.status_code == 200) {
            runInAction(() => {
                this.sourceData = data.data;
                this.itemData = (data.data instanceof Array && data.data.length > 0) ? data.data[0] : {}; // 初始化、加载数据都默认第一个
                this.slideData = (data.data instanceof Array && data.data.length > 0) ? data.data[0].folders[0] : { materials: [], name: '', desc: '' }; // 初始化、加载数据都默认第一个

                callback && callback()
            })
        }

    }



    // 获取品类
    @action async request_categorys() {
        let resp = await axios.get('/api/toboom/popular/get-categorys'),
            data = resp.data;
        if (data.status_code == 200) {
            this.categorys = data.data
        }

    }





    // 获取流行解读详情页
    @action async request_detailData(id, p = {}, callback) {
        let resp = await axios.get(`/api/toboom/popular/show/${id}`, { params: p }),
            data = resp.data;
        if (data.status_code == 200) {
            runInAction(() => {
                let _data = data.data;
                if (_data && _data.length) {
                    this.imageListSourceAdd(_data);

                    callback(data.data, p);

                } else {
                    callback([], p);
                }

            })

        }

    }

    imageListSourceAdd = (data) => {
        var minIndex = () => {
            var sizes = [410, 310, 410]; // 图片的宽度 + 10像素 margin
            var arrLengths = (() => {
                let arrlen = [];
                this.imageListSource.forEach((item, index) => {
                    item.length > 0 ? arrlen.push(item.length * sizes[index]) : arrlen.push(sizes[index]);
                })
                return arrlen
            })();

            let minI = 0;
            let minData = arrLengths[0];
            arrLengths.forEach((_item, index) => {
                if (index > 0) {
                    if (_item < minData) {
                        minData = _item;
                        minI = index;
                    }

                }
            });

            return minI;
        };


        if (data.length <= 4) { // 如果imageListSource为空， 如果数据少于4条
            var len = mobx.toJS(this.imageListSource).length; //  wq_2018-11-21:15:12
            data.forEach((stuff, k) => {
                let ind = (k + 1) > len ? 1 : k; //  wq_2018-11-21:15:12
                this.imageListSource[ind].push(stuff);
            })

        } else {
            data.forEach((item, index) => { this.imageListSource[minIndex()].push(item) });
        }



    }




    // 滚动事件获取流行解读详情页
    // @action async request_onScrolling(id, p = {}, callback) {
    //     let resp = await axios.get(`/api/toboom/popular/show/${id}`, { params: p }),
    //         data = resp.data;
    //     if (data.status_code == 200) {
    //         runInAction(() => {

    //             let _data = data.data;
    //             if (_data && _data.length) this.detailData.push(_data);
    //             callback(_data, p)

    //         })

    //     }

    // }






    // 饼图信息 【 流行解读详情页 】
    @action async request_pieData(id, p) {
        let resp = await axios.get(`/api/toboom/popular/get-pie/${id}`, { params: p }),
            data = resp.data;
        if (data.status_code == 200) {
            runInAction(() => {
                this.pieData = data.data;

            })

        }

    }






    // 收藏
    @action async send_collect(p = {}, callback = function() {}) {
        let resp = await axios.put('api/toboom/style/collect', p),
            data = resp.data;
        if (data.status_code == 200) {
            runInAction(callback)
        }

    }

    // 取消收藏
    @action async onCancelCollect(p = {}, callback = function() {}) {
        let resp = await axios.put('api/toboom/style/cancel-collect', p),
            data = resp.data;
        if (data.status_code == 200) {
            runInAction(callback)
        }
    }


    // 下载
    @action async requestDownload(p = {}, callback = function() {}) {
        let resp = await axios.get('api/toboom/style/download', { params: p }),
            data = resp.data;
        console.log(data);
        if (data.status_code == 200) {
            runInAction(callback)
        }
    }








}