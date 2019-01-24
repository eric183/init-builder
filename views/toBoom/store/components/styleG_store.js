import * as mobx from 'mobx';
import { observable, computed, action, runInAction } from 'mobx';
import axios from 'axios';
import qs from 'qs';


export default class StyleGalleryStore {

    @observable total = 0; // 款式图库数据总数

    @observable count = {}; //  周更新统计数据

    @observable chooesList = { //多选框已选数据
        profile: [],
        clen: [],
        season: []
    };

    @observable checkboxValues = []; // 缓存多选框已选数据

    @observable workcount = 0;

    @observable tagsList = [] // 已经选择的标签列表
    @observable hotKeywords = []; // 热门标签

    @observable imageListSource = [ // 款式图库数据 【 处理过的瀑布流数据 】
        [],
        [],
        [],
        []
    ];

    // 筛选条件数据
    @observable filterData = {
        category: [], // 一级导航
        clen: [],
        day: [],
        details: [],
        order: [],
        part: [],
        profile: [],
        season: [],
        style: [],
        selete_category: ''
    };


    // 二级导航
    @observable subnavData = [];


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
        checkboxSource: {}
    };


    @observable confirmDisable = true;
    // 选择下载文件状态 end 


    @observable tagsArray = {}; // 搜索标签数据


    @action setProperties(key, value) {
        if (key instanceof Object) {

            let keysName = Object.keys(key);
            for (let i = 0; i < keysName.length; i++) {
                this[keysName[i]] = this[keysName[i]] = key[keysName[i]];
            }

            value instanceof Function ? setTimeout(() => { value() }, 150) : '';

        } else if (typeof key == 'string') {
            this[key] = value;
        }
    }


    // 清空 款式图库数据
    @action clearImageListSource() {
        this.imageListSource = [
            [],
            [],
            [],
            []
        ];
    }

    // 获取总数
    @action get_imageListSource_total() {
        let total = 0;
        this.imageListSource.forEach((item, index) => { total += item.length });
        return total;
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
            checkboxSource: {}

        }
        this.confirmDisable = true;

    }




    //多选框操作函数
    @action removeValuFromChooesList(value, name) {
        let index = this.chooesList[name].indexOf(value);
        index > -1 ? this.chooesList[name].splice(index, 1) : '';
    }

    //多选框操作函数
    @action resetChooesList() {
        this.chooesList = {
            profile: [],
            clen: [],
            season: []
        }
    }


    // 移除指定的多选值
    @action removeChooesListItem(item) {
        if (this.chooesList[item.subType]) {
            let index = this.chooesList[item.subType].indexOf(item.tag_id.toString());
            index > -1 ? this.chooesList[item.subType].splice(index, 1) : '';
        }
    }



    // 增标签列表
    @action updateTagsList(param) {
        let index = -1;
        let b = false;
        if (param.type == 'keywords') {
            b = this.tagsList.some(function(item, i) {
                if (item.type == param.type) {
                    index = i;
                    return true
                }
            })
        }

        if (b) {
            this.tagsList[index] = param;
        } else {
            this.tagsList.push(param)
        }
    }


    /*
     * 增加checkbox标签列表 针对传入的是数组参数,防止重复
     */
    @action updateTagsList_checkbox() {
        return new Promise((resolve, reject) => {
            runInAction(() => {
                var checkboxValues = mobx.toJS(this.checkboxValues);
                if (checkboxValues.length) {
                    checkboxValues.forEach((item, index) => { this.updateTagsList(item) });
                }
                resolve();
            })
        });

    }


    // 存储/清除 checkbox 值
    @action storeCheckboxValues(selectedTags) { this.checkboxValues.push(selectedTags) }
    @action cleanCheckboxValues() { this.checkboxValues = [] }
    @action removCheckboxValues(tagObject) {
        var checkboxValues = mobx.toJS(this.checkboxValues);
        for (var index = checkboxValues.length - 1; index >= 0; index--) {
            let item = checkboxValues[index];
            if (item.tag_id == tagObject.id && item.group_id == tagObject.group_id) {
                checkboxValues.splice(index, 1)
            }

        }
        this.checkboxValues = checkboxValues;
    }


    // 增标签列表 针对传入的是数组参数,防止重复
    @action updateTagsList_array(tags) {
        var validItems = [],
            tagsList = mobx.toJS(this.tagsList),
            len = tagsList.length;
        for (var index = len - 1; index >= 0; index--) {
            if (tagsList[index].type == 'tags') tagsList.splice(index, 1)
        }
        tags.forEach((item, index) => {
            var _obj = Object.assign(item, {
                type: 'tags',
                subType: item.group_name,
                group_id: item.group_id || 0,
                tag_id: item.id,
                classname: 'bg3',
                title: item.name
            }, true);
            validItems.push(_obj)
        });
        this.tagsList = tagsList.concat(validItems);

    }







    // 删除标签列表
    @action deleteTagsList(param, callback = function() {}) {
        let index = -1;
        if (param.type == 'keywords') {
            this.tagsList.forEach((item, i) => { if (item.title == param.title) index = i });
        } else {
            this.tagsList.forEach((item, i) => {
                if (item.type == param.type && item.tag_id == param.tag_id && item.subType == param.subType) index = i
            });
        }
        if (index > -1) {
            this.tagsList.splice(index, 1);
            callback();
        }

    }



    // 重置
    @action reset_chooesList_tagsList() {
        this.chooesList = { profile: [], clen: [], season: [] };
        this.tagsList = [];
    }



    // 获取款式图库数据  
    @action async reqest_styleData(p, callback = function() {}) {
        let resp = await axios.post('api/toboom/style', p),
            data = resp.data;
        if (data.status_code == 200) {
            runInAction(() => {
                let _data = data.data.data;
                if (_data && _data.length) {
                    this.imageListSourceAdd(_data);
                    callback(_data);
                } else {
                    callback([]);
                }
            })

        }
    }

    imageListSourceAdd = (data) => {

        var minIndex = () => {
            var sizes = [610, 410, 310, 410]; // 图片的宽度 + 10像素 margin
            var arrLengths = (() => {
                let arrlen = [];
                this.imageListSource.forEach((item, index) => {
                    arrlen[index] = item.length * sizes[index]
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

        data.map((item, index) => {
            this.imageListSource[minIndex()].push(item)
        })

    }



    //  获取本周更新统计  
    @action async reqest_count(p, callback) {
        let resp = await axios.get('api/toboom/style/count'),
            data = resp.data;
        if (data.status_code == 200) {
            runInAction(() => {
                this.count = data.data;
            })
        }

    }


    //  热门标签
    @action async reqest_hotKeywords(p, callback) {
        let resp = await axios.get('api/toboom/style/get-hot-keywords', { params: p }),
            data = resp.data;
        if (data.status_code == 200) {
            runInAction(() => {
                this.hotKeywords = data.data;
            })
        }

    }




    // 获取筛选条件
    // @action async reqest_filterData(p, callback) {
    //     let resp = await axios.get('api/toboom/style/filter-data'),
    //         data = resp.data;
    //     if (data.status_code == 200) {
    //         runInAction(() => {

    //             this.filterData = data.data;
    //             if (data.data.category && data.data.category.length) {
    //                 this.subnavData = data.data.category[0].children;
    //                 callback();
    //             }

    //         })


    //     }

    // }

    @action async reqest_filterData(p, callback) {
        let resp = await axios.get('api/toboom/style/filter-data'),
            data = resp.data;
        if (data.status_code == 200) {
            return new Promise((resolve, reject) => {
                runInAction(() => {
                    this.filterData = data.data;
                    if (data.data.category && data.data.category.length) {
                        this.subnavData = data.data.category[0].children;
                        resolve(data.data);
                    } else {
                        resolve({});
                    }

                })
            })
        }
    }









    // 收藏
    @action async send_collect(p = {}, callback = function() {}) {
        let resp = await axios.put('api/toboom/style/collect', p),
            data = resp.data;
        if (data.status_code == 200) {
            runInAction(callback);
            callback();
        }

    }

    // 取消收藏
    @action async onCancelCollect(p = {}, callback = function() {}) {
        let resp = await axios.put('api/toboom/style/cancel-collect', p),
            data = resp.data;
        if (data.status_code == 200) {
            runInAction(callback);
            callback();
        }
    }



    // 获取搜索关键词
    @action async request_allTags(p = {}, callback = function() {}) {
        let resp = await axios.get('/api/toboom/works/get-tags', { params: p }),
            data = resp.data;
        if (data.status_code == 200) {
            runInAction(() => {
                this.tagsArray = data.data
            });
        }
    }



    // 根据图片ID，获取图片是否带有正分面附图
    @action request_annex(id) {
        return Promise.resolve(axios.get('/api/toboom/works/get-annex-info', { params: { id } }))
    }






}