import { observable, computed, action, runInAction } from 'mobx';
import * as axios from 'axios';
import NProgress from 'nprogress';
import qs from 'qs';

export default class EditorStore {
    constructor(global) {
        this.global = global;
    }

    @observable editData = [];
    @observable editTags = [];
    @observable editAllTags = [];
    @observable editLogs = [];
    @observable historyData = [];
    @observable foldersArray = [];


    @computed get get_foldersArray() { return this.foldersArray }


    @action clear_editData() { this.editData = [] }


    @action async fetchLogs(object, isReset) {
        let request = await axios.get(`/api/toboom/works/logs`, { params: object || {} });

        try {

            // this.editData = this.editData.concat(request.data.data);

            this.editData = isReset ? request.data.data : this.editData.concat(request.data.data);

            return Promise.resolve(request);

        } catch (error) {
            throw request.error;
        }
    }


    @action async fetchHistoy(object) {
        let request = await axios.get('/api/toboom/works/recent-modify-design', { params: object || {} });

        try {
            this.historyData = this.historyData.concat(request.data.data);
            return Promise.resolve(this.historyData);
        } catch (error) {
            throw request.error;
        }
    }


    @action async fetchEditData(qsInfo, isReset) {
        // debugger;
        // http://localhost:3000/api/toboom/works/materials
        qsInfo = {...qsInfo, limit: 20 };
        let request = await axios.get(`/api/toboom/works/materials`, {
                // let request = await axios.get(`http://localhost:3000/api/toboom/works/materials`, {
                params: qsInfo
            })
            // debugger;

        // runInAction(()=> {
        try {
            this.editData = isReset ? request.data.data : this.editData.concat(request.data.data);
            // debugger;
            return Promise.resolve(request);
        } catch (error) {
            throw request.error;
        }
        // })

    }

    @action async fetchEditAllTags(qsInfo) {

        let request = await axios.get(`/api/toboom/works/get-tags${'?' + qs.stringify(qsInfo)}`)

        runInAction(() => {
            try {
                this.editAllTags = request.data.data;
            } catch (error) {
                throw request.error;
            }
        })
        return Promise.resolve();

    }



    @action async fetchEditTags(qsInfo) {

        // let q = qs.parse('type=part&attrs%5Bpart%5D=%E9%A2%86%E5%AD%90');

        // debugger;
        let request = await axios.get(`/api/toboom/works/get-tags`, {
                params: qsInfo
            })
            // debugger;
            // runInAction(()=> {
        try {

            this.editTags = qsInfo.type == 'works' ? request.data.data.concat({ name: '收藏', label: '收藏', group_name: "",logo:'/assets/toBoom/images/like.png' }) : request.data.data;
            
        } catch (error) {

            throw request.error;
        }
        // })
        return Promise.resolve(this.editTags);


    }

    @action clearData() {

        runInAction(() => {

            this.editData = [];
            this.editTags = [];
            this.editAllTags = [];
            this.editLogs = [];
            this.historyData = [];

        })

    }



    // 获取文件夹数据
    @action async fetchFolders(p = {}) {
        let request = await axios.get(`/api/toboom/folders`, { params: p });
        runInAction(() => {
            if (request.data.status_code == 200) this.foldersArray = request.data.data;
        })

    }




    // 无用，已作废  2018-11-24
    @action get_requestStrings(rString = []) {

        var requestStrings = [];
        var defaultAttrs = [{
                text: '廓形',
                type: 'contour',
            },
            {
                text: '成品',
                type: 'works',
            },
            {
                text: '部件',
                type: 'part',
            }

        ];

        defaultAttrs.forEach((item, index) => {
            if (item.text == rString[0]) {
                requestStrings[0] = item;
                if (rString.length > 1) {
                    rString.forEach((str, k) => {
                        k > 0 ? requestStrings.push({ type: item.type, text: rString[k] }) : ''
                    })
                }

            }
        });
        return requestStrings
    }



    @action changeEditTags(tags) {
        this.editTags = tags;
    }




}