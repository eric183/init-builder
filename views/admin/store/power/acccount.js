import { observable, action, runInAction, computed } from 'mobx';
import axios from 'axios';

const INITVALUE = {
    mobile: undefined,
    name: undefined,
    depts: undefined,
    roles: undefined,
    disabled: 0,
};



// 就该数据中的 'disabled' 关键词
function setKeyword(dataArry) {
    if (dataArry.length) {
        dataArry.forEach((item, index) => {
            item.key = item.id;
            item.value = item.id;
            if (item.disabled == 0 || item.disabled == 1) {
                item.disabled_status = item.disabled;
                delete item.disabled;
            }
            if (item.children && item.children.length) {
                setKeyword(item.children)
            }
        })
    }
}


export default class AccountStore {

    @action setProperties(key, value) {
        if (key instanceof Object) {
            for (let i in key) {
                this[i] = key[i];
            }
        } else if (typeof key == 'string') {
            this[key] = value;
        }

    }



    @observable accountList = {
        dataArry: [],
        count: 0
    };


    @observable aInitialValue = INITVALUE;



    @observable roles_depts = {
        roles: [],
        depts: []
    };

    @computed get get_accountList() { return this.accountList }
    @computed get get_aInitialValue() { return this.aInitialValue }
    @computed get get_roles_depts() { return this.roles_depts }


    @action reset_aInitialValue() { this.aInitialValue = INITVALUE }


    @action async requs_accounts(p = {}, callback = function() {}) {
        var resp = await axios.get('/api/admin/rbac/staffs/', { params: p }),
            data = resp.data;
        if (data.status_code == 200) {
            runInAction(() => {
                this.accountList.dataArry = data.data.data;
                this.accountList.count = data.data.total;
                callback();
            })
        }
    }




    // 启用，禁止
    @action async set_desabled(p = {}, callback = function() {}) {
        var resp = await axios.post('/api/admin/rbac/staffs/set/', p),
            data = resp.data;
        if (data.status_code == 200) {
            runInAction(() => {
                callback();
            })
        }
    }



    // 删除
    @action async delete_nodes(p = {}, callback = function() {}) {
        var resp = await axios.post('/api/admin/rbac/staffs/del/', p),
            data = resp.data;
        if (data.status_code == 200) {
            runInAction(() => {
                callback();
            })
        }
    }



    // 获取所有角色
    @action async fetch_allroles() {
        var resp = await axios.get('/api/admin/rbac/roles?limit=0'),
            data = resp.data;
        if (data.status_code == 200) {
            runInAction(() => {
                let dataObj = Object.assign(data.data.data, {}, true);
                setKeyword(dataObj);
                this.roles_depts.roles = dataObj;
            })
        }
    }


    // 获取所有部门
    @action async fetch_alldepst() {
        var resp = await axios.get('/api/admin/deptsTree'),
            data = resp.data;
        if (data.status_code == 200) {
            runInAction(() => {
                this.roles_depts.depts = data.data
            })
        }
    }



    // 关联账号
    @action async assoctedAction(p = {}, id = undefined, callback = function() {}) {
        var url = id ? `/api/admin/rbac/staffs/${id}` : '/api/admin/rbac/staffs/'
        var resp = await axios.post(url, p),
            data = resp.data;
        runInAction(() => {
            callback(data.status_code);
        })
    }



    // 设置密码
    @action async set_password(p = {}, callback = function() {}) {
        var resp = await axios.post('/api/admin/rbac/staffs/pass/', p),
            data = resp.data;
        if (data.status_code == 200) {
            runInAction(() => {
                callback();
            })
        }
    }





}