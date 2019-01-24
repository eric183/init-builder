import { observable, action, runInAction, computed } from 'mobx';
import axios from 'axios';





export default class FashionStore {

    @action setProperties(key, value) {
        if (key instanceof Object) {
            for (let i in key) {
                this[i] = key[i];
            }
        } else if (typeof key == 'string') {
            this[key] = value;
        }

    }




    /*   流行趋势数据 start   */

    @observable f_TableData = [];
    @observable f_TableData_total = 0;

    @observable yearOptions = [];
    @observable subsort = []; // 所属品类

    @observable seasonArry = [];
    @observable editors = [];
    @observable limitedSort = [];
    @observable imageListVisiable = false;

    @observable purposeOptions = [];
    @observable angleOptions = [];
    @observable detailOptions = [];
    @observable styleOptions = [];
    @observable clenOptions = [];
    @observable userInfo = { category: [] };


    @computed get get_yearOptions() { return this.yearOptions }
    @computed get get_subsort() { return this.subsort }
    @computed get get_seasonArry() { return this.seasonArry }
    @computed get get_editors() { return this.editors }
    @computed get get_limitedSort() { return this.limitedSort }


    @computed get get_purposeOptions() { return this.purposeOptions }
    @computed get get_angleOptions() { return this.angleOptions }
    @computed get get_detailOptions() { return this.detailOptions }
    @computed get get_styleOptions() { return this.styleOptions }
    @computed get get_clenOptions() { return this.clenOptions }


    @computed get get_ImageListVisiable() { return this.imageListVisiable };
    @computed get get_F_TableData() { return this.f_TableData }
    @computed get get_F_TableData_total() { return this.f_TableData_total }

    @computed get get_userinfo() { return this.userInfo }


    @action async request_F_TableData(p = {}) {
        let response = await axios.get('/api/admin/toboom/popular', { params: p }, { headers: { 'Content-Type': 'multipart/form-data' } }),
            data = response.data;
        runInAction(() => {
            if (data.status_code == 200) {
                this.f_TableData = data.data.data;
                this.f_TableData_total = data.data.total;
            }
        })
    }




    @action async request_tags(p) {
        let response = await axios.get('/api/admin/toboom/popular/get-tags', { params: { name: p } }),
            data = response.data;
        runInAction(() => {
            if (data.status_code == 200) {
                switch (p) {
                    case 'year':
                        this.yearOptions = data.data;
                        break;
                    case 'season':
                        this.seasonArry = data.data;
                        break;
                    case 'vectorgraph':
                        this.purposeOptions = data.data;
                        break;
                    case 'angle':
                        this.angleOptions = data.data;
                        break;
                    case 'details':
                        this.detailOptions = data.data;
                        break;
                    case 'style':
                        this.styleOptions = data.data;
                        break;
                    case 'clen':
                        this.clenOptions = data.data;
                        break;
                }

            }
        })

    }



    @action async request_subsort(p = {}) {
        let response = await axios.get('/api/admin/toboom/popular/get-subsort', { params: p }),
            data = response.data;
        runInAction(() => {
            if (data.status_code == 200) {
                this.subsort = data.data;
            }
        })
    }




    @action async copy_subsort() {
        this.limitedSort = this.subsort;
    }


    @action async request_limitedSort(p) {
        let response = await axios.get('/api/admin/toboom/popular/get-subsort', { params: p }),
            data = response.data;
        runInAction(() => {
            if (data.status_code == 200) {
                this.limitedSort = data.data;
            }
        })
    }



    @action async request_editors() {
        let response = await axios.get('api/admin/toboom/popular/get-editors'),
            data = response.data;
        runInAction(() => {
            if (data.status_code == 200) {
                this.editors = data.data;
            }
        })
    }









    // 发布 、取消发布
    @action async release_cancel(id, p, callback) {
        let response = await axios.put(`/api/admin/toboom/popular/set-release/${id}`, p),
            data = response.data;
        runInAction(() => {
            if (data.status_code == 200) {

            }
            callback && callback();
        })

    }



    //添加
    @action async add_F_Item(params = {}, callback = undefined) {
        let response = await axios.post('/api/admin/toboom/popular', params),
            data = response.data;
        runInAction(() => {
            if (data.status_code == 200) {
                callback && callback()
            }
        })

    }


    // 编辑 
    @action async edit_F_Item(params, callback = undefined) {
        let response = await axios.put(`/api/admin/toboom/popular/${params.id}`, params),
            data = response.data;
        if (data.status_code == 200) {
            callback && callback();
        }
    }


    // 列表删除
    @action async deleteItem(p = {}, callback = undefined) {
        let response = await axios.post('/api/admin/toboom/popular/delete-pops', p);
        runInAction(() => {
            if (response.status == 204) {
                callback && callback();
            }
        })
    }



    /*   流行趋势数据 end   */





    @observable defaultImg = '';
    @observable initValue = {}; // 初始值


    // 默认表单数据模板  【不可修改】
    @observable defaultFieldsValue = {
        title: '',
        attrs: {
            toboom_sort: undefined,
            year: undefined,
            season: undefined
        },
        folders: [{ // fieldArray
                cid: 10312,
                title: undefined, // 品类
                category: undefined,
                profile: undefined,
                part: undefined,
                vertype: undefined,
                style: undefined,
                clen: undefined,
                details: undefined,
                season: undefined,
                percent: '',
                content: '',
                materials: [ // 四张图片都放一起，默认第一张是主图
                    { id: -1, image: '' },
                    { id: -1, image: '' }, { id: -1, image: '' }, { id: -1, image: '' }
                ]
            },
            {

                cid: 3211,
                title: undefined, // 品类
                category: undefined,
                profile: undefined,
                part: undefined,
                vertype: undefined,
                style: undefined,
                clen: undefined,
                details: undefined,
                season: undefined,
                percent: '',
                content: '',
                materials: [
                    { id: -1, image: '' },
                    { id: -1, image: '' }, { id: -1, image: '' }, { id: -1, image: '', }
                ]
            },
            {

                cid: 3211,
                title: undefined, // 品类
                category: undefined,
                profile: undefined,
                part: undefined,
                vertype: undefined,
                style: undefined,
                clen: undefined,
                details: undefined,
                season: undefined,
                percent: '',
                content: '',
                materials: [
                    { id: -1, image: '' },
                    { id: -1, image: '' }, { id: -1, image: '' }, { id: -1, image: '' }
                ]
            }
        ]
    };







    @observable previewVisiable = false;
    @observable previewdata = [];

    @computed get getPreviewVisiable() { return this.previewVisiable }






    // 素材库
    @computed get getImageListData() { return this.imageListData }

    @action async request_materialList(p = {}, callback = undefined) {
        let response = await axios.get('/api/admin/toboom/resource/list/', { params: p }),
            data = response.data;
        runInAction(() => {
            if (data.status_code == 200) {
                this.imageListData = data.data.data;
                callback && callback();
            }

        })

    }






    // 检查标题
    @action async check_title(p, callback) {
        let resp = await axios.get('/api/admin/toboom/popular/check-exists', { params: p }),
            data = resp.data;
        runInAction(() => {
            if (data.status_code == 200) {
                callback(data.data);
            }
        })


    }



    @observable partTags = [];
    @observable profiletags = [];
    @observable vertypeTags = [];
    @computed get get_partTags() { return this.partTags }
    @computed get get_profiletags() { return this.profiletags }
    @computed get get_vertypeTags() { return this.vertypeTags }



    // 获取所有标签； 【 廓形，部件  】
    @action async request_Allsubtags(p) {
        let resp = await axios.get(`api/admin/toboom/resource/list/get-allsubtags/`, { params: p }),
            data = resp.data;
        runInAction(() => {

            if (data.status_code == 200) {
                switch (p.group) {
                    case 'profile':
                        this.profiletags = data.data;
                        break;
                    case 'part':
                        this.partTags = data.data;
                        break;
                    case 'angle':
                        this.angleTags = data.data;
                        break;
                    case 'vertype':
                        this.vertypeTags = data.data;
                        break;
                    case 'category':
                        this.subsortOptions = data.data;
                        break;
                }
            }
        })
    }




    // 删除指定流行解读文件夹
    @action async deleteFolder(id, callback) {
        let resp = await axios.delete(`api/admin/toboom/popular/delete-folder/${id}`),
            data = resp.data;
        runInAction(() => {
            if (data.status_code == 200) {
                callback && callback();
            }
        })


    }


    // 获取角色权限 
    @action async request_userInfo(callback = function(userinfo) {}) {
        let resp = await axios.get('/api/user/info', { params: { app: 'admin' } }),
            data = resp.data;
        if (data.status_code == 200) {
            runInAction(() => {
                if (data.data instanceof Array) {
                    this.userInfo = { category: [] }
                } else {
                    this.userInfo = data.data;
                    callback(data.data)
                }
            })
        }

    }






}