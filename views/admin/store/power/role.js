import { observable, action, runInAction, computed } from 'mobx';
import axios from 'axios';


const INITVALUE = {
    title: '',
    remarks: '',
    sort: '',
    app_id: [],
    disabled: undefined,
    permission_ids: [],
}


export default class RoleStore {

    @action setProperties(key, value) {
        if (key instanceof Object) {
            for (let i in key) {
                this[i] = key[i];
            }
        } else if (typeof key == 'string') {
            this[key] = value;
        }

    }

    @observable rolesList = [];

    @observable rolesList_count = 0;

    @observable addRolesInitialValue = INITVALUE;

    @observable allAbilities = []; // 所有权限列表

    @observable rolesInfo = {};

    @observable seleteRoles = [];


    @action reset_addRolesInitialValue() {
        this.addRolesInitialValue = INITVALUE;
    }



    @computed get get_rolesList() { return this.rolesList }
    @computed get get_rolesList_count() { return this.rolesList_count }
    @computed get get_addRolesInitialValue() { return this.addRolesInitialValue }
    @computed get get_allAbilities() { return this.allAbilities }
    @computed get get_rolesInfo() { return this.rolesInfo }
    @computed get get_seleteRoles() { return this.seleteRoles }

    @action async requs_roles(p = {}, callback = function() {}) {
        var resp = await axios.get('/api/admin/rbac/roles', { params: p }),
            data = resp.data;
        if (data.status_code == 200) {
            runInAction(() => {
                this.rolesList = data.data.data;
                this.rolesList_count = data.data.total;
                callback();
            })
        }
    }



    // 启用、禁用
    @action async set_desabled(p = {}, callback = function() {}) {
        var resp = await axios.post('api/admin/rbac/roles/set', p),
            data = resp.data;
        if (data.status_code == 200) {
            runInAction(() => {
                callback();
            })
        }
    }


    // 删除
    @action async delete_nodes(p = {}, callback = function() {}) {
        var resp = await axios.post('/api/admin/rbac/roles/del', p),
            data = resp.data;
        if (data.status_code == 200) {
            runInAction(() => {
                callback()
            })
        }
    }


    // 获取权限信息
    @action async requs_power(p = {}, callback = function() {}) {
        var resp = await axios.get('/api/admin/rbac/getAllAbilities', { params: p }),
            data = resp.data;
        if (data.status_code == 201) {
            runInAction(() => {
                this.allAbilities = data.data;
                callback();
            })
        }
    }


    // 获取角色信息
    @action requs_rolesInfo(id, callback = function() {}) {
        var promise = new Promise((resolve, reject) => {
            axios.get(`/api/admin/rbac/roles/${id}`).then((resp) => {
                var data = resp.data;
                if (data.status_code == 200) {
                    runInAction(() => {
                        this.rolesInfo = data.data;
                        resolve(data.data)
                    })
                } else {
                    reject({})
                }
            })
        });

        return promise

    }









    // 获取角色过滤条件
    @action async requs_seleteRoles() {
        var resp = await axios.get('/api/admin/rbac/getFilter'),
            data = resp.data;
        if (data.status_code == 200) {
            runInAction(() => {
                this.seleteRoles = data.data;
            })
        }
    }


    // 成员管理
    @action async set_roles(p = {}, id, callback = function() {}) {
        var resp = await axios.put(`/api/admin/rbac/roleStaff/${id}`, p),
            data = resp.data;
        if (data.status_code == 200) {
            runInAction(() => {
                callback();
            })
        }
    }


    // 创建角色
    @action async add_roles(p = {}, callback = function() {}) {
        var resp = await axios.post('/api/admin/rbac/roles', p),
            data = resp.data;
        if (data.status_code == 201) {
            runInAction(() => {
                callback();
            })
        }
    }
















}