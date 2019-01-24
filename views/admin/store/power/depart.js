import { observable, action, runInAction, computed } from 'mobx';
import axios from 'axios';

const INITVALUE = {
    title: '',
    desc: '',
    pid: undefined,
    sort: '',
    disabled: '',
    permission_ids: undefined,
};


export default class DepartStore {

    @action setProperties(key, value) {
        if (key instanceof Object) {
            for (let i in key) {
                this[i] = key[i];
            }
        } else if (typeof key == 'string') {
            this[key] = value;
        }

    }


    @observable departsList = {
        dataArry: [],
        count: 0
    };


    @observable departInitialValue = INITVALUE

    @observable deptsTree = [];

    @observable deptsMember = {};


    @computed get get_departsList() { return this.departsList }
    @computed get get_departInitialValue() { return this.departInitialValue }
    @computed get get_deptsTree() { return this.deptsTree }
    @computed get get_deptsMember() { return this.deptsMember }


    @action reset_departInitialValue() { this.departInitialValue = INITVALUE }



    @action async requs_departs(p = {}, callback = function() {}) {
        var resp = await axios.get('/api/admin/depts/', { params: p }),
            data = resp.data;
        if (data.status_code == 200) {
            runInAction(() => {
                this.departsList.dataArry = data.data.data.data;
                this.departsList.count = data.data.data.total;
                callback();
            })
        }
    }



    // 新建
    @action async add_departs(p = {}, callback = function() {}) {
        var resp = await axios.post('/api/admin/depts/', p),
            data = resp.data;
        if (data.status_code == 201) {
            runInAction(() => {
                callback();
            })
        }
    }



    // 启用，禁用
    @action async set_desabled(p = {}, callback = function() {}) {
        var resp = await axios.post('/api/admin/depts/set', p),
            data = resp.data;
        if (data.status_code == 200) {
            runInAction(() => {
                callback();
            })
        }
    }



    // 删除
    @action async delete_nodes(p = {}, callback = function() {}) {
        var resp = await axios.post('/api/admin/depts/delete', p),
            data = resp.data;
        if (data.status_code == 200) {
            runInAction(() => {
                callback();
            })
        }
    }





    // 获取上级部门
    @action async requs_deptsTree() {
        var resp = await axios.get('/api/admin/deptsTree'),
            data = resp.data;
        if (data.status_code == 200) {
            runInAction(() => {
                this.deptsTree = data.data;
            })
        }
    }



    //获取部门成员信息
    @action requs_deptsMember(id, callback = function() {}) {
        var promise = new Promise((resolve, reject) => {
            axios.get(`/api/admin/depts/${id}`).then((resp) => {
                var data = resp.data;
                if (data.status_code == 200) {
                    runInAction(() => {
                        this.deptsMember = data.data;
                        resolve(data.data)
                    })
                } else {
                    reject({})
                }
            })
        });
        return promise
    }



    // 设置部门成员
    @action async set_member(p = {}, id = 0, callback = function() {}) {
        var resp = await axios.put(`/api/admin/depts/staffs/${id}`, p),
            data = resp.data;
        if (data.status_code == 200) {
            runInAction(() => {
                console.log(data)
                callback();
            })
        }
    }












}